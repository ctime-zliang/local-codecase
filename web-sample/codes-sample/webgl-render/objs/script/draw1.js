class Model1 {
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
		autoTransformation: false,
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 100,
				y: 110,
				z: 120,
			},
			atPosition: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
		projectionType: 1,
		/**
		 * 透视投影矩阵参数
		 */
		persProjection: {
			fovy: 30,
			aspect: 1,
			near: 1,
			far: 5000,
		},
		/**
		 * 正交投影矩阵参数
		 */
		orthoProjection: {
			left: -1,
			right: 1,
			bottom: -1,
			top: 1,
			near: 0,
			far: 1000,
		},
		/**
		 * 光照参数
		 */
		light: {
			illuType: 1,
			intensityGain: 1.0,
			direction: {
				x: 0.5,
				y: 3.0,
				z: 4.0,
			},
			position: {
				x: 25,
				y: 60,
				z: 35,
			},
			color: {
				r: 255,
				g: 255,
				b: 255,
			},
			ambient: {
				r: 0.2,
				g: 0.2,
				b: 0.2,
			},
		},
		clearColor: {
			r: 30,
			g: 30,
			b: 30,
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
	}

	static initFormView() {
		const self = this
		const modelSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="modelSelector"]`)
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
		const projectionTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="projectionType"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const orthoProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionNear"]`)
		const orthoProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionNearShow"]`)
		const orthoProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionFar"]`)
		const orthoProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionFarShow"]`)
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
		const lightColorPickElement = this.containerElement.querySelector(`[data-tag-name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightColorShow"]`)
		const lightIlluTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="lightIlluType"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRangeShow"]`)
		const autoTransformationCheckboxElement = this.containerElement.querySelector(`[data-tag-name="autoTransformation"]`)

		modelRotationXShowSpanElement.textContent = modelRotationRangeXElement.value = 0
		modelRotationYShowSpanElement.textContent = modelRotationRangeYElement.value = 0
		modelRotationZShowSpanElement.textContent = modelRotationRangeZElement.value = 0
		modelOffsetXShowSpanElement.textContent = modelOffsetRangeXElement.value = 0
		modelOffsetYShowSpanElement.textContent = modelOffsetRangeYElement.value = 0
		modelOffsetZShowSpanElement.textContent = modelOffsetRangeZElement.value = 0
		modelScaleRangeShowSpanElement.textContent = modelScaleRangeElement.value = 1
		projectionTypeRadioElements.forEach(itemElement => {
			const name = this.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
			itemElement.setAttribute('name', name)
			itemElement.checked = itemElement.value === String(self.profile.projectionType)
		})
		persProjectionFovyShowSpanElement.textContent = persProjectionFovyRangeElement.value = self.profile.persProjection.fovy
		persProjectionNearShowSpanElement.textContent = persProjectionNearRangeElement.value = self.profile.persProjection.near
		persProjectionFarShowSpanElement.textContent = persProjectionFarRangeElement.value = self.profile.persProjection.far
		orthoProjectionNearShowSpanElement.textContent = orthoProjectionNearRangeElement.value = self.profile.orthoProjection.near
		orthoProjectionFarShowSpanElement.textContent = orthoProjectionFarRangeElement.value = self.profile.orthoProjection.far
		lookAtMatrix4EyePositionXShowSpanElement.textContent = lookAtMatrix4EyePositionXRangeElement.value = self.profile.lookAt.eyePosition.x
		lookAtMatrix4EyePositionYShowSpanElement.textContent = lookAtMatrix4EyePositionYRangeElement.value = self.profile.lookAt.eyePosition.y
		lookAtMatrix4EyePositionZShowSpanElement.textContent = lookAtMatrix4EyePositionZRangeElement.value = self.profile.lookAt.eyePosition.z
		lookAtMatrix4AtPositionXShowSpanElement.textContent = lookAtMatrix4AtPositionXRangeElement.value = self.profile.lookAt.atPosition.x
		lookAtMatrix4AtPositionYShowSpanElement.textContent = lookAtMatrix4AtPositionYRangeElement.value = self.profile.lookAt.atPosition.y
		lookAtMatrix4AtPositionZShowSpanElement.textContent = lookAtMatrix4AtPositionZRangeElement.value = self.profile.lookAt.atPosition.z
		lightColorShowSpanElement.textContent = lightColorPickElement.value = ven$rgba2Hex(self.profile.light.color)
		lightIlluTypeRadioElements.forEach(itemElement => {
			const name = this.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
			itemElement.setAttribute('name', name)
			itemElement.checked = itemElement.value === String(self.profile.light.illuType)
		})
		lightPositionRangeXShowElement.textContent = lightPositionRangeXRangeElement.value = self.profile.light.position.x
		lightPositionRangeYShowElement.textContent = lightPositionRangeYRangeElement.value = self.profile.light.position.y
		lightPositionRangeZShowElement.textContent = lightPositionRangeZRangeElement.value = self.profile.light.position.z
		lightDirectionRangeXShowElement.textContent = lightDirectionRangeXRangeElement.value = self.profile.light.direction.x
		lightDirectionRangeYShowElement.textContent = lightDirectionRangeYRangeElement.value = self.profile.light.direction.y
		lightDirectionRangeZShowElement.textContent = lightDirectionRangeZRangeElement.value = self.profile.light.direction.z
		ambientLightRShowSpanElement.textContent = ambientLightRangeRRangeElement.value = self.profile.light.ambient.r
		ambientLightRangeGShowSpanElement.textContent = ambientLightRangeGRangeElement.value = self.profile.light.ambient.g
		ambientLightRangeBShowSpanElement.textContent = ambientLightRangeBRangeElement.value = self.profile.light.ambient.b
		lightIntensityGainRangeShowSpanElement.textContent = lightIntensityGainRangeRangeElement.value = self.profile.light.intensityGain
		autoTransformationCheckboxElement.checked = self.profile.autoTransformation

		this.toggleLightIlluTypeView()
		this.toggleProjectionTypeView()
		this.toggleModelModelDatas(modelSelectorSelectElement.value)
	}

	static eventHandle() {
		const self = this
		const canvasElement = this.containerElement.querySelector(`canvas`)
		const modelSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="modelSelector"]`)
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
		const projectionTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="projectionType"]`)
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionFovyShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovyShow"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNearShow"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const persProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFarShow"]`)
		const orthoProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionNear"]`)
		const orthoProjectionNearShowSpanElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionNearShow"]`)
		const orthoProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionFar"]`)
		const orthoProjectionFarShowSpanElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionFarShow"]`)
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
		const lightColorPickElement = this.containerElement.querySelector(`[data-tag-name="lightColor"]`)
		const lightColorShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightColorShow"]`)
		const lightIlluTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="lightIlluType"]`)
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeXShow"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeYShow"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightPositionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZShow"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeXShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeXShow"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeYShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeYShow"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		const lightDirectionRangeZShowElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZShow"]`)
		const ambientLightRangeRRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeR"]`)
		const ambientLightRShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRShow"]`)
		const ambientLightRangeGRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeG"]`)
		const ambientLightRangeGShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightGShow"]`)
		const ambientLightRangeBRangeElement = this.containerElement.querySelector(`[data-tag-name="ambientLightRangeB"]`)
		const ambientLightRangeBShowSpanElement = this.containerElement.querySelector(`[data-tag-name="ambientLightBShow"]`)
		const lightIntensityGainRangeRangeElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRange"]`)
		const lightIntensityGainRangeShowSpanElement = this.containerElement.querySelector(`[data-tag-name="lightIntensityGainRangeShow"]`)
		const autoTransformationCheckboxElement = this.containerElement.querySelector(`[data-tag-name="autoTransformation"]`)

		canvasElement.addEventListener('contextmenu', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		modelSelectorSelectElement.addEventListener('change', function (e) {
			self.toggleModelModelDatas(this.value)
			self.isRender = true
		})
		projectionTypeRadioElements.forEach(itemElement => {
			itemElement.addEventListener('change', function (e) {
				self.profile.projectionType = +this.value
				self.toggleProjectionTypeView()
				console.log('projectionType:', self.profile.projectionType)
				self.isRender = true
			})
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
		orthoProjectionNearRangeElement.addEventListener('input', function (e) {
			orthoProjectionNearShowSpanElement.textContent = self.profile.orthoProjection.near = +this.value
			console.log('orthoProjection:', JSON.stringify(self.profile.orthoProjection))
			self.isRender = true
		})
		orthoProjectionFarRangeElement.addEventListener('input', function (e) {
			orthoProjectionFarShowSpanElement.textContent = self.profile.orthoProjection.far = +this.value
			console.log('orthoProjection:', JSON.stringify(self.profile.orthoProjection))
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
		lightColorPickElement.addEventListener('input', function (e) {
			const setRGBAColor = ven$hex2Rgba(this.value)
			Object.keys(self.profile.light.color).forEach(key => {
				self.profile.light.color[key] = setRGBAColor[key]
			})
			lightColorShowSpanElement.textContent = ven$rgba2Hex(self.profile.light.color)
			console.log('light.color:', JSON.stringify(self.profile.light.color))
			self.isRender = true
		})
		lightIlluTypeRadioElements.forEach(itemElement => {
			itemElement.addEventListener('change', function (e) {
				self.profile.light.illuType = +this.value
				self.toggleLightIlluTypeView()
				console.log('light.illuType:', self.profile.light.illuType)
				self.isRender = true
			})
		})
		lightPositionRangeXRangeElement.addEventListener('input', function (e) {
			lightPositionRangeXShowElement.textContent = self.profile.light.position.x = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
			self.isRender = true
		})
		lightPositionRangeYRangeElement.addEventListener('input', function (e) {
			lightPositionRangeYShowElement.textContent = self.profile.light.position.y = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
			self.isRender = true
		})
		lightPositionRangeZRangeElement.addEventListener('input', function (e) {
			lightPositionRangeZShowElement.textContent = self.profile.light.position.z = +this.value
			console.log('light.position:', JSON.stringify(self.profile.light.position))
			self.isRender = true
		})
		lightDirectionRangeXRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeXShowElement.textContent = self.profile.light.direction.x = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		lightDirectionRangeYRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeYShowElement.textContent = self.profile.light.direction.y = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		lightDirectionRangeZRangeElement.addEventListener('input', function (e) {
			lightDirectionRangeZShowElement.textContent = self.profile.light.direction.z = +this.value
			console.log('light.direction:', JSON.stringify(self.profile.light.direction))
			self.isRender = true
		})
		ambientLightRangeRRangeElement.addEventListener('input', function (e) {
			ambientLightRShowSpanElement.textContent = self.profile.light.ambient.r = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		ambientLightRangeGRangeElement.addEventListener('input', function (e) {
			ambientLightRangeGShowSpanElement.textContent = self.profile.light.ambient.g = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		ambientLightRangeBRangeElement.addEventListener('input', function (e) {
			ambientLightRangeBShowSpanElement.textContent = self.profile.light.ambient.b = +this.value
			console.log('light.ambient:', JSON.stringify(self.profile.light.ambient))
			self.isRender = true
		})
		lightIntensityGainRangeRangeElement.addEventListener('input', function (e) {
			lightIntensityGainRangeShowSpanElement.textContent = self.profile.light.intensityGain = +this.value
			console.log('light.intensityGain:', self.profile.light.intensityGain)
			self.isRender = true
		})
		autoTransformationCheckboxElement.addEventListener('change', function (e) {
			self.profile.autoTransformation = this.checked
			self.isRender = true
		})
	}

	static toggleLightIlluTypeView() {
		const lightPositionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeX"]`)
		const lightPositionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeY"]`)
		const lightPositionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightPositionRangeZ"]`)
		const lightDirectionRangeXRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeX"]`)
		const lightDirectionRangeYRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeY"]`)
		const lightDirectionRangeZRangeElement = this.containerElement.querySelector(`[data-tag-name="lightDirectionRangeZ"]`)
		if (this.profile.light.illuType === 1) {
			lightPositionRangeXRangeElement.parentElement.style.display = 'none'
			lightPositionRangeYRangeElement.parentElement.style.display = 'none'
			lightPositionRangeZRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeXRangeElement.parentElement.style.display = 'flex'
			lightDirectionRangeYRangeElement.parentElement.style.display = 'flex'
			lightDirectionRangeZRangeElement.parentElement.style.display = 'flex'
		}
		if (this.profile.light.illuType === 2) {
			lightDirectionRangeXRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeYRangeElement.parentElement.style.display = 'none'
			lightDirectionRangeZRangeElement.parentElement.style.display = 'none'
			lightPositionRangeXRangeElement.parentElement.style.display = 'flex'
			lightPositionRangeYRangeElement.parentElement.style.display = 'flex'
			lightPositionRangeZRangeElement.parentElement.style.display = 'flex'
		}
	}

	static toggleProjectionTypeView() {
		const persProjectionFovyRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFovy"]`)
		const persProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionNear"]`)
		const persProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="persProjectionFar"]`)
		const orthoProjectionNearRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionNear"]`)
		const orthoProjectionFarRangeElement = this.containerElement.querySelector(`[data-tag-name="orthoProjectionFar"]`)
		if (this.profile.projectionType === 1) {
			orthoProjectionNearRangeElement.parentElement.style.display = 'none'
			orthoProjectionFarRangeElement.parentElement.style.display = 'none'
			persProjectionFovyRangeElement.parentElement.style.display = 'flex'
			persProjectionNearRangeElement.parentElement.style.display = 'flex'
			persProjectionFarRangeElement.parentElement.style.display = 'flex'
		}
		if (this.profile.projectionType === 2) {
			persProjectionFovyRangeElement.parentElement.style.display = 'none'
			persProjectionNearRangeElement.parentElement.style.display = 'none'
			persProjectionFarRangeElement.parentElement.style.display = 'none'
			orthoProjectionNearRangeElement.parentElement.style.display = 'flex'
			orthoProjectionFarRangeElement.parentElement.style.display = 'flex'
		}
	}

	static toggleModelModelDatas(modelType) {
		this.glControl.modelInstances = []
		switch (modelType) {
			case 'model1': {
				break
			}
		}
	}

	static setModelInstances(objModels) {
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
}

function drawCanvas1(containerElement) {
	const canvasElement = containerElement.querySelector('canvas')
	Program1.glControl.gl = ven$initWebGLContext(canvasElement)
	Program1.init(containerElement)

	const COMMON_VERTEX_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		// 顶点配置(组)
		attribute vec3 a_Position;
		attribute vec4 a_Color;
		attribute vec3 a_Normal;
		// 变换矩阵(组)
		uniform mat4 u_NormalMatrix;
		uniform mat4 u_ModelMatrix;
		uniform mat4 u_ViewMatrix;
		uniform mat4 u_ProjMatrix;
		// 参数(组)
		uniform vec3 u_Eye;
		void main() {
			gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
			// 计算顶点的世界坐标
			v_Position = vec3(u_ModelMatrix * vec4(a_Position, 1.0));
			// 根据法线变换矩阵重新计算法线坐标并归一化
			v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1.0)));
			v_Color = a_Color;
		}
	`
	const COMMON_FRAGMENT_SHADER = `
		precision mediump float;
		varying vec4 v_Color;
		varying vec3 v_Normal;
		varying vec3 v_Position;
		// 参数(组)
		uniform float u_lightIntensityGain;
		uniform float u_illuType;
		// 点光配置(组)
		uniform vec3 u_LightPosition;
		uniform vec3 u_LightDirection;
		uniform vec3 u_LightColor;
		uniform vec3 u_AmbientLightColor;
		void main() {
			float nDotL;
			vec3 normal;
			vec3 diffuse;
			vec3 lightDirection;
			if (u_illuType == 1.0) {  // 平行光
				normal = normalize(v_Normal);
				// 计算光线方向与法线的点积
				nDotL = max(dot(u_LightDirection, normal), 0.0);
				// 计算漫反射光和环境光的色值
				diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
				gl_FragColor = vec4(diffuse + u_AmbientLightColor * v_Color.rgb, v_Color.a);
			} else {  // 点光
				normal = normalize(v_Normal);
				// 计算光线方向并归一化
				lightDirection = normalize(u_LightPosition - v_Position);
				// 计算光线方向与法线的点积
				nDotL = max(dot(lightDirection, normal), 0.0);
				// 计算漫反射光和环境光的色值
				diffuse = u_LightColor * v_Color.rgb * nDotL * u_lightIntensityGain;
				gl_FragColor = vec4(diffuse + u_AmbientLightColor * v_Color.rgb, v_Color.a);
			}
		}
	`

	Program1.glControl.gl.clearColor(
		Program1.profile.clearColor.r / 255,
		Program1.profile.clearColor.g / 255,
		Program1.profile.clearColor.b / 255,
		1.0
	)
	Program1.glControl.gl.clear(Program1.glControl.gl.COLOR_BUFFER_BIT | Program1.glControl.gl.DEPTH_BUFFER_BIT)
	Program1.glControl.gl.enable(Program1.glControl.gl.BLEND)
	Program1.glControl.gl.enable(Program1.glControl.gl.CULL_FACE)
	Program1.glControl.gl.enable(Program1.glControl.gl.DEPTH_TEST)
	Program1.glControl.gl.enable(Program1.glControl.gl.POLYGON_OFFSET_FILL)
	Program1.glControl.gl.polygonOffset(1.0, 1.0)
	// Program1.glControl.gl.blendFunc(Program1.glControl.gl.SRC_ALPHA, Program1.glControl.gl.ONE_MINUS_SRC_ALPHA)

	Program1.glControl.commonLight = {
		glAttributes: {},
		glUniforms: {},
		program: null,
	}

	Program1.glControl.commonLight.program = ven$createProgram(Program1.glControl.gl, COMMON_VERTEX_SHADER, COMMON_FRAGMENT_SHADER)
	const commonWebGLVariableLocation = ven$getWebGLVariableLocation(Program1.glControl.gl, Program1.glControl.commonLight.program, {
		glAttributes: ['a_Normal', 'a_Position', 'a_Color'],
		glUniforms: [
			'u_illuType',
			'u_LightColor',
			'u_LightPosition',
			'u_LightDirection',
			'u_AmbientLightColor',
			'u_lightIntensityGain',
			'u_NormalMatrix',
			'u_ModelMatrix',
			'u_ViewMatrix',
			'u_ProjMatrix',
		],
	})
	Program1.glControl.commonLight.glAttributes = commonWebGLVariableLocation.glAttributes
	Program1.glControl.commonLight.glUniforms = commonWebGLVariableLocation.glUniforms

	const loadObjData = function (filePath) {
		const xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status !== 404) {
				const objDoc = modelObj.generate(filePath)
				const result = objDoc.parse(xhr.responseText, 20, true)
				console.log(objDoc)
				const drawingInfo = objDoc.getDrawingInfo()
				const objModel = new ObjModel1()
				objModel.vertexDatas = {
					colors: drawingInfo.colors,
					vertices: drawingInfo.vertices,
					normals: drawingInfo.normals,
					indices: drawingInfo.indices,
				}
				Program1.setModelInstances([objModel])
			}
		}
		xhr.open('GET', filePath, true)
		xhr.send()
	}

	loadObjData('../common/model-files/Car Unpainted/Car Unpaint obj.obj')

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

			const projectionMatrix4 = Ven$CanvasMatrix4.setPerspective(
				Program1.profile.persProjection.fovy,
				Program1.profile.persProjection.aspect,
				Program1.profile.persProjection.near,
				Program1.profile.persProjection.far
			)
			const orthoMatrix4 = Ven$CanvasMatrix4.setOrtho(
				Program1.profile.orthoProjection.left,
				Program1.profile.orthoProjection.right,
				Program1.profile.orthoProjection.bottom,
				Program1.profile.orthoProjection.top,
				Program1.profile.orthoProjection.near,
				Program1.profile.orthoProjection.far
			)
			const lookAtMatrix4 = Ven$CanvasMatrix4.setLookAt(
				new Ven$Vector3(Program1.profile.lookAt.eyePosition.x, Program1.profile.lookAt.eyePosition.y, Program1.profile.lookAt.eyePosition.z),
				new Ven$Vector3(Program1.profile.lookAt.atPosition.x, Program1.profile.lookAt.atPosition.y, Program1.profile.lookAt.atPosition.z),
				new Ven$Vector3(0, 1, 0)
			)

			gl.uniform1f(glUniforms.u_illuType, Program1.profile.light.illuType)
			if (Program1.profile.light.illuType === 1) {
				const lightDirection = new Ven$Vector3(
					Program1.profile.light.direction.x,
					Program1.profile.light.direction.y,
					Program1.profile.light.direction.z
				)
				const lightNormalizeDirection = lightDirection.normalize()
				gl.uniform3fv(
					glUniforms.u_LightDirection,
					new Float32Array([lightNormalizeDirection.x, lightNormalizeDirection.y, lightNormalizeDirection.z])
				)
			}
			if (Program1.profile.light.illuType === 2) {
				gl.uniform3fv(
					glUniforms.u_LightPosition,
					new Float32Array([Program1.profile.light.position.x, Program1.profile.light.position.y, Program1.profile.light.position.z])
				)
			}
			gl.uniform3f(
				glUniforms.u_LightColor,
				Program1.profile.light.color.r / 255,
				Program1.profile.light.color.g / 255,
				Program1.profile.light.color.b / 255
			)
			gl.uniform1f(glUniforms.u_lightIntensityGain, Program1.profile.light.intensityGain)
			gl.uniform3f(
				glUniforms.u_AmbientLightColor,
				Program1.profile.light.ambient.r,
				Program1.profile.light.ambient.g,
				Program1.profile.light.ambient.b
			)
			gl.uniformMatrix4fv(glUniforms.u_ViewMatrix, false, new Float32Array(lookAtMatrix4.data))
			if (Program1.profile.projectionType === 1) {
				gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(projectionMatrix4.data))
			}
			if (Program1.profile.projectionType === 2) {
				gl.uniformMatrix4fv(glUniforms.u_ProjMatrix, false, new Float32Array(orthoMatrix4.data))
			}
		},
		render(gl, modelInstances, itemProgramControl) {
			modelInstances.forEach(modelInstanceItem => {
				this.applyModelMatrix(gl, modelInstanceItem, itemProgramControl)
				this.drawBuffer(gl, modelInstanceItem, itemProgramControl)
			})
		},
		drawBuffer(gl, modelInstanceItem, itemProgramControl) {
			const { normalBuffer, vertexBuffer, colorBuffer, indexBuffer, texCoordBuffer, vertexDatas } = modelInstanceItem
			const { colors, vertices, normals, indices } = vertexDatas
			const { glAttributes } = itemProgramControl

			ven$initAttributeVariable(
				gl,
				glAttributes.a_Normal,
				normalBuffer,
				{
					size: 3,
				},
				{
					data: normals,
				}
			)
			ven$initAttributeVariable(
				gl,
				glAttributes.a_Position,
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
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
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
			const modelEffectInverseMatrix4 = Ven$CanvasMatrix4.setInverse(modelEffectMatrix4)
			const modelEffectInverseTransposeMatrix4 = Ven$CanvasMatrix4.setTranspose(modelEffectInverseMatrix4)
			const normalMatrix4 = modelEffectInverseTransposeMatrix4

			gl.uniformMatrix4fv(glUniforms.u_ModelMatrix, false, new Float32Array(modelEffectMatrix4.data))
			gl.uniformMatrix4fv(glUniforms.u_NormalMatrix, false, new Float32Array(normalMatrix4.data))
		},
	}

	const stepControl = new Ven$StepControl(0, 45, 360)
	let angle = 0
	const exec = () => {
		if (!Program1.isRender) {
			window.requestAnimationFrame(exec)
			stepControl.updateLastStamp()
			return
		}
		Program1.isRender = false
		if (Program1.profile.autoTransformation) {
			angle = stepControl.getNextValue() % 360
			Program1.glControl.modelInstances.forEach(modelInstanceItem => {
				modelInstanceItem.modelRatation.y = angle
			})
			Program1.isRender = true
		}
		canvas.init('CANVAS', Program1.glControl.gl, null)
		Program1.glControl.gl.useProgram(Program1.glControl.commonLight.program)
		canvas.clear(Program1.glControl.gl)
		canvas.setProfile(Program1.glControl.gl, Program1.glControl.commonLight)
		canvas.render(Program1.glControl.gl, Program1.glControl.modelInstances, Program1.glControl.commonLight)
		stepControl.updateLastStamp()
		window.requestAnimationFrame(exec)
	}
	exec()

	console.log(Program1.glControl)
}
