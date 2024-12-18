class Model1 {
	constructor() {
		this._vertexDatas = null
		this._modelParam = null
		this._modeControl = {}
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
		this._vertexBuffer = null
		this._normalBuffer = null
		this._colorBuffer = null
		this._indexBuffer = null
		this._texCoordBuffer = null
		this._modelMatrix = null
	}

	get modelParam() {
		return this._modelParam
	}
	set modelParam(value) {
		this._modelParam = value
	}

	get modeControl() {
		return this._modeControl
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

	get vertexBuffer() {
		return this._vertexBuffer
	}
	set vertexBuffer(value) {
		this._vertexBuffer = value
	}

	get normalBuffer() {
		return this._normalBuffer
	}
	set normalBuffer(value) {
		this._normalBuffer = value
	}

	get colorBuffer() {
		return this._colorBuffer
	}
	set colorBuffer(value) {
		this._colorBuffer = value
	}

	get indexBuffer() {
		return this._indexBuffer
	}
	set indexBuffer(value) {
		this._indexBuffer = value
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

class ObjModel1 extends Model1 {
	constructor() {
		super()
	}
}

class Program1 {
	static isRender = true
	static containerElement
	static profile = {
		renderStyle: 'st02',
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 0,
				y: 0,
				z: 5,
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
		}
		this.initFormView()
		this.eventHandle()
		const objModel = new ObjModel1()
		objModel.vertexDatas = {
			// prettier-ignore
			colors: new Float32Array([
				1.0, 1.0, 1.0, 1.0, 
				1.0, 1.0, 1.0, 1.0, 
				1.0, 1.0, 1.0, 1.0, 
				1.0, 1.0, 1.0, 1.0
			]),
			/**
			 * 顶点按照如下方式排列
			 * 		vertices(3: -1.0, +1.0) ----- vertices(2: +1.0, +1.0)
			 *   		|                 			|
			 * 	 		|                 			|
			 * 		vertices(0: -1.0, -1.0) ----- vertices(1: +1.0, -1.0)
			 */
			// prettier-ignore
			vertices: new Float32Array([
				-1.0, -1.0, 0.0,
				1.0, -1.0, 0.0,
				1.0, 1.0, 0.0,
				-1.0, 1.0, 0.0,
			]),
			// prettier-ignore
			indices: new Uint16Array([
				0, 1, 2,
				0, 2, 3
			]),
			// prettier-ignore
			normals: new Float32Array([
				0, 0, 1.0,
				0, 0, 1.0,
				0, 0, 1.0,
				0, 0, 1.0
			]),
			/**
			 * (图片)纹理坐标系统的原点为左上角, X 轴向右, Y 轴向下
			 *
			 * 		将纹理坐标与顶点坐标一一对应即可
			 * 		当定义的纹理坐标顺序与顶点坐标顺序一致时, 则无需翻转 Y 轴
			 * 			vertices(3: -1.0, +1.0)/(0.0, 0.0) ----- vertices(2: +1.0, +1.0)/(1.0, 0.0)
			 * 				|										|
			 * 				| 										|
			 * 			vertices(0: -1.0, -1.0)/(0.0, 1.0) ----- vertices(1: +1.0, -1.0)/(1.0, 1.0)
			 */
			// prettier-ignore
			textureCoords: new Float32Array([
				0.0, 1.0,
				1.0, 1.0,
				1.0, 0.0,
				0.0, 0.0
			]),
		}
		Program1.setFileModelInstances([objModel])
	}

	static initFormView() {
		const self = this
		const renderStyleSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="renderStyleSelector"]`)
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

		renderStyleSelectorSelectElement.value = self.profile.renderStyle
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
		const renderStyleSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="renderStyleSelector"]`)
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
			// e.preventDefault()
			// e.stopPropagation()
		})
		renderStyleSelectorSelectElement.addEventListener('input', function (e) {
			draw1Renderer(this.value, Program1.glControl)
			Program1.loadImageTexture(Program1.glControl)
			self.isRender = true
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

	static setFileModelInstances(objModels) {
		this.glControl.modelInstances = [...objModels]
		this.glControl.modelInstances.forEach(modelInstanceItem => {
			modelInstanceItem.normalBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.vertexBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.colorBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.indexBuffer = ven$initElementArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.texCoordBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
		})
		this.isRender = true
	}

	static loadImageTexture(glControl) {
		ven$loadImageResourceTexture(
			glControl.gl,
			0,
			'../common/images/frog-256x256.jpg',
			(gl, index, texture) => {
				/**
				 * 将 0 号纹理单元传送给取样器变量
				 */
				gl.uniform1i(glControl.commonLight.glUniforms.u_texture, index)
				this.isRender = true
			},
			{
				isFlipY: false,
			}
		)
	}
}

function drawCanvas1(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program1.glControl.gl = ven$initWebGLContext(canvasElement)
	Program1.init(containerElement)

	Program1.glControl.gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)
	Program1.glControl.gl.clear(Program1.glControl.gl.COLOR_BUFFER_BIT | Program1.glControl.gl.DEPTH_BUFFER_BIT)
	Program1.glControl.gl.enable(Program1.glControl.gl.BLEND)
	Program1.glControl.gl.enable(Program1.glControl.gl.CULL_FACE)
	Program1.glControl.gl.enable(Program1.glControl.gl.DEPTH_TEST)
	Program1.glControl.gl.enable(Program1.glControl.gl.POLYGON_OFFSET_FILL)
	Program1.glControl.gl.polygonOffset(1.0, 1.0)
	Program1.glControl.gl.blendFunc(Program1.glControl.gl.SRC_ALPHA, Program1.glControl.gl.ONE_MINUS_SRC_ALPHA)

	Program1.glControl.commonLight = {
		glAttributes: {},
		glUniforms: {},
		program: null,
	}

	draw1Renderer(Program1.profile.renderStyle, Program1.glControl)
	Program1.loadImageTexture(Program1.glControl)

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
			gl.viewport(0, 0, canvasElement.width, canvasElement.height)
			gl.clearColor(Program1.profile.clearColor.r / 255, Program1.profile.clearColor.g / 255, Program1.profile.clearColor.b / 255, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		},
		setProfile(gl, itemProgramControl) {
			const { glUniforms } = itemProgramControl
			if (typeof glUniforms.u_resolution !== 'undefined') {
				gl.uniform2f(glUniforms.u_resolution, canvasElement.clientWidth, canvasElement.clientHeight)
			}
			/**
			 * 创建透视投影矩阵
			 */
			const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
				Program1.profile.persProjection.fovy,
				Program1.profile.persProjection.aspect,
				Program1.profile.persProjection.near,
				Program1.profile.persProjection.far
			)
			gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
			/**
			 * 创建视图矩阵
			 */
			const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
				new Ven$Vector3(Program1.profile.lookAt.eyePosition.x, Program1.profile.lookAt.eyePosition.y, Program1.profile.lookAt.eyePosition.z),
				new Ven$Vector3(Program1.profile.lookAt.atPosition.x, Program1.profile.lookAt.atPosition.y, Program1.profile.lookAt.atPosition.z),
				new Ven$Vector3(0, 1, 0)
			)
			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
		},
		render(gl, modelInstances, itemProgramControl) {
			modelInstances.forEach(modelInstanceItem => {
				this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				this.drawBuffer(gl, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, modelInstanceItem, itemProgramControl) {
			const { normalBuffer, featureBuffer, vertexBuffer, colorBuffer, indexBuffer, texCoordBuffer, vertexDatas } = modelInstanceItem
			const { colors, vertices, normals, indices, textureCoords } = vertexDatas
			const { glAttributes } = itemProgramControl
			ven$initAttributeVariable(
				gl,
				glAttributes.a_ObjPosition,
				vertexBuffer,
				{
					size: 3,
				},
				{
					data: vertices,
				}
			)
			ven$initAttributeVariable(
				gl,
				glAttributes.a_Color,
				colorBuffer,
				{
					size: 4,
				},
				{
					data: colors,
				}
			)
			ven$initAttributeVariable(
				gl,
				glAttributes.a_textureCoord,
				texCoordBuffer,
				{
					size: 2,
				},
				{
					data: textureCoords,
				}
			)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
		},
		applyModelMatrix(gl, modelInstance, itemProgramControl) {
			const { glUniforms } = itemProgramControl
			/**
			 * 创建旋转矩阵
			 */
			const modelRotationXMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.x), new Ven$Vector3(1, 0, 0))
			const modelRotationYMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.y), new Ven$Vector3(0, 1, 0))
			const modelRotationZMatrix4 = Ven$CanvasMatrix4.setRotate(Ven$Angles.degreeToRadian(modelInstance.modelRatation.z), new Ven$Vector3(0, 0, 1))
			/**
			 * 创建平移矩阵
			 */
			const modelOffsetMatrix4 = Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(modelInstance.modelOffset.x, modelInstance.modelOffset.y, modelInstance.modelOffset.z))
			/**
			 * 创建缩放矩阵
			 */
			const modelScaleMatrix4 = Ven$CanvasMatrix4.setScale(new Ven$Vector3(modelInstance.modelScale.x, modelInstance.modelScale.y, modelInstance.modelScale.z))
			/**
			 * 生成模型变换矩阵
			 */
			const modelEffectMatrix4 = modelRotationXMatrix4.multiply4(modelRotationYMatrix4).multiply4(modelRotationZMatrix4).multiply4(modelScaleMatrix4).multiply4(modelOffsetMatrix4)
			/**
			 * 创建法线变换矩阵
			 */
			const modelEffectInverseMatrix4 = Ven$CanvasMatrix4.setInverse(modelEffectMatrix4)
			const modelEffectInverseTransposeMatrix4 = Ven$CanvasMatrix4.setTranspose(modelEffectInverseMatrix4)
			const normalMatrix4 = modelEffectInverseTransposeMatrix4
			gl.uniformMatrix4fv(glUniforms.u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_NormalMatrix, false, new Float32Array(normalMatrix4.data))
		},
	}

	const exec = () => {
		if (!Program1.isRender) {
			window.requestAnimationFrame(exec)
			return
		}
		Program1.isRender = false
		canvas.init('CANVAS', Program1.glControl.gl, null)
		Program1.glControl.gl.useProgram(Program1.glControl.commonLight.program)
		canvas.clear(Program1.glControl.gl)
		canvas.setProfile(Program1.glControl.gl, Program1.glControl.commonLight)
		canvas.render(Program1.glControl.gl, Program1.glControl.modelInstances, Program1.glControl.commonLight)
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program1.glControl)
}
