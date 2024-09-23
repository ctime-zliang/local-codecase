class SimpleGradientLineDraw {
	constructor() {
		this.gl = null
		this.program = null
	}

	init(gl) {
		this.gl = gl
		this.program = initShader(this.gl, this._vertexShaderSource(), this._fragmentShaderSource())
	}

	render() {
		const a_Position = this.gl.getAttribLocation(this.program, 'a_Position')
		const a_color = this.gl.getAttribLocation(this.program, 'a_color')

		const vertexData = new Float32Array([-0.5, 0.5, 0, 0.5, 0.5, 0])
		const colorData = new Float32Array([1, 0, 0, 0, 1, 0])

		const vertextBuffer = createBuffer(this.gl, vertexData, a_Position, 3)
		const colorBuffer = createBuffer(this.gl, colorData, a_color, 3)

		this.gl.drawArrays(this.gl.LINES, 0, 2)
		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
	}

	_vertexShaderSource() {
		const source = `
            /**
             * 顶点坐标
             */
            attribute vec4 a_Position;
            /**
             * 顶点颜色
             */
            attribute vec4 a_color;
            /**
             * 实时计算出的差值颜色
             */
            varying vec4 v_color;
            void main() {
                gl_Position = a_Position;
                v_color = a_color;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            /**
             * 设置 所有float类型数据的精度是lowp
             */
            precision lowp float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `
		return source
	}
}

window.SimpleGradientLineDraw = SimpleGradientLineDraw
