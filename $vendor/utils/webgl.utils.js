function ven$initWebGLContext(canvasElement) {
	return canvasElement.getContext('webgl')
}

function ven$createShader(gl, type, source) {
	const shader = gl.createShader(type)
	if (shader === null) {
		console.error('unable to create shader.')
		return null
	}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (result) {
		return shader
	}
	const info = gl.getShaderInfoLog(shader)
	console.error('failed to compile shader: ' + info)
	gl.deleteShader(shader)
	return null
}

function ven$createProgram(gl, vertexShaderSource, fragmentShaderSource) {
	const vertexShader = ven$createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	const fragmentShader = ven$createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	const program = gl.createProgram()
	if (!vertexShader || !fragmentShader || !program) {
		return null
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const result = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (result) {
		return program
	}
	const info = gl.getProgramInfoLog(program)
	console.error('failed to link program: ' + info)
	gl.deleteProgram(program)
	return null
}

function ven$getWebGLVariableLocation(
	gl,
	program,
	cfg = {
		glAttributes: [],
		glUniforms: [],
	}
) {
	const { glAttributes = [], glUniforms = [] } = cfg
	const result = { glUniforms: {}, glAttributes: {} }
	for (let i = 0; i < glAttributes.length; i++) {
		const item = glAttributes[i]
		result.glAttributes[item] = gl.getAttribLocation(program, item)
	}
	for (let i = 0; i < glUniforms.length; i++) {
		const item = glUniforms[i]
		result.glUniforms[item] = gl.getUniformLocation(program, item)
	}
	return result
}

/**
 * 初始化缓冲区
 * 		- 创建缓冲区对象
 * 		- 绑定缓冲区对象
 * 			标记此对象内存空间的"使用目标" gl.ARRAY_BUFFER | gl.ELEMENT_ARRAY_BUFFER
 * 		- 写入缓冲区对象
 * 			无法直接向创建的缓冲区写入数据, 而只能向"使用目标"派发数据, 从而间接地实现向缓冲区填充数据
 * 			因此向缓冲区写入数据之前, 需要将其与特定的"使用目标"关联
 * 			(亦可以将"使用目标"类比于向缓冲区空间输送数据的"管道")
 */
function ven$initArrayBufferForLaterUse(gl, data = new Float32Array([])) {
	const buffer = gl.createBuffer()
	if (!buffer) {
		console.error('failed to create the buffer object.')
		return null
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}
function ven$initElementArrayBufferForLaterUse(gl, data = new Float32Array([])) {
	const buffer = gl.createBuffer()
	if (!buffer) {
		console.error('failed to create the buffer object.')
		return null
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
	return buffer
}

/**
 * 分配 GLSL 变量值
 * 		- 将缓冲区对象 buffer 与"使用目标" gl.ARRAY_BUFFER 关联
 * 		- 将与 gl.ARRAY_BUFFER 关联的缓冲区对象的应用分配给 GLSL 变量
 * 			- 为 GLSL 变量 a_attribute 设置特定的缓冲区数据读取规则
 * 		- 为缓冲区对象 buffer 填充数据(当存在传入的数据时)
 * 		- 启用该 GLSL 变量 a_attribute
 */
function ven$initAttributeVariable(gl, a_attribute, buffer, optional, bufferData = {}) {
	if (a_attribute <= -1) {
		return
	}
	const { size, type = gl.FLOAT, normalize = false, stride = 0, offset = 0 } = optional
	const { data, usage = gl.STATIC_DRAW } = bufferData || {}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	if (data) {
		gl.bufferData(gl.ARRAY_BUFFER, data, usage)
	}
	gl.vertexAttribPointer(a_attribute, size, type, normalize, stride, offset)
	gl.enableVertexAttribArray(a_attribute)
}

function ven$initFramebufferObject(gl, offScreenWidth, offScreenHeight) {
	let frameBuffer
	let texture
	let renderBuffer
	const error = () => {
		if (frameBuffer) {
			gl.deleteFramebuffer(frameBuffer)
		}
		if (texture) {
			gl.deleteTexture(texture)
		}
		if (renderBuffer) {
			gl.deleteRenderbuffer(renderBuffer)
		}
		return null
	}

	frameBuffer = gl.createFramebuffer()
	if (!frameBuffer) {
		console.error('failed to create frame buffer object.')
		return error()
	}

	/**
	 * 创建纹理对象
	 * 绑定纹理对象
	 * 设置纹理对象处理参数
	 *      texImage2D: 为纹理对象分配一个可以存储纹理图像的区域
	 */
	texture = gl.createTexture()
	if (!texture) {
		console.log('failed to create texture object')
		return error()
	}
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offScreenWidth, offScreenHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

	/**
	 * 创建渲染缓冲区
	 * 绑定渲染缓冲区
	 * 设置渲染缓冲区尺寸
	 */
	renderBuffer = gl.createRenderbuffer()
	if (!renderBuffer) {
		console.error('failed to create renderbuffer object')
		return error()
	}
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offScreenWidth, offScreenHeight)

	/**
	 * 绑定帧缓冲区
	 */
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

	/**
	 * 将纹理对象关联到帧缓冲区中的颜色关联对象, 作为颜色缓冲区的替代
	 * 将渲染缓冲区关联到帧缓冲区中的深度关联对象, 作为深度缓冲区的替代
	 */
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer)

	const code = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
	if (gl.FRAMEBUFFER_COMPLETE !== code) {
		console.error('frame buffer object is incomplete: ' + code.toString())
		return error()
	}

	frameBuffer.texture = texture
	gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindRenderbuffer(gl.RENDERBUFFER, null)

	return {
		frameBuffer,
		/* ... */
		texture,
		renderBuffer,
	}
}

function ven$loadImageResourceTexture(gl, index, src, callback, optional) {
	const defaultOptional = {
		isFlipY: false,
	}
	const iOptional = { ...defaultOptional, ...(optional || {}) }
	/**
	 * 创建纹理对象
	 */
	const texture = gl.createTexture()
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = function (e) {
		if (iOptional.isFlipY) {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
		}
		/**
		 * 激活纹理单元
		 */
		gl.activeTexture(gl[`TEXTURE${index}`])
		/**
		 * 绑定纹理对象
		 * 		无法直接操作纹理对象
		 * 		需要为创建的纹理对象绑定一个类型"目标"(纹理单元), 后通过该纹理单元往纹理对象填充数据
		 */
		gl.bindTexture(gl.TEXTURE_2D, texture)
		/**
		 * 纹理参数设置
		 */
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		/**
		 * 使用 Image 对象实例填充纹理内容
		 */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		callback && callback(gl, index, texture)
	}
	img.src = src
	return texture
}
