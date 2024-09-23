/**
 * @description 绑定事件
 * @function ven$bindEvent
 * @param {htmllement|string} host 事件的真实宿主元素或用于捕获宿主的选择器
 * @param {string} eventName 事件名称
 * @param {string} selector 触发事件的元素选择器(可选)
 *      如果此项不是一个字符串, 则内部将把此参数作为 callback 处理
 * @param {function} callback 事件处理器
 * @param {boolean} capture 设定以在冒泡/捕获阶段执行事件
 * @return {function}
 */
function ven$bindEvent(host, eventName, selector = null, callback = null, capture = false) {
	let hostElement = host
	if (typeof host === 'string') {
		hostElement = document.querySelector(host)
	}
	if (!hostElement || !eventName || typeof eventName !== 'string' || typeof arguments[2] == 'undefined') {
		return
	}
	let _capture = !!capture
	let _selector = selector
	let _callback = callback
	if (typeof selector === 'function') {
		_callback = selector
		_capture = !!callback
		_selector = null
	}
	const handler = function (e) {
		if (!_selector) {
			_callback && _callback.call(this, e)
			return
		}
		const targetCapture = __ven$bindEvent__captureTargetElement(_selector, e.target, hostElement)
		if (targetCapture) {
			_callback && _callback.call(targetCapture, e)
		}
	}
	hostElement.addEventListener(eventName, handler, _capture)
	return handler
}
function __ven$bindEvent__captureTargetElement(selector, startChildElement, endParentElemet) {
	try {
		const targetElementsArray = Array.from(endParentElemet.querySelectorAll(selector))
		if (!targetElementsArray.length) {
			return null
		}
		let startFindElement = startChildElement
		while (startFindElement) {
			if (startFindElement === endParentElemet.parentElement) {
				return null
			}
			if (targetElementsArray.includes(startFindElement)) {
				return startFindElement
			}
			startFindElement = startFindElement.parentElement
		}
		return startFindElement
	} catch (e) {
		console.warn(`[ven$bindEvent]: Error finding Element element.`)
		console.warn(e)
		return null
	}
}

/**
 * @description 解除绑定事件
 * @function ven$unbindEvent
 * @param {htmllement|string} host 事件的真实宿主元素或用于捕获宿主的选择器
 * @param {string} eventName 事件名称
 * @param {function} handler 事件处理器
 *      此处的 handler 必须是使用 ven$bindEvent 函数后返回的 handler
 * @return {undefined}
 */
function ven$unbindEvent(host, eventName, handler) {
	let hostElement = host
	if (typeof host === 'string') {
		hostElement = document.querySelector(host)
	}
	if (!hostElement || !eventName || typeof eventName !== 'string' || typeof arguments[2] == 'undefined' || !(handler instanceof Function)) {
		return
	}
	hostElement.removeEventListener(eventName, handler)
}
