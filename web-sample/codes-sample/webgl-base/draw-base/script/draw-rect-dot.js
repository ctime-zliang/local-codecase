class SimpleRectDotDraw {
	constructor() {
		this.gl = null
		this.program = null
	}

	init(gl) {
		this.gl = gl
		this.program = initShader(this.gl, this._vertexShaderSource(), this._fragmentShaderSource())
	}

	render() {
		this.gl.drawArrays(this.gl.POINTS, 0, 1)
		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
	}

	_vertexShaderSource() {
		const source = `
            void main() {
                gl_PointSize = 10.0;
                gl_Position = vec4(0.5, 0.5, 0.0, 1.0);
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            }
        `
		return source
	}
}

window.SimpleRectDotDraw = SimpleRectDotDraw
