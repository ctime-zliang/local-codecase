const canvasElement = document.getElementById('webglCanvas')

const vertexShader = `
	attribute vec4 a_position;
	void main() {
		gl_Position = a_position;
		gl_PointSize = 20.0;
	}
`
const fragmentShader = `
	precision mediump float;
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 0.75);
	}
`

function drawSingleDot(gl) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clearDepth(1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	const program = initWebGL(gl, vertexShader, fragmentShader)
	const a_position = gl.getAttribLocation(program, 'a_position')
	gl.vertexAttrib3f(a_position, 0.5, 0.5, 0.0)
	gl.drawArrays(gl.POINTS, 0, 1)
}

function main() {
	gVars.canvasRect = canvasElement.getBoundingClientRect().toJSON()
	gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	const gl = gVars.webglContext
	drawSingleDot(gl)
}

window.addEventListener('DOMContentLoaded', main)
