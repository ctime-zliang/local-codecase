/**
 * @description 获取设备 DPR
 * @function ven$getDPR
 * @return {number}
 */
function ven$getDPR() {
	return window.devicePixelRatio || 1
}

/**
 * @description 获取设备 DPI
 * @function ven$getDPI
 * @return {number}
 */
function ven$getDPI() {
	const DPI = new Array(2)
	const DPR = ven$getDPR()
	const tmpNode = document.createElement('div')
	tmpNode.style.cssText = `height: 1in; width: 1in; left: -100%; top: -100%; position: absolute;`
	document.body.appendChild(tmpNode)
	DPI[0] = parseInt(tmpNode.offsetWidth) * DPR
	DPI[1] = parseInt(tmpNode.offsetHeight) * DPR
	tmpNode.parentNode.removeChild(tmpNode)
	return DPI
}

/**
 * @description 获取设备 DPI
 * @function ven$getAbsoluteDPI
 * @return {number}
 */
function ven$getAbsoluteDPI() {
	const DPI = new Array(2)
	const tmpNode = document.createElement('div')
	tmpNode.style.cssText = `height: 1in; width: 1in; left: -100%; top: -100%; position: absolute;`
	document.body.appendChild(tmpNode)
	DPI[0] = parseInt(tmpNode.offsetWidth)
	DPI[1] = parseInt(tmpNode.offsetHeight)
	tmpNode.parentNode.removeChild(tmpNode)
	return DPI
}
