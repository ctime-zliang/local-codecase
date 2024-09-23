class SimpleRectDraw {
	constructor() {
		this.gl = null
		this.program = null
	}

	init(gl) {
		this.gl = gl
		this.program = initShader(this.gl, this._vertexShaderSource(), this._fragmentShaderSource())
	}

	render() {
		/**
		 * 获取位置变量 a_Position
		 * 该变量定义在着色器源代码中
		 */
		const a_Position = this.gl.getAttribLocation(this.program, 'a_Position')

		/**
		 * 创建顶点数据
		 */
		// prettier-ignore
		const vertexData = new Float32Array([
            0.5, 0.5, 0.0, 
            -0.5, 0.5, 0.0, 
            -0.5, -0.5, 0.0, 
            0.5, -0.5, 0.0
        ])

		const vertextBuffer = createBuffer(this.gl, vertexData, a_Position, 3)

		/**
		 * 绘制
		 * gl.LINE_LOOP
		 */
		this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4)
		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
	}

	_vertexShaderSource() {
		const source = `
            attribute vec4 a_Position;
            void main() {
                gl_Position = a_Position;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `
		return source
	}
}

window.SimpleRectDraw = SimpleRectDraw
