/**
 * @description debounce 防抖
 * @function ven$debounce
 * @param {function} fn 高频函数
 * @param {number} delay 延迟时间
 * @param {object} option 配置项
 *      option.immediate = true & option.trailing = false
 * 			在高频事件第一次触发时执行一次回调, 事件触发终止 delay 毫秒后也不会再执行回调
 *      option.immediate = true & option.trailing = true
 * 			在高频事件第一次触发时执行一次回调, 事件触发终止 delay 毫秒后会再执行一次回调
 *      option.immediate = false
 * 			在事件触发终止 delay 毫秒后会执行一次回调
 * 			trailing 设置将失效
 * @return {function}
 */
function ven$debounce(fn, delay = 500, option = { immediate: false, trailing: false }) {
	let timer = null
	return function () {
		if (timer) {
			window.clearTimeout(timer)
		}
		if (!option.immediate) {
			timer = window.setTimeout(() => {
				fn.apply(this, arguments)
			}, delay)
		} else {
			if (!timer) {
				fn.apply(this, arguments)
			}
			timer = window.setTimeout(() => {
				timer = null
				if (option.trailing) {
					fn.apply(this, arguments)
				}
			}, delay)
		}
	}
}
