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

function ven$initAttributeVariable(gl, a_attribute, buffer, optional, bufferData = {}) {
	if (a_attribute <= -1) {
		return
	}
	const { size, type = gl.FLOAT, normalize = false, stride = 0, offset = 0 } = optional
	const { target = gl.ARRAY_BUFFER, data, usage = gl.STATIC_DRAW } = bufferData || {}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	if (data) {
		gl.bufferData(target, data, usage)
	}
	gl.vertexAttribPointer(a_attribute, size, type, normalize, stride, offset)
	gl.enableVertexAttribArray(a_attribute)
}

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

function ven$loadImageResourceTexture(gl, src, callback) {
	const texture = gl.createTexture()
	const img = new Image()
	img.crossOrigin = 'anonymous'
	img.onload = function (e) {
		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		/**
		 * 纹理参数设置
		 */
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		/**
		 * 使用 Image 对象实例填充纹理内容
		 */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		callback && callback(gl, texture)
	}
	img.src = src
	return texture
}
