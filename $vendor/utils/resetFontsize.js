;(function () {
	const MAX_FONTSIZE = 200
	function __resetFontSizeClac() {
		const _fontSize = document.documentElement.clientWidth / 3.75
		return _fontSize > MAX_FONTSIZE ? MAX_FONTSIZE : _fontSize
	}
	document.documentElement.style.fontSize = __resetFontSizeClac() + 'px'
	window.addEventListener('resize', function () {
		document.documentElement.style.fontSize = __resetFontSizeClac() + 'px'
	})
})()
