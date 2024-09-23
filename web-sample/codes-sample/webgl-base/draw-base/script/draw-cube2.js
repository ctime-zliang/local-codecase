/**
 * 索引绘制方式
 */

class SimpleCube2Draw {
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
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            /* ... */
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5
        ])
		/**
		 * 创建顶点索引数据
		 */
		// prettier-ignore
		const vertexIndexes = new Uint8Array([
            0, 1, 2, 3,
            4, 5, 6, 7,
            0, 4,
            1, 5,
            2, 6,
            3, 7
        ])

		/**
		 * 创建索引缓冲区
		 * 将索引缓冲区绑定到 gl
		 * 将索引数据应用到顶点索引缓冲区
		 */
		const indexesBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexesBuffer)
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, vertexIndexes, this.gl.STATIC_DRAW)

		const vertextBuffer = createBuffer(this.gl, vertexData, a_Position, 3)

		/**
		 * 绘制
		 */
		this.gl.drawElements(this.gl.LINE_LOOP, 4, this.gl.UNSIGNED_BYTE, 0)
		this.gl.drawElements(this.gl.LINE_LOOP, 4, this.gl.UNSIGNED_BYTE, 4)
		this.gl.drawElements(this.gl.LINES, 8, this.gl.UNSIGNED_BYTE, 8)
		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
	}

	_vertexShaderSource() {
		const source = `
            attribute vec4 a_Position;
            void main() {
                /**
                 * 设置几何体轴旋转角度为30度
                 * 把角度值转化为浮点值
                 */
                float rotate = radians(30.0);
                /**
                 * 求解三角函数对应值
                 */
                float cosValue = cos(rotate);
                float sinValue = sin(rotate);
                /**
                 * 创建绕 x, y 轴旋转的旋转矩阵
                 */
                mat4 rx = mat4(
                    1, 0,         0,        0, 
                    0, cosValue,  sinValue, 0, 
                    0, -sinValue, cosValue, 0, 
                    0, 0,         0,        1
                );
                mat4 ry = mat4(
                    cosValue, 0, sinValue, 0, 
                    0,        1, 0,         0, 
                    -sinValue, 0, cosValue,  0,
                    0,        0, 0,         1
                );
                /**
                 * 创建绕 x, y 旋转 0 度的旋转矩阵
                 */
                mat4 rx0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                mat4 ry0 = mat4(
                    1, 0, 0, 0, 
                    0, 1, 0, 0, 
                    0, 0, 1, 0, 
                    0, 0, 0, 1 
                );
                gl_Position = rx * ry * a_Position;
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

window.SimpleCube2Draw = SimpleCube2Draw
