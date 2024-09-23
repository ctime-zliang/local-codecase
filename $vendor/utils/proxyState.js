;(function () {
	const markVersionHolder = [1, 1]

	const globalProxyStoreCache = new WeakMap()
	const globalProxyObjectCache = new WeakMap()
	const globalProxyObjectHandlerMap = new WeakMap()
	const globalSnapCache = new WeakMap()

	const enumMarkOperation = {
		SET: 'SET',
		GET: 'GET',
		DELETE: 'DELETE',
		RESOLVE: 'RESOLVE',
		REJECT: 'REJECT',
	}

	const enumPromiseStatus = {
		FULFILLED: 'fulfilled',
		REJECTED: 'rejected',
	}

	function isObject(val) {
		return typeof val === 'object' && val !== null
	}

	function canProxy(val) {
		return (
			isObject(val) &&
			(Array.isArray(val) || !(Symbol.iterator in val)) &&
			!(val instanceof WeakMap) &&
			!(val instanceof WeakSet) &&
			!(val instanceof Error) &&
			!(val instanceof Number) &&
			!(val instanceof Date) &&
			!(val instanceof String) &&
			!(val instanceof RegExp) &&
			!(val instanceof ArrayBuffer)
		)
	}

	function createSnapshot(objectData, version) {
		const snapCacheItem = globalSnapCache.get(objectData)
		if (snapCacheItem && snapCacheItem[0] === version) {
			return snapCacheItem[1]
		}
		const snapCacheData = Array.isArray(objectData) ? [] : Object.create(Object.getPrototypeOf(objectData))
		globalSnapCache.set(objectData, [version, snapCacheData])
		const ownKeys = Reflect.ownKeys(objectData)
		for (let i = 0; i < ownKeys.length; i++) {
			if (Object.getOwnPropertyDescriptor(snapCacheData, ownKeys[i])) {
				continue
			}
			const value = Reflect.get(objectData, ownKeys[i])
			const descriptor = {
				value,
				enumerable: true,
				configurable: true,
			}
			if (globalProxyObjectHandlerMap.has(value)) {
				const proxyObjectHandlerItem = globalProxyObjectHandlerMap.get(value)
				const { data, ensureVersion } = proxyObjectHandlerItem
				descriptor.value = createSnapshot(data, ensureVersion())
			}
			Object.defineProperty(snapCacheData, ownKeys[i], descriptor)
		}
		return Object.preventExtensions(snapCacheData)
	}

	function subscribe(proxyObject, callback) {
		const proxyObjectHandlerItem = globalProxyObjectHandlerMap.get(proxyObject)
		const ops = []
		let promise
		let isListenerActive = false
		const listener = op => {
			ops.push(op)
			if (!promise) {
				promise = Promise.resolve().then(() => {
					promise = undefined
					if (isListenerActive) {
						callback(ops.splice(0))
					}
				})
			}
		}
		const removeListener = proxyObjectHandlerItem.addListener(listener)
		isListenerActive = true
		return () => {
			isListenerActive = false
			removeListener()
		}
	}

	function snapshot(proxyObject) {
		const proxyObjectHandlerItem = globalProxyObjectHandlerMap.get(proxyObject)
		const { data, ensureVersion, createSnapshot } = proxyObjectHandlerItem
		return createSnapshot(data, ensureVersion())
	}

	class ProxyState {
		constructor(initialObject, parent = null) {
			if (!isObject(initialObject)) {
				throw new Error('need object.')
			}
			const cachedProxyStore = globalProxyStoreCache.get(initialObject)
			if (cachedProxyStore) {
				return cachedProxyStore
			}
			this.parent = parent || null
			this._nowVersion = markVersionHolder[0]
			this._checkVersion = markVersionHolder[1]
			this._listeners = new Set()
			this._proxyObject = null
			this._childMap = new Map()
			this._proxyObjectHandlerItem = null
			this._initial(initialObject)
		}

		_initial(initialObject) {
			const localObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject))
			const proxyObject = new Proxy(localObject, this._createProxyHandler())
			const proxyObjectHandlerItem = this._createProxyObjectHandlerItemObject(localObject)
			this._proxyObject = proxyObject
			this._proxyObjectHandlerItem = proxyObjectHandlerItem
			globalProxyStoreCache.set(initialObject, this)
			globalProxyObjectHandlerMap.set(proxyObject, proxyObjectHandlerItem)
			const ownKeys = Reflect.ownKeys(initialObject)
			for (let i = 0; i < ownKeys.length; i++) {
				const propKey = ownKeys[i]
				const descriptor = Object.getOwnPropertyDescriptor(initialObject, propKey)
				if (descriptor.get || descriptor.set) {
					Object.defineProperty(localObject, propKey, descriptor)
					continue
				}
				proxyObject[propKey] = initialObject[propKey]
			}
		}

		get proxyObject() {
			return this._proxyObject
		}

		_createProxyObjectHandlerItemObject(data) {
			return {
				data,
				createSnapshot,
				ensureVersion: this._ensureVersion.bind(this),
				addListener: this._addListener.bind(this),
				listenerRemove: null,
			}
		}

		_notifyUpdate(op) {
			this._listeners.forEach(listener => {
				listener(op)
			})
		}

		_ensureVersion(nextCheckVersion = ++markVersionHolder[1]) {
			let maxNowVersion = this._nowVersion
			if (this._checkVersion !== nextCheckVersion) {
				this._checkVersion = nextCheckVersion
				this._childMap.forEach((childProxyStore, key) => {
					const propProxyObjectHandlerItem = childProxyStore._proxyObjectHandlerItem
					const propVersion = propProxyObjectHandlerItem.ensureVersion(nextCheckVersion)
					if (propVersion > maxNowVersion) {
						maxNowVersion = propVersion
					}
				})
			}
			return maxNowVersion
		}

		_addPropListener(propKey, proxyObjectHandlerItem) {
			if (this._listeners.size) {
				const listenerRemove = proxyObjectHandlerItem.addListener(op => {
					const newOp = [...op]
					newOp[1] = [propKey, ...newOp[1]]
					this._notifyUpdate(newOp)
				})
				proxyObjectHandlerItem.listenerRemove = listenerRemove
				return
			}
		}

		_removePropListener(propKey) {
			if (!this._childMap.has(propKey)) {
				return
			}
			const proxyObjectHandlerItem = this._childMap.get(propKey)._proxyObjectHandlerItem
			if (proxyObjectHandlerItem.listenerRemove instanceof Function) {
				proxyObjectHandlerItem.listenerRemove()
			}
			this._childMap.delete(propKey)
		}

		_addListener(listener) {
			this._listeners.add(listener)
			if (this._listeners.size === 1) {
				this._childMap.forEach((childProxyStore, key) => {
					const propProxyObjectHandlerItem = childProxyStore._proxyObjectHandlerItem
					const listenerRemove = propProxyObjectHandlerItem.addListener(op => {
						const newOp = [...op]
						newOp[1] = [key, ...newOp[1]]
						this._notifyUpdate(newOp)
					})
					propProxyObjectHandlerItem.listenerRemove = listenerRemove
				})
			}
			return () => {
				this._listeners.delete(listener)
				if (this._listeners.size <= 0) {
					this._childMap.forEach(childProxyStore => {
						const propProxyObjectHandlerItem = childProxyStore._proxyObjectHandlerItem
						if (propProxyObjectHandlerItem.listenerRemove instanceof Function) {
							propProxyObjectHandlerItem.listenerRemove()
							propProxyObjectHandlerItem.listenerRemove = null
						}
					})
				}
			}
		}

		_createProxyHandler() {
			const self = this
			return {
				deleteProperty(target, prop) {
					const prevValue = Reflect.get(target, prop)
					self._removePropListener(prop)
					const deleted = Reflect.deleteProperty(target, prop)
					if (deleted) {
						self._nowVersion = ++markVersionHolder[0]
						self._notifyUpdate([enumMarkOperation.DELETE, [prop], undefined, prevValue])
					}
					return deleted
				},
				set(target, prop, value, receiver) {
					const hasPrev = Reflect.has(target, prop)
					const oldValue = Reflect.get(target, prop, receiver)
					if (
						(hasPrev && oldValue === value) ||
						(globalProxyObjectCache.has(value) && Object.is(oldValue, globalProxyObjectCache.get(value)))
					) {
						return true
					}
					self._removePropListener(prop)
					let newValue = value
					if (value instanceof Promise) {
						value
							.then(v => {
								value.status = enumPromiseStatus.FULFILLED
								value.value = v
								self._nowVersion = ++markVersionHolder[0]
								self.notifyUpdate([enumMarkOperation.RESOLVE, [prop], v, oldValue])
							})
							.catch(e => {
								value.status = enumPromiseStatus.REJECTED
								value.reason = e
								self._nowVersion = ++markVersionHolder[0]
								self.notifyUpdate([enumMarkOperation.REJECT, [prop], e, undefined])
							})
					} else {
						if (canProxy(newValue) && !globalProxyObjectHandlerMap.has(newValue)) {
							const hasExist = globalProxyStoreCache.has(newValue)
							const childProxyStore = new ProxyState(newValue, self)
							!hasExist && self._childMap.set(prop, childProxyStore)
							newValue = childProxyStore.proxyObject
							self._addPropListener(prop, childProxyStore._proxyObjectHandlerItem)
						}
					}
					const res = Reflect.set(target, prop, newValue, receiver)
					self._nowVersion = ++markVersionHolder[0]
					self._notifyUpdate([enumMarkOperation.SET, [prop], value, oldValue])
					return res
				},
			}
		}
	}

	const xProxy = {
		ProxyState,
		snapshot,
		subscribe,
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = xProxy
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return xProxy
		})
	} else {
		;(function () {
			return this || (0, eval)('this')
		})().xProxy = xProxy
	}
})()
