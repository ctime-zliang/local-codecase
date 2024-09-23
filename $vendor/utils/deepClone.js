/**
 * @description JSON 深拷贝
 * @function ven$deepClone
 * @param {object|array} data 被深拷贝的 JSON 数据
 * @return {object|array}
 */
function ven$deepClone(data) {
	const wMap = new WeakMap()
	return traverse(data)

	function traverse(data) {
		const result = {}
		let keys = []
		let item = null

		if (wMap.get(data)) {
			return wMap.get(data)
		}
		keys = Object.keys(data)
		wMap.set(data, result)

		for (let i = 0; i < keys.length; i++) {
			item = data[keys[i]]
			if (Object.prototype.toString.call(item).slice(8, -1) === 'Object') {
				result[keys[i]] = traverse(item)
			} else {
				result[keys[i]] = item
			}
		}
		return result
	}
}

/**
 * @description JSON 深拷贝
 * @function ven$deepClone2
 * @param {object|array} json 被深拷贝的 JSON 数据
 * @return {object|array}
 */
function ven$deepClone2(data) {
	return traverse(data)

	function traverse(data) {
		if (
			typeof data !== 'object' ||
			data === null ||
			data instanceof Date ||
			data instanceof ArrayBuffer ||
			data instanceof Uint8ClampedArray ||
			data instanceof Uint8Array ||
			data instanceof Uint16Array ||
			data instanceof Uint32Array
		) {
			return data
		}
		if (Array.isArray(data)) {
			return data.map(traverse)
		}
		const obj = {}
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				obj[key] = traverse(data[key])
			}
		}
		return obj
	}
}

/**
 * @description JSON 深拷贝
 * @function ven$deepClone3
 * @param {object|array} json 被深拷贝的 JSON 数据
 * @return {promise<object|array|null>}
 */
function ven$deepClone3(json) {
	return new Promise(resolve => {
		try {
			const { port1, port2 } = new MessageChannel()
			port2.onmessage = function (e) {
				resolve(e.data)
			}
			port1.postMessage(json)
		} catch (e) {
			resolve(null)
		}
	})
}
