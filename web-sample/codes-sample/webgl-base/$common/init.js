const gVars = {}

gVars.initCanvasHandler = canvasElement => {
	gVars.controllerInstance = null

	gVars.canvasElement = canvasElement
	gVars.gl = gVars.canvasElement.getContext('webgl')
}

const handlerDrawGraphicTypeSelector = (selectorElement, dataList, selectedValue, changeCallback) => {
	selectorElement.innerHTML = ven$createSelectOptionsHtmlString(dataList, undefined, selectedValue)
	selectorElement.addEventListener('input', function (e) {
		changeCallback && changeCallback(e.currentTarget.value)
	})
	window.setTimeout(() => {
		changeCallback && changeCallback(selectedValue)
	})
}

const initShader = (gl, vertexShaderSource, fragmentShaderSource, notUseprogram = false) => {
	/**
	 * 创建顶点着色器
	 */
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	/**
	 * 创建片元着色器
	 */
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
	/**
	 * 为着色器引入源代码
	 */
	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.shaderSource(fragmentShader, fragmentShaderSource)
	/**
	 * 编译写入了源代码后的着色器
	 */
	gl.compileShader(vertexShader)
	gl.compileShader(fragmentShader)

	const program = gl.createProgram()
	/**
	 * 将着色器应用到 program, 链接, 使用
	 */
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!notUseprogram) {
		gl.useProgram(program)
	}

	return program
}

function createDrawImageTextureHandler(gl, u_Sampler, imageInstance) {
	return () => {
		/**
		 * 创建纹理图像缓冲区
		 */
		const texture = gl.createTexture()
		/**
		 * 纹理图片上下反转
		 */
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
		/**
		 * 激活 0 号纹理单元 TEXTURE0
		 */
		gl.activeTexture(gl.TEXTURE0)
		/**
		 * 绑定纹理缓冲区
		 */
		gl.bindTexture(gl.TEXTURE_2D, texture)
		/**
		 * 设置纹理贴图填充方式
		 * 		纹理贴图像素尺寸大于顶点绘制区域像素尺寸
		 */
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		/**
		 * 设置纹理贴图填充方式
		 * 		纹理贴图像素尺寸小于顶点绘制区域像素尺寸
		 */
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		/**
		 * 设置纹素格式
		 * 		jpg 格式对应 gl.RGB
		 */
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageInstance)
		/**
		 * 纹理缓冲区单元 TEXTURE0 中的颜色数据传入片元着色器
		 */
		gl.uniform1i(u_Sampler, 0)
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	}
}

const createBuffer = (gl, data, vertex, n) => {
	/**
	 * 创建顶点缓冲区
	 */
	const buffer = gl.createBuffer()
	/**
	 * 将顶点缓冲区绑定到 gl
	 */
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	/**
	 * 将顶点数据应用到顶点缓冲区
	 */
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	/**
	 * 将顶点缓冲区数据 data 传递给位置变量 vertex
	 */
	gl.vertexAttribPointer(vertex, n, gl.FLOAT, false, 0, 0)
	/**
	 * 设置允许传递数据
	 */
	gl.enableVertexAttribArray(vertex)
	return buffer
}
