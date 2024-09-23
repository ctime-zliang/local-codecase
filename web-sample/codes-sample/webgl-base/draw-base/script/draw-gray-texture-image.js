/**
 * 直线绘制拼凑方式
 */
class SimpleGrayTextureImageDraw {
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
		const a_TexturePosition = this.gl.getAttribLocation(this.program, 'a_TexturePosition')
		const u_Sampler = this.gl.getUniformLocation(this.program, 'u_Sampler')
		/**
		 * 创建顶点数据
		 *      以直角坐标系坐标原点为中心
		 */
		// prettier-ignore
		const vertexData = new Float32Array([
            /* 左上角 */
            -0.5, 0.5, 0.0, 
            /* 左下角 */
            -0.5, -0.5, 0.0,
            /* 右上角 */
            0.5, 0.5, 0.0,
            /* 右下角 */
            0.5, -0.5, 0.0,
        ])
		/**
		 * 创建纹理顶点数据
		 *      以第一象限的中点为中心
		 */
		// prettier-ignore
		const textureVertexData = new Float32Array([
            /* 左上角 */
            0.0, 1.0, 0.0, 
            /* 左下角 */
            0.0, 0.0, 0.0,
            /* 右上角 */
            1.0, 1.0, 0.0,
            /* 右下角 */
            1.0, 0.0, 0.0,
        ])

		const vertextBuffer = createBuffer(this.gl, vertexData, a_Position, 3)
		const textureBuffer = createBuffer(this.gl, textureVertexData, a_TexturePosition, 3)

		const imageInstance = new Image()
		const drawImageTextureHandler = createDrawImageTextureHandler(this.gl, u_Sampler, imageInstance)
		imageInstance.onload = drawImageTextureHandler
		imageInstance.src = window.$image02

		console.log(this.program)
	}

	destory() {
		console.log(this.constructor.name)
	}

	_vertexShaderSource() {
		const source = `
            /**
             * 顶点位置坐标
             */
            attribute vec4 a_Position;
            /**
             * 顶点纹理坐标
             */
            attribute vec2 a_TexturePosition;
            /**
             * 计算差值后的顶点纹理坐标
             */
            varying vec2 v_TexturePosition;
            void main() {
                /**
                 * 逐顶点处理
                 */
                gl_Position = a_Position;
                /**
                 * 纹理坐标插值计算
                 */
                v_TexturePosition = a_TexturePosition;
            }
        `
		return source
	}

	_fragmentShaderSource() {
		const source = `
            precision highp float;
            /**
             * 接收 计算差值后的顶点纹理坐标
             */
            varying vec2 v_TexturePosition;
            /**
             * 纹理图片像素数据
             */
            uniform sampler2D u_Sampler;
            void main() {
                vec4 texture = texture2D(u_Sampler, v_TexturePosition);
                /**
                 * 计算 RGB 三个分量光能量之和, 也即亮度
                 */
                float luminance = 0.299 * texture.r + 0.587 * texture.g + 0.114 * texture.b;
                gl_FragColor = vec4(luminance, luminance, luminance, 1);
            }
        `
		return source
	}
}

window.SimpleGrayTextureImageDraw = SimpleGrayTextureImageDraw
