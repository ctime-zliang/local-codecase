/**
 * Reset HTML Document Font-Size width Device-Width
 *   @version 1.0.0
 *   @author author
 */

//重置页面基准值
//针对 640px PSD
;(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth
			if (!clientWidth) return
			docEl.style.fontSize = 128 * (clientWidth / 640) + 'px'
		}
	if (!doc.addEventListener) return
	win.addEventListener(resizeEvt, recalc, false)
	doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

//重置页面基准值
//针对 750px PSD
;(function () {
	function reset_clac() {
		var _font_size = document.documentElement.clientWidth / 3.75
		return _font_size > 200 ? 200 : _font_size
	}
	document.documentElement.style.fontSize = reset_clac() + 'px'
	window.onresize = function () {
		document.documentElement.style.fontSize = reset_clac() + 'px'
	}
})()
