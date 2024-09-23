ven$importScript('../common/utils/cuon-matrix.js')

function main() {
	const appContainerElement = document.getElementById('appContainer')
	drawCanvas(appContainerElement)
}

window.onload = function () {
	main()
}
