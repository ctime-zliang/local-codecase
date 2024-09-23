/**
 * 直线绘制拼凑方式
 */
class SimpleChartletLightCubeDraw {
	constructor() {
		this.gl = null
		this.cubeProgram = null
		this.chartletProgram = null
		this.rAFHandler = null
		this.imageInstance = null
		this.data = {
			lastTime: 0,
			xAngle: Math.PI / 6,
			// xAngleSpeed: Math.PI / 5000,
			xAngleSpeed: 0,
			yAngle: Math.PI / 6,
			yAngleSpeed: Math.PI / 5000,
		}
	}

	init(gl) {
		this.gl = gl
		this.chartletProgram = initShader(this.gl, this._chartletVertexShaderSource(), this._chartletFragmentShaderSource(), true)
		this.cubeProgram = initShader(this.gl, this._cubeVertexShaderSource(), this._cubeFragmentShaderSource(), true)
	}

	render() {
		/**
		 * 开启深度测试
		 */
		this.gl.enable(this.gl.DEPTH_TEST)

		/**
		 * 创建顶点数据
		 *      以直角坐标系坐标原点为中心
		 */
		// prettier-ignore
		const chartletVertexData = new Float32Array([
            /* 左上角 */
            -0.4, 0.2, -0.51, 
            /* 左下角 */
            -0.4, -0.2, -0.51,
            /* 右上角 */
            0.4, 0.2, -0.51,
            /* 右下角 */
            0.4, -0.2,-0.51,
        ])
		/**
		 * 创建纹理顶点数据
		 *      以第一象限的中点为中心
		 */
		// prettier-ignore
		const chartletTextureVertexData = new Float32Array([
            /* 左上角 */
            0.0, 1.0, 0.0, 
            /* 左下角 */
            0.0, 0.0, 0.0,
            /* 右上角 */
            1.0, 1.0, 0.0,
            /* 右下角 */
            1.0, 0.0, 0.0,
        ])

		/**
		 * 创建 cube 顶点数据
		 */
		// prettier-ignore
		const cubeVertexData = new Float32Array([
            /* 面 1 */
            0.5, 0.5, 0.5, 
            -0.5, 0.5, 0.5, 
            -0.5, -0.5, 0.5, 
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            /* 面 2 */
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            /* 面 3 */
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            /* 面 4 */
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            /* 面 5 */
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            /* 面 6 */
            0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5 
        ])
		/**
		 * 创建 cube 颜色数据
		 */
		// prettier-ignore
		const cubeColorData = new Float32Array([
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
		 * 创建 cube 顶点法向量
		 */
		// prettier-ignore
		const cubeNormalData = new Float32Array([
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

		const imageInstance = new Image()
		const drawHandler = this._drawTexture.bind(this)
		imageInstance.onload = evte => {
			this.imageInstance = evte.target
			drawHandler(chartletVertexData, chartletTextureVertexData, cubeVertexData, cubeColorData, cubeNormalData)
		}
		imageInstance.src = window.$image01

		console.log(this.chartletProgram)
		console.log(this.cubeProgram)
	}

	destory() {
		console.log(this.constructor.name)
		window.cancelAnimationFrame(this.rAFHandler)
	}

	_drawTexture(chartletVertexData, chartletTextureVertexData, cubeVertexData, cubeColorData, cubeNormalData) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)

		const { mxArr, myArr } = this._createRotateMatrix()

		const chartlet_u_rx = this.gl.getUniformLocation(this.chartletProgram, 'u_rx')
		const chartlet_u_ry = this.gl.getUniformLocation(this.chartletProgram, 'u_ry')
		const chartlet_a_Position = this.gl.getAttribLocation(this.chartletProgram, 'a_Position')
		const chartlet_a_TexturePosition = this.gl.getAttribLocation(this.chartletProgram, 'a_TexturePosition')
		const chartlet_u_Sampler = this.gl.getUniformLocation(this.chartletProgram, 'u_Sampler')

		const cube_u_rx = this.gl.getUniformLocation(this.cubeProgram, 'u_rx')
		const cube_u_ry = this.gl.getUniformLocation(this.cubeProgram, 'u_ry')
		const cube_a_Position = this.gl.getAttribLocation(this.cubeProgram, 'a_Position')
		const cube_a_color = this.gl.getAttribLocation(this.cubeProgram, 'a_color')
		const cube_a_normal = this.gl.getAttribLocation(this.cubeProgram, 'a_normal')
		const cube_u_lightColor = this.gl.getUniformLocation(this.cubeProgram, 'u_lightColor')
		const cube_u_lightDirection = this.gl.getUniformLocation(this.cubeProgram, 'u_lightDirection')

		/**
		 * 创建纹理图像缓冲区
		 */
		const texture = this.gl.createTexture()
		/**
		 * 纹理图片上下反转
		 */
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
		/**
		 * 激活 0 号纹理单元 TEXTURE0
		 */
		this.gl.activeTexture(this.gl.TEXTURE0)
		/**
		 * 绑定纹理缓冲区
		 */
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
		/**
		 * 设置纹理贴图填充方式
		 * 		纹理贴图像素尺寸大于顶点绘制区域像素尺寸
		 */
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
		/**
		 * 设置纹理贴图填充方式
		 * 		纹理贴图像素尺寸小于顶点绘制区域像素尺寸
		 */
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
		/**
		 * 设置纹素格式
		 * 		jpg 格式对应 gl.RGB
		 */
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.imageInstance)
		/**
		 * 执行 useProgram 方法
		 *      GPU 执行纹理映射着色器程序
		 */
		this.gl.useProgram(this.chartletProgram)
		/**
		 * 执行 useProgram 方法
		 *      GPU 执行纹理映射着色器程序
		 */
		const chartletVertextBuffer = createBuffer(this.gl, chartletVertexData, chartlet_a_Position, 3)
		const chartletTextureVertextBuffer = createBuffer(this.gl, chartletTextureVertexData, chartlet_a_TexturePosition, 3)
		/**
		 * 传入纹理图片旋转矩阵数据
		 */
		this.gl.uniformMatrix4fv(chartlet_u_rx, false, mxArr)
		this.gl.uniformMatrix4fv(chartlet_u_ry, false, myArr)
		/**
		 * 纹理缓冲区单元 TEXTURE0 中的颜色数据传入片元着色器
		 */
		this.gl.uniform1i(chartlet_u_Sampler, 0)
		/**
		 * 执行绘制
		 *      纹理映射像素值存入颜色缓冲区
		 */
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

		/**
		 * 切换着色器程序, 重新配置 GPU 执行立方体着色器程序
		 */
		this.gl.useProgram(this.cubeProgram)
		/**
		 * 配置顶点数据
		 */
		const cubeVertextBuffer = createBuffer(this.gl, cubeVertexData, cube_a_Position, 3)
		const cubeColorBuffer = createBuffer(this.gl, cubeColorData, cube_a_color, 3)
		const cubeNormalBuffer = createBuffer(this.gl, cubeNormalData, cube_a_normal, 3)
		/**
		 * 传入立方体旋转矩阵数据
		 */
		this.gl.uniformMatrix4fv(cube_u_rx, false, mxArr)
		this.gl.uniformMatrix4fv(cube_u_ry, false, myArr)
		/**
		 * 传入光的颜色和方向数据
		 */
		this.gl.uniform3f(cube_u_lightColor, 1.0, 1.0, 1.0)
		/**
		 * 给平行光传入
		 *      颜色: RGB(1, 1, 1)
		 *      方向: 单位向量 (x, y, z)
		 **/
		this.gl.uniform3f(cube_u_lightColor, 1.0, 1.0, 1.0)
		const x = 1 / Math.sqrt(15)
		const y = 2 / Math.sqrt(15)
		const z = 3 / Math.sqrt(15)
		this.gl.uniform3f(cube_u_lightDirection, x, y, -z)
		/**
		 * 执行绘制
		 *      立方体像素值存入颜色缓冲区
		 */
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 36)
	}

	_createRotateMatrix(profile) {
		const xSin = Math.sin(this.data.xAngle)
		const xCos = Math.cos(this.data.xAngle)
		const ySin = Math.sin(this.data.yAngle)
		const yCos = Math.cos(this.data.yAngle)
		const mxArr = new Float32Array([1, 0, 0, 0, 0, xCos, -xSin, 0, 0, xSin, xCos, 0, 0, 0, 0, 1])
		const myArr = new Float32Array([yCos, 0, -ySin, 0, 0, 1, 0, 0, ySin, 0, yCos, 0, 0, 0, 0, 1])
		return {
			mxArr,
			myArr,
		}
	}

	_cubeVertexShaderSource() {
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
            void main() {
                gl_Position = u_rx * u_ry * a_Position;
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

	_cubeFragmentShaderSource() {
		const source = `
            precision lowp float;
            varying vec4 v_color;
            void main() {
                gl_FragColor = v_color;
            }
        `
		return source
	}

	_chartletVertexShaderSource() {
		const source = `
            /**
             * 顶点位置坐标
             */
            attribute vec4 a_Position;
            /**
             * 纹理顶点位置坐标
             */
            attribute vec2 a_TexturePosition;
            /**
             * 计算差值后的纹理顶点坐标
             */
            varying vec2 v_TexturePosition;
            /**
             * uniform 旋转矩阵
             */
            uniform mat4 u_rx;
            uniform mat4 u_ry;
            void main() {
                /**
                 * 逐顶点处理
                 */
                gl_Position = u_rx * u_ry * a_Position;
                /**
                 * 纹理顶点坐标差值计算
                 */
                v_TexturePosition = a_TexturePosition;
            }
        `
		return source
	}

	_chartletFragmentShaderSource() {
		const source = `
            precision highp float;
            /**
             * 接收 计算差值后的纹理顶点坐标
             */
            varying vec2 v_TexturePosition;
            /**
             * 图片纹理像素数据
             */
            uniform sampler2D u_Sampler;
            void main() {
                /**
                 * 采集纹素, 逐片元赋值像素值
                 */
                gl_FragColor = texture2D(u_Sampler, v_TexturePosition);
            }
        `
		return source
	}
}

window.SimpleChartletLightCubeDraw = SimpleChartletLightCubeDraw
