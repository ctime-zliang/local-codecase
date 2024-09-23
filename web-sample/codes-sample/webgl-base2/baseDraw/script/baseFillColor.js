const canvasElement = document.getElementById('webglCanvas')

function fillColor(gl) {
	gl.clearColor(1.0, 1.0, 0.0, 0.5)
	gl.clear(gl.COLOR_BUFFER_BIT)
}

function main() {
	gVars.canvasRect = canvasElement.getBoundingClientRect().toJSON()
	gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	const gl = gVars.webglContext
	fillColor(gl)
}

window.addEventListener('DOMContentLoaded', main)
