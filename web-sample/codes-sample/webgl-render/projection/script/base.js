ven$importScript('../common/utils/cuon-matrix.js')

function main() {
	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element)

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas2(appContainer2Element)
}

window.onload = function () {
	main()
}
