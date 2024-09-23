class Model2 {
	constructor() {
		this._vertexDatas = null
		this._modelParam = null
		this._modelRatation = {
			x: 0,
			y: 0,
			z: 0,
		}
		this._modelOffset = {
			x: 0,
			y: 0,
			z: 0,
		}
		this._modelScale = {
			x: 1,
			y: 1,
			z: 1,
		}
		this._featureBuffer = null
		this._normalBuffer = null
		this._texCoordBuffer = null
		this._modelMatrix = null
	}

	get modelParam() {
		return this._modelParam
	}
	set modelParam(value) {
		this._modelParam = value
	}

	get modelRatation() {
		return this._modelRatation
	}

	get modelOffset() {
		return this._modelOffset
	}

	get modelScale() {
		return this._modelScale
	}

	get vertexDatas() {
		return this._vertexDatas
	}
	set vertexDatas(value) {
		this._vertexDatas = value
	}

	get featureBuffer() {
		return this._featureBuffer
	}
	set featureBuffer(value) {
		this._featureBuffer = value
	}

	get normalBuffer() {
		return this._normalBuffer
	}
	set normalBuffer(value) {
		this._normalBuffer = value
	}

	get texCoordBuffer() {
		return this._texCoordBuffer
	}
	set texCoordBuffer(value) {
		this._texCoordBuffer = value
	}

	get modelMatrix() {
		return this._modelMatrix
	}
	set modelMatrix(value) {
		this._modelMatrix = value
	}
}

class CubeModel2 extends Model2 {
	constructor(width, length, depth, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this.modelParam = {
			width,
			length,
			depth,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return createCubeDatas(
			this.modelParam.width,
			this.modelParam.length,
			this.modelParam.depth,
			{
				up: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
				bottom: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
				front: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
				back: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
				right: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
				left: [this.modelParam.rgba.r, this.modelParam.rgba.g, this.modelParam.rgba.b, 1],
			},
			this.modelParam.offsetX,
			this.modelParam.offsetY,
			this.modelParam.offsetZ
		)
	}
}

class PlaneModel2 extends Model2 {
	constructor() {
		super()
		this.modelParam = {}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			// prettier-ignore
			vertexFeature: new Float32Array([
				-1.25, 1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
				-1.25, -1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
				1.25, -1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
				/* ... */
				-1.25, 1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
				1.25, -1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
				1.25, 1.25, 0.0, 1.0, 0.0, 0.0, 1.0,
			]),
			// prettier-ignore
			vertexCoordinate: new Float32Array([
				0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
				0.0, 0.0, 1.0, 1.0, 1.0, 0.0
			]),
		}
	}
}

class Program2 {
	static isRender = true
	static containerElement
	static profile = {
		offscreenWidth: 256,
		offscreenHeight: 256,
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 4,
				y: 5,
				z: 6,
			},
			atPosition: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
		/**
		 * 透视投影矩阵参数
		 */
		persProjection: {
			fovy: 30,
			aspect: 1,
			near: 1,
			far: 50,
		},
		clearColor: {
			r: 0,
			g: 0,
			b: 0,
		},
	}

	static glControl = {}

	static init(containerElement) {
		this.containerElement = containerElement
		this.glControl = {
			gl: this.glControl.gl || null,
			modelInstances: [],
			vertexFeatureSize: 0,
			frameBufferModelInstances: [],
			frameBufferVertexFeatureSize: 0,
		}
		this.initFormView()
		this.eventHandle()
		this.initModelModelDatas()
	}

	static initFormView() {
		const self = this
		const modelRotationRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeX"]`)
		const modelRotationXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeY"]`)
		const modelRotationYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZ"]`)
		const modelRotationZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeX"]`)
		const modelOffsetXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeY"]`)
		const modelOffsetYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZ"]`)
		const modelOffsetZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZShow"]`)
		const modelScaleRangeElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRange"]`)
		const modelScaleRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRangeShow"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZShow"]`)

		modelRotationXShowSpanElement.textContent = modelRotationRangeXElement.value = 0
		modelRotationYShowSpanElement.textContent = modelRotationRangeYElement.value = 0
		modelRotationZShowSpanElement.textContent = modelRotationRangeZElement.value = 0
		modelOffsetXShowSpanElement.textContent = modelOffsetRangeXElement.value = 0
		modelOffsetYShowSpanElement.textContent = modelOffsetRangeYElement.value = 0
		modelOffsetZShowSpanElement.textContent = modelOffsetRangeZElement.value = 0
		modelScaleRangeShowSpanElement.textContent = modelScaleRangeElement.value = 1
		persProjectionFovyShowSpanElement.textContent = persProjectionFovyRangeElement.value = self.profile.persProjection.fovy
		persProjectionNearShowSpanElement.textContent = persProjectionNearRangeElement.value = self.profile.persProjection.near
		persProjectionFarShowSpanElement.textContent = persProjectionFarRangeElement.value = self.profile.persProjection.far
		lookAtMatrix4EyePositionXShowSpanElement.textContent = lookAtMatrix4EyePositionXRangeElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYShowSpanElement.textContent = lookAtMatrix4EyePositionYRangeElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZShowSpanElement.textContent = lookAtMatrix4EyePositionZRangeElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionXShowSpanElement.textContent = lookAtMatrix4AtPositionXRangeElement.value = self.profile.lookAt.atPosition.x
		lookAtMatrix4AtPositionYShowSpanElement.textContent = lookAtMatrix4AtPositionYRangeElement.value = self.profile.lookAt.atPosition.y
		lookAtMatrix4AtPositionZShowSpanElement.textContent = lookAtMatrix4AtPositionZRangeElement.value = self.profile.lookAt.atPosition.z
	}

	static eventHandle() {
		const self = this
		const canvasElement = this.containerElement.querySelector(`canvas`)
		const modelRotationRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeX"]`)
		const modelRotationRangeXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeXShow"]`)
		const modelRotationRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeY"]`)
		const modelRotationRangeYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeYShow"]`)
		const modelRotationRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZ"]`)
		const modelRotationRangeZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelRotationRangeZShow"]`)
		const modelOffsetRangeXElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeX"]`)
		const modelOffsetRangeXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeXShow"]`)
		const modelOffsetRangeYElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeY"]`)
		const modelOffsetRangeYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeYShow"]`)
		const modelOffsetRangeZElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZ"]`)
		const modelOffsetRangeZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelOffsetRangeZShow"]`)
		const modelScaleRangeElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRange"]`)
		const modelScaleRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="modelScaleRangeShow"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const lookAtMatrix4EyePositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionX"]`)
		const lookAtMatrix4EyePositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionXShow"]`)
		const lookAtMatrix4EyePositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionY"]`)
		const lookAtMatrix4EyePositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionYShow"]`)
		const lookAtMatrix4EyePositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZ"]`)
		const lookAtMatrix4EyePositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4EyePositionZShow"]`)
		const lookAtMatrix4AtPositionXRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionX"]`)
		const lookAtMatrix4AtPositionXShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionXShow"]`)
		const lookAtMatrix4AtPositionYRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionY"]`)
		const lookAtMatrix4AtPositionYShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionYShow"]`)
		const lookAtMatrix4AtPositionZRangeElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZ"]`)
		const lookAtMatrix4AtPositionZShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lookAtMatrix4AtPositionZShow"]`)

		canvasElement.addEventListener('contextmenu', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		modelRotationRangeXElement.addEventListener('input', function (e) {
			modelRotationRangeXShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.x = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeYElement.addEventListener('input', function (e) {
			modelRotationRangeYShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.y = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeZElement.addEventListener('input', function (e) {
			modelRotationRangeZShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.z = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeXElement.addEventListener('input', function (e) {
			modelOffsetRangeXShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.x = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeYElement.addEventListener('input', function (e) {
			modelOffsetRangeYShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.y = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeZElement.addEventListener('input', function (e) {
			modelOffsetRangeZShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.z = +this.value
			})
			self.isRender = true
		})
		modelScaleRangeElement.addEventListener('input', function (e) {
			modelScaleRangeShowSpanElement.textContent = +this.value
			self.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelScale.x = +this.value
				modelInstanceItem.modelScale.y = +this.value
				modelInstanceItem.modelScale.z = +this.value
			})
			self.isRender = true
		})
		persProjectionFovyRangeElement.addEventListener('input', function (e) {
			persProjectionFovyShowSpanElement.textContent = self.profile.persProjection.fovy = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		persProjectionNearRangeElement.addEventListener('input', function (e) {
			persProjectionNearShowSpanElement.textContent = self.profile.persProjection.near = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		persProjectionFarRangeElement.addEventListener('input', function (e) {
			persProjectionFarShowSpanElement.textContent = self.profile.persProjection.far = +this.value
			console.log('persProjection:', JSON.stringify(self.profile.persProjection))
			self.isRender = true
		})
		lookAtMatrix4EyePositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionXShowSpanElement.textContent = self.profile.lookAt.eyePosition.x = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4EyePositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionYShowSpanElement.textContent = self.profile.lookAt.eyePosition.y = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4EyePositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4EyePositionZShowSpanElement.textContent = self.profile.lookAt.eyePosition.z = +this.value
			console.log('lookAt.eyePosition:', JSON.stringify(self.profile.lookAt.eyePosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionXRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionXShowSpanElement.textContent = self.profile.lookAt.atPosition.x = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionYRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionYShowSpanElement.textContent = self.profile.lookAt.atPosition.y = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
		lookAtMatrix4AtPositionZRangeElement.addEventListener('input', function (e) {
			lookAtMatrix4AtPositionZShowSpanElement.textContent = self.profile.lookAt.atPosition.z = +this.value
			console.log('lookAt.atPosition:', JSON.stringify(self.profile.lookAt.atPosition))
			self.isRender = true
		})
	}

	static initModelModelDatas() {
		this.glControl.frameBufferModelInstances = [new CubeModel2(1.0, 1.0, 1.0)]
		this.glControl.frameBufferModelInstances.forEach(modelInstanceItem => {
			modelInstanceItem.featureBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.texCoordBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
		})
		this.glControl.frameBufferVertexFeatureSize = this.getVertexFeatureSize(this.glControl.frameBufferModelInstances)
		/* ... */
		this.glControl.modelInstances = [new PlaneModel2()]
		this.glControl.modelInstances.forEach(modelInstanceItem => {
			modelInstanceItem.featureBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.texCoordBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
		})
		this.glControl.vertexFeatureSize = this.getVertexFeatureSize(this.glControl.modelInstances)
	}

	static getVertexFeatureSize(modelInstances) {
		let len = 0
		modelInstances.forEach(modelInstanceItem => {
			len += modelInstanceItem.vertexDatas.vertexFeature.length
		})
		return len
	}
}

function drawCanvas2(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program2.glControl.gl = ven$initWebGLContext(canvasElement)
	Program2.init(containerElement)

	const COMMON_VERTEX_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec2 v_TexCoord;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		attribute vec2 a_TexCoord;
		// 变换矩阵(组)
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			v_Color = a_Color;
			gl_PointSize = 5.0;
			v_TexCoord = a_TexCoord;
		}
	`
	const COMMON_FRAGMENT_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec2 v_TexCoord;
		// 纹理数据(内容)(组)
		uniform sampler2D u_Sampler;
		void main() {
			// gl_FragColor = v_Color;
			gl_FragColor = texture2D(u_Sampler, v_TexCoord);
		}
	`

	Program2.glControl.gl.clearColor(
		Program2.profile.clearColor.r / 255,
		Program2.profile.clearColor.g / 255,
		Program2.profile.clearColor.b / 255,
		1.0
	)
	Program2.glControl.gl.clear(Program2.glControl.gl.COLOR_BUFFER_BIT | Program2.glControl.gl.DEPTH_BUFFER_BIT)
	Program2.glControl.gl.enable(Program2.glControl.gl.BLEND)
	Program2.glControl.gl.enable(Program2.glControl.gl.CULL_FACE)
	Program2.glControl.gl.enable(Program2.glControl.gl.DEPTH_TEST)
	Program2.glControl.gl.enable(Program2.glControl.gl.POLYGON_OFFSET_FILL)
	Program2.glControl.gl.polygonOffset(1.0, 1.0)
	// Program2.glControl.gl.blendFunc(Program2.glControl.gl.SRC_ALPHA, Program2.glControl.gl.ONE_MINUS_SRC_ALPHA)

	Program2.glControl.commonLight = {
		glAttributes: {},
		glUniforms: {},
		program: null,
		frameBuffer: null,
		frameTexture: null,
		cubeTexture: null,
	}

	Program2.glControl.commonLight.program = ven$createProgram(Program2.glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
	const commonWebGLVariableLocation = ven$getWebGLVariableLocation(Program2.glControl.gl, Program2.glControl.commonLight.program, {
		glAttributes: ['a_Position', 'a_Color', 'a_TexCoord'],
		glUniforms: ['u_ModelMatrix', 'u_ViewMatrix', 'u_ProjMatrix', 'u_Sampler'],
	})
	Program2.glControl.commonLight.glAttributes = commonWebGLVariableLocation.glAttributes
	Program2.glControl.commonLight.glUniforms = commonWebGLVariableLocation.glUniforms

	const { frameBuffer: frameBuffer, texture: frameTexture } = ven$initFramebufferObject(
		Program2.glControl.gl,
		Program2.profile.offscreenWidth,
		Program2.profile.offscreenHeight
	)
	Program2.glControl.commonLight.frameBuffer = frameBuffer
	Program2.glControl.commonLight.frameTexture = frameTexture

	const cubeTexture = ven$loadImageResourceTexture(Program2.glControl.gl, '../common/images/demo-1024x1024.jpg', (gl, texture) => {
		gl.uniform1i(Program2.glControl.commonLight.glUniforms.u_Sampler, 0)
		gl.activeTexture(gl.TEXTURE0)
		// gl.bindTexture(gl.TEXTURE_2D, null)
		Program2.isRender = true
	})
	Program2.glControl.commonLight.cubeTexture = cubeTexture

	const canvas = {
		status: null,
		init(status, gl, frameBuffer) {
			this.status = status
			/**
			 * 绑定创建的帧缓冲区
			 * 		使绘图结果生成在帧缓冲区
			 */
			gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
		},
		clear(gl) {
			if (this.status === 'FRAME_BUFFER') {
				gl.viewport(0, 0, Program2.profile.offscreenWidth, Program2.profile.offscreenHeight)
				gl.clearColor(0.2, 0.2, 0.4, 1.0)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			} else {
				gl.viewport(0, 0, canvasElement.width, canvasElement.height)
				gl.clearColor(Program2.profile.clearColor.r / 255, Program2.profile.clearColor.g / 255, Program2.profile.clearColor.b / 255, 1.0)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			}
		},
		setProfile(gl, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
				Program2.profile.persProjection.fovy,
				Program2.profile.persProjection.aspect,
				Program2.profile.persProjection.near,
				Program2.profile.persProjection.far
			)
			const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
				new Ven$Vector3(Program2.profile.lookAt.eyePosition.x, Program2.profile.lookAt.eyePosition.y, Program2.profile.lookAt.eyePosition.z),
				new Ven$Vector3(Program2.profile.lookAt.atPosition.x, Program2.profile.lookAt.atPosition.y, Program2.profile.lookAt.atPosition.z),
				new Ven$Vector3(0, 1, 0)
			)

			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
		},
		render(gl, vertexFeatureSize, modelInstances, itemProgramControl) {
			modelInstances.forEach(modelInstanceItem => {
				this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				this.drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, vertexFeatureSize, modelInstanceItem, itemProgramControl) {
			const { featureBuffer, texCoordBuffer, vertexDatas } = modelInstanceItem
			const { vertexFeature: featureData, vertexCoordinate: texCoordData } = vertexDatas
			const { glAttributes, frameTexture, cubeTexture } = itemProgramControl

			ven$initAttributeVariable(gl, glAttributes.a_Position, featureBuffer, {
				size: 3,
				stride: 28,
			})
			ven$initAttributeVariable(gl, glAttributes.a_Color, featureBuffer, {
				size: 4,
				stride: 28,
				offset: 12,
			})
			gl.bufferData(gl.ARRAY_BUFFER, featureData, gl.STATIC_DRAW)
			ven$initAttributeVariable(
				gl,
				glAttributes.a_TexCoord,
				texCoordBuffer,
				{
					size: 2,
				},
				{
					data: texCoordData,
				}
			)

			if (this.status === 'FRAME_BUFFER') {
				gl.activeTexture(gl.TEXTURE0)
				gl.bindTexture(gl.TEXTURE_2D, cubeTexture)
				gl.drawArrays(gl.TRIANGLES, 0, vertexFeatureSize / 7)
				return
			}
			gl.activeTexture(gl.TEXTURE0)
			gl.bindTexture(gl.TEXTURE_2D, frameTexture)
			gl.drawArrays(gl.TRIANGLES, 0, vertexFeatureSize / 7)
		},
		applyModelMatrix(gl, modelInstance, itemProgramControl) {
			const { glUniforms } = itemProgramControl

			const modelRotationXMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.x),
				new Ven$Vector3(1, 0, 0)
			)
			const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.y),
				new Ven$Vector3(0, 1, 0)
			)
			const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotate(
				Ven$Angles.degreeToRadian(modelInstance.modelRatation.z),
				new Ven$Vector3(0, 0, 1)
			)
			const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(
				new Ven$Vector3(modelInstance.modelOffset.x, modelInstance.modelOffset.y, modelInstance.modelOffset.z)
			)
			const modelScaleMatrix4 = Ven$CanvasMatrix4.setScale(
				new Ven$Vector3(modelInstance.modelScale.x, modelInstance.modelScale.y, modelInstance.modelScale.z)
			)

			const modelEffectMatrix4 = modelRotationXMatrix4
				.multiply4(modelRotationYMatrix4)
				.multiply4(modelRotationZMatrix4)
				.multiply4(modelScaleMatrix4)
				.multiply4(modelOffsetMatrix4)

			gl.uniformMatrix4fv(glUniforms.u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
		},
	}

	const exec = () => {
		if (!Program2.isRender) {
			window.requestAnimationFrame(exec)
			return
		}
		Program2.isRender = false
		canvas.init('FRAME_BUFFER', Program2.glControl.gl, Program2.glControl.commonLight.frameBuffer)
		Program2.glControl.gl.useProgram(Program2.glControl.commonLight.program)
		canvas.clear(Program2.glControl.gl)
		canvas.setProfile(Program2.glControl.gl, Program2.glControl.commonLight)
		canvas.render(
			Program2.glControl.gl,
			Program2.glControl.frameBufferVertexFeatureSize,
			Program2.glControl.frameBufferModelInstances,
			Program2.glControl.commonLight
		)
		canvas.init('CANVAS', Program2.glControl.gl, null)
		Program2.glControl.gl.useProgram(Program2.glControl.commonLight.program)
		canvas.clear(Program2.glControl.gl)
		canvas.setProfile(Program2.glControl.gl, Program2.glControl.commonLight)
		canvas.render(Program2.glControl.gl, Program2.glControl.vertexFeatureSize, Program2.glControl.modelInstances, Program2.glControl.commonLight)
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program2.glControl)
}
