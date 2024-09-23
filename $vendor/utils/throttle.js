/**
 * @description throttle 节流
 * @function ven$throttleStamp
 * @param {function} fn 高频函数
 * @param {number} delay 延迟时间
 * @return {function}
 */
function ven$throttleStamp(fn, delay = 500) {
	let previous = 0
	return function () {
		let now = +new Date()
		if (now - previous > delay) {
			fn.apply(this, arguments)
			previous = now
		}
	}
}

/**
 * @description throttle 节流
 * @function ven$throttleTimeout
 * @param {function} fn 高频函数
 * @param {number} delay 延迟时间
 * @return {function}
 */
function ven$throttleTimeout(fn, delay = 500) {
	let timer = null
	return function () {
		if (!timer) {
			timer = window.setTimeout(() => {
				timer = null
				fn.apply(this, arguments)
			}, delay)
		}
	}
}
