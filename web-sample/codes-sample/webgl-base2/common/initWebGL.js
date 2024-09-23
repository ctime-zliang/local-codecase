function initWebGLContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('webgl')
}

function init2DContext(canvasElement) {
	gVars.canvasElement = canvasElement
	return canvasElement.getContext('2d')
}

function createShader(gl, type, source) {
	/**
	 * 创建 shader 对象
	 */
	const shader = gl.createShader(type)
	/**
	 * 往 shader 中写入源代码
	 */
	gl.shaderSource(shader, source)
	/**
	 * 编译 shader
	 */
	gl.compileShader(shader)
	/**
	 * 判断是否编译成功
	 */
	const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (result) {
		return shader
	}
	const info = gl.getShaderInfoLog(shader)
	console.error(info)
	gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
	/**
	 * 创建 WebGL 程序
	 */
	const program = gl.createProgram()
	/**
	 * 往 program 中写入着色器
	 */
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	/**
	 * 链接程序
	 */
	gl.linkProgram(program)
	/**
	 * 判断是否链接成功
	 */
	const result = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (result) {
		return program
	}
	const info = gl.getProgramInfoLog(program)
	console.error(info)
	gl.deleteProgram(program)
}

function createBuffer(gl, bufferTypedArray) {
	/**
	 * 创建缓冲池
	 */
	const buffer = gl.createBuffer()
	/**
	 * 绑定缓冲池
	 */
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	/**
	 * 对缓冲池填充数据
	 */
	gl.bufferData(gl.ARRAY_BUFFER, bufferTypedArray, gl.STATIC_DRAW)
	return buffer
}

function initWebGL(gl, vertexShaderSouce, fragmentShaderSouce) {
	/**
	 * 创建并初始化着色器
	 */
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSouce)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSouce)
	/**
	 * 创建并初始化 WebGL 程序
	 */
	const program = createProgram(gl, vertexShader, fragmentShader)
	/**
	 * 使用程序
	 */
	gl.useProgram(program)
	return program
}
