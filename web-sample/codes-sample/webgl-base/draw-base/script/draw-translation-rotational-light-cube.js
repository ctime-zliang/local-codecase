/**
 * 直线绘制拼凑方式
 */
class SimpleTranslationRotationalLightCubeDraw {
	constructor() {
		this.gl = null
		this.program = null
		this.rAFHandler = null
		this.data = {
			lastTime: 0,
			xAngle: Math.PI / 8,
			// xAngleSpeed: Math.PI / 5000,
			xAngleSpeed: 0,
			yAngle: Math.PI / 4,
			yAngleSpeed: Math.PI / 5000,
		}
	}

	init(gl) {
		this.gl = gl
		this.program = initShader(this.gl, this._vertexShaderSource(), this._fragmentShaderSource())
	}

	render() {
		const a_Position = this.gl.getAttribLocation(this.program, 'a_Position')
		const a_color = this.gl.getAttribLocation(this.program, 'a_color')
		const a_normal = this.gl.getAttribLocation(this.program, 'a_normal')
		const u_lightColor = this.gl.getUniformLocation(this.program, 'u_lightColor')
		const u_lightDirection = this.gl.getUniformLocation(this.program, 'u_lightDirection')

		/**
		 * 给平行光传入
		 *      颜色: RGB(1, 1, 1)
		 *      方向: 单位向量 (x, y, z)
		 **/
		this.gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0)
		const x = 1 / Math.sqrt(15)
		const y = 2 / Math.sqrt(15)
		const z = 3 / Math.sqrt(15)
		this.gl.uniform3f(u_lightDirection, x, y, -z)

		/**
		 * 创建顶点数据
		 */
		// prettier-ignore
		const vertexData = new Float32Array([
            /* 面 1 */
            0.25, 0.25, 0.25, 
            -0.25, 0.25, 0.25, 
            -0.25, -0.25, 0.25, 
            0.25, 0.25, 0.25,
            -0.25, -0.25, 0.25,
            0.25, -0.25, 0.25,
            /* 面 2 */
            0.25, 0.25, 0.25,
            0.25, -0.25, 0.25,
            0.25, -0.25, -0.25,
            0.25, 0.25, 0.25,
            0.25, -0.25, -0.25,
            0.25, 0.25, -0.25,
            /* 面 3 */
            0.25, 0.25, 0.25,
            0.25, 0.25, -0.25,
            -0.25, 0.25, -0.25,
            0.25, 0.25, 0.25,
            -0.25, 0.25, -0.25,
            -0.25, 0.25, 0.25,
            /* 面 4 */
            -0.25, 0.25, 0.25,
            -0.25, 0.25, -0.25,
            -0.25, -0.25, -0.25,
            -0.25, 0.25, 0.25,
            -0.25, -0.25, -0.25,
            -0.25, -0.25, 0.25,
            /* 面 5 */
            -0.25, -0.25, -0.25,
            0.25, -0.25, -0.25,
            0.25, -0.25, 0.25,
            -0.25, -0.25, -0.25,
            0.25, -0.25, 0.25,
            -0.25, -0.25, 0.25,
            /* 面 6 */
            0.25, -0.25, -0.25,
            -0.25, -0.25, -0.25,
            -0.25, 0.25, -0.25,
            0.25, -0.25, -0.25,
            -0.25, 0.25, -0.25,
            0.25, 0.25, -0.25 
        ])
		/**
		 * 创建颜色数据
		 */
		// prettier-ignore
		const colorData = new Float32Array([
            /* 红色 面 1 */
            1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,
            /* 绿色 面 1 */
            0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,
            /* 蓝色 面 1 */
            0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,
            /* 黄色 面 1 */
            1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,     1, 1, 0,
            /* 黑色 面 1 */
            0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,     0, 0, 0,
            /* 灰色 面 1 */
            0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     0.5, 0.5, 0.5 
        ])
		/**
		 * 创建顶点法向量
		 */
		// prettier-ignore
		const normalData = new Float32Array([
            /* Z 轴正方向 面 1 */
            0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,
            /* X 轴正方向 面 1 */
            1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,
            /* Y 轴正方向 面 1 */
            0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0,
            /* X 轴负方向 面 1 */
            -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,     -1, 0, 0,
            /* Y 轴负方向 面 1 */
            0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,     0, -1, 0,
            /* Z 轴负方向 面 1 */
            0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1,     0, 0, -1
        ])

		const vertextBuffer = createBuffer(this.gl, vertexData, a_Position, 3)
		const colorBuffer = createBuffer(this.gl, colorData, a_color, 3)
		const normalBuffer = createBuffer(this.gl, normalData, a_normal, 3)

		/**
		 * 开启深度测试
		 */
		this.gl.enable(this.gl.DEPTH_TEST)

		this.data.lastTime = new Date().getTime()
		this.rAFHandler = window.requestAnimationFrame(this._drawIframe.bind(this))

		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
		window.cancelAnimationFrame(this.rAFHandler)
	}

	_drawIframe(profile) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)

		const { xAngleSpeed, yAngleSpeed } = this.data
		const u_rx = this.gl.getUniformLocation(this.program, 'u_rx')
		const u_ry = this.gl.getUniformLocation(this.program, 'u_ry')

		const nowTime = new Date().getTime()
		const timeOffset = nowTime - this.data.lastTime
		this.data.lastTime = nowTime
		this.data.xAngle += timeOffset * xAngleSpeed
		this.data.yAngle += timeOffset * yAngleSpeed

		const xSin = Math.sin(this.data.xAngle)
		const xCos = Math.cos(this.data.xAngle)
		const ySin = Math.sin(this.data.yAngle)
		const yCos = Math.cos(this.data.yAngle)
		const mxArr = new Float32Array([1, 0, 0, 0, 0, xCos, -xSin, 0, 0, xSin, xCos, 0, 0, 0, 0, 1])
		const myArr = new Float32Array([yCos, 0, -ySin, 0, 0, 1, 0, 0, ySin, 0, yCos, 0, 0, 0, 0, 1])
		this.gl.uniformMatrix4fv(u_rx, false, mxArr)
		this.gl.uniformMatrix4fv(u_ry, false, myArr)

		this._drawTransition(-0.5, 0)
		this._drawTransition(0.5, 0)
		this._drawTransition(0, -0.5)
		this._drawTransition(0, 0.5)

		this.rAFHandler = window.requestAnimationFrame(this._drawIframe.bind(this))
	}

	_drawTransition(xt = 0, yt = 0) {
		const u_tx = this.gl.getUniformLocation(this.program, 'u_tx')
		const u_ty = this.gl.getUniformLocation(this.program, 'u_ty')
		const txArr = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xt, 0, 0, 1])
		const tyArr = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, yt, 0, 1])
		this.gl.uniformMatrix4fv(u_tx, false, txArr)
		this.gl.uniformMatrix4fv(u_ty, false, tyArr)

		this.gl.drawArrays(this.gl.TRIANGLES, 0, 36)
	}

	_vertexShaderSource() {
		const source = `
            /**
             * attribute 顶点位置变量
             */
            attribute vec4 a_Position;
            /**
             * attribute 顶点颜色变量
             */
            attribute vec4 a_color;
            /**
             * attribute 顶点颜色差值
             */
            varying vec4 v_color;
            /**
             * attribute 法向量变量
             */
            attribute vec4 a_normal;
            /**
             * uniform 光照颜色
             */
            uniform vec3 u_lightColor;
            /**
             * uniform 光照方向
             */
            uniform vec3 u_lightDirection;
            /**
             * uniform 旋转矩阵
             */
            uniform mat4 u_rx;
            uniform mat4 u_ry;
            /**
             * uniform 平移矩阵
             */
            uniform mat4 u_tx;
            uniform mat4 u_ty;
            void main() {
                gl_Position = u_tx * u_ty * u_rx * u_ry * a_Position;
                /**
                 * 顶点法向量归一化
                 */
                vec3 normal = normalize((u_rx * u_ry * a_normal).xyz);
                /**
                 * 计算平行光方向向量与顶点法向量的点积
                 */
                float dot = max(dot(u_lightDirection, normal), 0.0);
                vec3 reflectedLight = u_lightColor * a_color.rgb * dot;
                /**
                 * 颜色差值计算
                 */
                v_color = vec4(reflectedLight, a_color.a);
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            precision lowp float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `
		return source
	}
}

window.SimpleTranslationRotationalLightCubeDraw = SimpleTranslationRotationalLightCubeDraw
