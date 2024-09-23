const canvasElement = document.getElementById('webglCanvas')

const vertices = [
	[-0.7, 0.5],
	[-0.4, 0.3],
	[-0.25, 0.71],
	[-0.1, 0.56],
	[-0.1, 0.13],
	[0.4, 0.21],
	[0, -0.6],
	[-0.3, -0.3],
	[-0.6, -0.3],
	[-0.45, 0.0],
]

const vertex = `
	attribute vec2 position;
	uniform vec4 u_color;
	varying vec4 vColor;
	void main() {
  		gl_PointSize = 1.0;
  		gl_Position = vec4(position, 1.0, 1.0);
  		vColor = u_color;
	}
`
const fragment = `
	precision mediump float;
	varying vec4 vColor;
	void main() {
  		gl_FragColor = vColor;
	}
`
const points = vertices.flat()
const triangles = earcut(points)

const position = new Float32Array(points)
const cells = new Uint16Array(triangles)

console.log(points)
console.log(triangles)

function initWebGLProgram(gl) {
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShader, vertex)
	gl.compileShader(vertexShader)

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShader, fragment)
	gl.compileShader(fragmentShader)

	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	gl.useProgram(program)

	return program
}

function fillWebGLBuffer(gl, program, positionData, cellsData) {
	const pointBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW)

	const vPosition = gl.getAttribLocation(program, 'position')
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(vPosition)

	const cellsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cellsData, gl.STATIC_DRAW)

	const colorLoc = gl.getUniformLocation(program, 'u_color')
	gl.uniform4fv(colorLoc, [1, 0, 0, 1])

	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawElements(gl.TRIANGLES, cellsData.length, gl.UNSIGNED_SHORT, 0)
}

function canvasMousemoveHandler1(e) {
	const gl = gVars.webglContext
	const program = gVars.webglProgram
	const offsetX = (2 * (e.clientX - gVars.canvasRect.left)) / gVars.canvasRect.width - 1.0
	const offsetY = 1.0 - (2 * (e.clientY - gVars.canvasRect.top)) / gVars.canvasRect.height

	gl.clear(gl.COLOR_BUFFER_BIT)

	const colorLoc = gl.getUniformLocation(program, 'u_color')
	const vp = new Vector2(offsetX, offsetY)
	const flag = isPointInPath({ vertices, cells }, vp)

	if (flag) {
		gl.uniform4fv(colorLoc, [0, 0.5, 0, 1])
	} else {
		gl.uniform4fv(colorLoc, [1, 0, 0, 1])
	}
	gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0)
}

function bindEvent() {
	gVars.canvasElement.addEventListener('mousemove', canvasMousemoveHandler1, false)
}

function main() {
	gVars.canvasRect = canvasElement.getBoundingClientRect().toJSON()
	gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	gVars.webglProgram = initWebGLProgram(gVars.webglContext)
	fillWebGLBuffer(gVars.webglContext, gVars.webglProgram, position, cells)

	bindEvent()
}

window.addEventListener('DOMContentLoaded', main)
