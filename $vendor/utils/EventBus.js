const DEFAULT_NS = `stname`

class Ven$EventBus {
	constructor() {
		this.handlers = {}
	}

	on(eventName, callback, spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || typeof callback !== 'function') {
			return
		}
		if (!handlers[sn]) {
			handlers[sn] = {}
		}
		if (!handlers[sn][eventName] || !handlers[sn][eventName].length) {
			handlers[sn][eventName] = []
		}
		handlers[sn][eventName].push(callback)
	}

	async emit(eventName, params = null, spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || !handlers[sn]) {
			return
		}
		const length = (handlers[sn][eventName] || []).length
		for (let i = 0; i < length; i++) {
			await handlers[sn][eventName][i](params)
		}
	}

	subscribe(eventName, callback, spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || typeof callback !== 'function') {
			return
		}
		if (!handlers[sn]) {
			handlers[sn] = {}
		}
		handlers[sn][eventName] = callback
	}

	async exec(eventName, params, spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		return new Promise(async _ => {
			try {
				let errorMsg = null
				if (!eventName || typeof eventName !== 'string') {
					errorMsg = new Error(`Illegal parameter`)
				}
				if (!handlers[sn]) {
					errorMsg = new Error(`Unknown namespace`)
				}
				if (!handlers[sn][eventName] || typeof handlers[sn][eventName] !== 'function') {
					errorMsg = new Error(`Unknown listening function`)
				}
				if (errorMsg) {
					_({ error: errorMsg, data: null, __arguments: { eventName, params, spaceName: sn } })
					return
				}
				const fn = handlers[sn][eventName]
				const res = await fn(params)
				_({ error: null, data: res, __arguments: { eventName, params, spaceName: sn } })
			} catch (e) {
				_({ error: e, data: null, __arguments: { eventName, params, spaceName: sn } })
			}
		})
	}

	clearEvent(eventName, spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!eventName || typeof eventName !== 'string' || !handlers[sn]) {
			return
		}
		delete handlers[sn][eventName]
	}

	clearNameSpace(spaceName = DEFAULT_NS) {
		const handlers = this.handlers
		const sn = spaceName || DEFAULT_NS
		if (!handlers[sn]) {
			return
		}
		handlers[sn] = {}
	}
}
