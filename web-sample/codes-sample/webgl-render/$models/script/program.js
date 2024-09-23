class Program {
	static isRender = true
	static containerElement
	static downKeys = new Set()
	static downNumberKeys = new Set()
	static mouseInfo = {
		isRightDown: false,
		hasRightDownMove: false,
		isLeftDown: false,
		hasLeftDownMove: false,
		isMiddleDown: false,
		hasMiddleDownMove: false,
		moveLastNativeX: 0,
		moveLastNativeY: 0,
		nativeRightDownX: -1,
		nativeRightDownY: -1,
		nativeMiddleDownX: -1,
		nativeMiddleDownY: -1,
		nativeLeftDownX: -1,
		nativeLeftDownY: -1,
		sceneRightDownX: -1,
		sceneRightDownY: -1,
		sceneMiddleDownX: -1,
		sceneMiddleDownY: -1,
		sceneLeftDownX: -1,
		sceneLeftDownY: -1,
		extensions: {},
	}
	static canvasElementRect = null
	static profile = {
		modelSourceType: 1,
		autoTransformation: false,
		rotationCalculationType: 1,
		/**
		 * 视图矩阵参数
		 */
		lookAt: {
			eyePosition: {
				x: 0,
				y: 60,
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
			far: 1000,
		},
		/**
		 * 正交投影矩阵参数
		 */
		orthoProjection: {
			left: -1,
			right: 1,
			bottom: -1,
			top: 1,
			near: -100,
			far: 100,
		},
		/**
		 * 光照参数
		 */
		light: {
			illuType: 1,
			intensityGain: 1.0,
			direction: {
				x: -1.0,
				y: -3.0,
				z: -4.0,
			},
			position: {
				x: 25,
				y: 30,
				z: 65,
			},
			color: {
				r: 255,
				g: 255,
				b: 255,
			},
			ambient: {
				r: 0.1,
				g: 0.1,
				b: 0.1,
			},
		},
		/**
		 * 雾化参数
		 */
		fog: {
			color: {
				r: 0,
				g: 0,
				b: 0,
			},
			dist: {
				distOfStartAndEye: 10,
				distOfEndAndEye: 100,
			},
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
		}
		const canvasElement = this.containerElement.querySelector(`canvas`)
		this.canvasElementRect = canvasElement.getBoundingClientRect().toJSON()
		// this.syncFogColor2ClearColor()
		this.initFormView()
		this.eventHandle()
		window.setTimeout(() => {
			const modelSourceTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="modelSourceType"]`)
			const protocol = window.location.protocol
			if (protocol !== 'http:' && protocol !== 'https:') {
				modelSourceTypeRadioElements.forEach(itemElement => {
					itemElement.disabled = true
				})
			}
		})
	}

	static initFormView() {
		const self = this
		const modelSourceTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="modelSourceType"]`)
		const modelPresetListSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="modelPresetListSelector"]`)
		const rotationCalculationTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="rotationCalculationType"]`)
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
		const fogStartDistRangeElement = this.containerElement.querySelector(`[data-tag-name="fogStartDist"]`)
		const fogStartDistShowShowSpanElement = this.containerElement.querySelector(`[data-tag-name="fogStartDistShow"]`)
		const fogEndDistRangeElement = this.containerElement.querySelector(`[data-tag-name="fogEndDist"]`)
		const fogEndDistShowShowSpanElement = this.containerElement.querySelector(`[data-tag-name="fogEndDistShow"]`)

		modelSourceTypeRadioElements.forEach(itemElement => {
			const name = this.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
			itemElement.setAttribute('name', name)
			itemElement.checked = itemElement.value === String(this.profile.modelSourceType)
		})
		rotationCalculationTypeRadioElements.forEach(itemElement => {
			const name = this.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
			itemElement.setAttribute('name', name)
			itemElement.checked = itemElement.value === String(this.profile.rotationCalculationType)
		})
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
			itemElement.checked = itemElement.value === String(this.profile.light.illuType)
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
		fogStartDistShowShowSpanElement.textContent = fogStartDistRangeElement.value = self.profile.fog.dist.distOfStartAndEye
		fogEndDistShowShowSpanElement.textContent = fogEndDistRangeElement.value = self.profile.fog.dist.distOfEndAndEye

		this.toggleLightIlluTypeView()
		this.toggleProjectionTypeView()
		this.toggleModelSourceTypeView()
		if (this.profile.modelSourceType === 1) {
			this.toggleModelModelDatas(modelPresetListSelectorSelectElement.value)
		}
	}

	static eventHandle() {
		const self = this
		const canvasElement = this.containerElement.querySelector(`canvas`)
		const modelSourceTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="modelSourceType"]`)
		const modelFileSelectorFileElement = this.containerElement.querySelector(`[data-tag-name="modelFileSelector"]`)
		const modelPresetListSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="modelPresetListSelector"]`)
		const rotationCalculationTypeRadioElements = this.containerElement.querySelectorAll(`[data-tag-name="rotationCalculationType"]`)
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
		const fogStartDistRangeElement = this.containerElement.querySelector(`[data-tag-name="fogStartDist"]`)
		const fogStartDistShowShowSpanElement = this.containerElement.querySelector(`[data-tag-name="fogStartDistShow"]`)
		const fogEndDistRangeElement = this.containerElement.querySelector(`[data-tag-name="fogEndDist"]`)
		const fogEndDistShowShowSpanElement = this.containerElement.querySelector(`[data-tag-name="fogEndDistShow"]`)

		canvasElement.addEventListener('contextmenu', function (e) {
			e.preventDefault()
			e.stopPropagation()
		})
		canvasElement.addEventListener('mousedown', function (e) {
			e.target.style.cursor = 'grabbing'
			const mouseClientX = e.clientX - self.canvasElementRect.left
			const mouseClientY = e.clientY - self.canvasElementRect.top
			self.mouseInfo.isLeftDown = self.mouseInfo.isMiddleDown = self.mouseInfo.isRightDown = false
			self.mouseInfo.nativeLeftDownX = self.mouseInfo.nativeMiddleDownX = self.mouseInfo.nativeRightDownX = 0
			self.mouseInfo.nativeLeftDownY = self.mouseInfo.nativeMiddleDownY = self.mouseInfo.nativeRightDownY = 0
			self.mouseInfo.hasMoved = false
			if (e.button === 0) {
				self.mouseInfo.isLeftDown = true
				self.mouseInfo.nativeLeftDownX = mouseClientX
				self.mouseInfo.nativeLeftDownY = mouseClientY
			}
			if (e.button === 1) {
				self.mouseInfo.isMiddleDown = true
				self.mouseInfo.nativeMiddleDownX = mouseClientX
				self.mouseInfo.nativeMiddleDownY = mouseClientY
			}
			if (e.button === 2) {
				self.mouseInfo.isRightDown = true
				self.mouseInfo.nativeRightDownX = mouseClientX
				self.mouseInfo.nativeRightDownY = mouseClientY
			}
			rotationCalculationTypeRadioElements.forEach(itemElement => {
				const name = self.containerElement.id + '_' + itemElement.getAttribute('data-tag-name')
				itemElement.setAttribute('name', name)
				self.profile.rotationCalculationType = 3
				itemElement.checked = itemElement.value === String(self.profile.rotationCalculationType)
			})
		})
		document.addEventListener('mousemove', function (e) {
			const mouseClientX = e.clientX - self.canvasElementRect.left
			const mouseClientY = e.clientY - self.canvasElementRect.top
			const itemDistNativeX = mouseClientX - self.mouseInfo.moveLastNativeX
			const itemDistNativeY = mouseClientY - self.mouseInfo.moveLastNativeY
			const totalDistNativeX = mouseClientX - self.mouseInfo.nativeLeftDownX
			const totalDistNativeY = mouseClientY - self.mouseInfo.nativeLeftDownY
			if (self.mouseInfo.isLeftDown) {
				self.mouseInfo.hasLeftDownMove = true
				const ratioDistX = 0.65 * itemDistNativeX
				const ratioDistY = 0.65 * itemDistNativeY
				const len = Math.sqrt(totalDistNativeX * totalDistNativeX + totalDistNativeY * totalDistNativeY)
				const ratationQuaternion =
					len === 0
						? Ven$Quaternion.initQuaternion()
						: Ven$Quaternion.fromRotation(
								Ven$Angles.degreeToRadian(len * 0.65),
								new Ven$Vector3(totalDistNativeY / len, totalDistNativeX / len, 0)
						  )
				self.getModelInstances(self.glControl.modelInstances).forEach(modelInstanceItem => {
					modelInstanceItem.modeControl.currentQuaternion = Ven$Quaternion.multiplyQuaternions(
						ratationQuaternion,
						modelInstanceItem.modeControl.lastQuaternion
					)
					modelInstanceItem.modeControl.currentMatrixData = Ven$Quaternion.makeRotationFromQuaternion(
						modelInstanceItem.modeControl.currentQuaternion
					)
					/* ... */
					modelInstanceItem.modelRatation.y += ratioDistX
					modelInstanceItem.modelRatation.x += ratioDistY
				})
				self.isRender = true
			}
			if (self.mouseInfo.isRightDown) {
				self.mouseInfo.hasRightDownMove = true
			}
			if (self.mouseInfo.isMiddleDown) {
				self.mouseInfo.hasMiddleDownMove = true
			}
			self.mouseInfo.moveLastNativeX = mouseClientX
			self.mouseInfo.moveLastNativeY = mouseClientY
		})
		document.addEventListener('mouseup', function (e) {
			e.target.style.cursor = 'default'
			if (self.mouseInfo.isLeftDown && !self.mouseInfo.hasLeftDownMove) {
				self.canvasElementClickedAction.call(self, e)
			}
			if (self.mouseInfo.isLeftDown) {
				self.getModelInstances(self.glControl.modelInstances).forEach(modelInstanceItem => {
					modelInstanceItem.modeControl.lastQuaternion.resetBy(modelInstanceItem.modeControl.currentQuaternion)
				})
			}
			self.mouseInfo.hasLeftDownMove = self.mouseInfo.hasRightDownMove = self.mouseInfo.hasMiddleDownMove = false
			self.mouseInfo.isLeftDown = self.mouseInfo.isMiddleDown = self.mouseInfo.isRightDown = false
			self.mouseInfo.nativeLeftDownX = self.mouseInfo.nativeMiddleDownX = self.mouseInfo.nativeRightDownX = 0
			self.mouseInfo.nativeLeftDownY = self.mouseInfo.nativeMiddleDownY = self.mouseInfo.nativeRightDownY = 0
		})
		document.addEventListener('keydown', function (e) {
			e.preventDefault()
			e.stopPropagation()
			self.downKeys.add(e.keyCode)
			if (!Number.isNaN(+e.key)) {
				self.downNumberKeys.add(+e.key)
			}
			switch (e.keyCode) {
				// =
				case 187: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelScale.x -= 0.025
							modelInstanceItem.modelScale.y -= 0.025
							modelInstanceItem.modelScale.z -= 0.025
						})
						self.isRender = true
						break
					}
					break
				}
				// -
				case 189: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelScale.x += 0.025
							modelInstanceItem.modelScale.y += 0.025
							modelInstanceItem.modelScale.z += 0.025
						})
						self.isRender = true
						break
					}
					break
				}
				// ]
				case 221: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.z -= 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.z -= 1
						})
						self.isRender = true
						break
					}
					break
				}
				// [
				case 219: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.z += 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.z += 1
						})
						self.isRender = true
						break
					}
					break
				}
				// up
				case 38: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.y += 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.y += 1
						})
						self.isRender = true
						break
					}
					break
				}
				// right
				case 39: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.x += 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.x += 1
						})
						self.isRender = true
						break
					}
					break
				}
				// down
				case 40: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.y -= 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.y -= 1
						})
						self.isRender = true
						break
					}
					break
				}
				// left
				case 37: {
					if (e.ctrlKey === false && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelOffset.x -= 0.05
						})
						self.isRender = true
						break
					}
					if (e.ctrlKey === true && e.altKey === false && e.shiftKey === false && e.metaKey === false) {
						self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
							modelInstanceItem.modelRatation.x -= 1
						})
						self.isRender = true
						break
					}
					break
				}
			}
		})
		document.addEventListener('keyup', function (e) {
			e.preventDefault()
			e.stopPropagation()
			self.downKeys.delete(e.keyCode)
			if (self.downNumberKeys.has(+e.key)) {
				self.downNumberKeys.delete(+e.key)
			}
		})
		modelSourceTypeRadioElements.forEach(itemElement => {
			itemElement.addEventListener('change', function (e) {
				self.profile.modelSourceType = +this.value
				self.clearView()
				self.toggleModelSourceTypeView()
				if (self.profile.modelSourceType === 1) {
					self.toggleModelModelDatas('model1')
				}
				if (self.profile.modelSourceType === 2) {
				}
				self.isRender = true
			})
		})
		modelFileSelectorFileElement.addEventListener('input', function (e) {
			console.time(`ImportModelData`)
			const fileReader = new FileReader()
			const fileItem = this.files[0]
			fileReader.onload = function () {
				const objDoc = modelObj.generate(fileItem.name)
				const result = objDoc.parse(fileReader.result, 10, true)
				const drawingInfo = objDoc.getDrawingInfo()
				const objModel = new ObjModel1()
				objModel.vertexDatas = {
					colors: drawingInfo.colors,
					vertices: drawingInfo.vertices,
					normals: drawingInfo.normals,
					indices: drawingInfo.indices,
				}
				Program.setFileModelInstances([objModel])
				console.log(Program.glControl)
				console.timeEnd(`ImportModelData`)
			}
			fileReader.readAsText(fileItem, 'utf-8')
		})
		modelPresetListSelectorSelectElement.addEventListener('change', function (e) {
			self.toggleModelModelDatas(this.value)
			self.isRender = true
		})
		rotationCalculationTypeRadioElements.forEach(itemElement => {
			itemElement.addEventListener('change', function (e) {
				self.profile.rotationCalculationType = +this.value
				console.log('rotationCalculationType:', self.profile.rotationCalculationType)
				modelRotationRangeXShowSpanElement.textContent = modelRotationRangeXElement.value = 0
				modelRotationRangeYShowSpanElement.textContent = modelRotationRangeYElement.value = 0
				modelRotationRangeZShowSpanElement.textContent = modelRotationRangeZElement.value = 0
				self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
					modelInstanceItem.modelRatation.x = 0
					modelInstanceItem.modelRatation.y = 0
					modelInstanceItem.modelRatation.z = 0
					modelInstanceItem.modeControl.currentQuaternion = Ven$Quaternion.initQuaternion()
					modelInstanceItem.modeControl.lastQuaternion = Ven$Quaternion.initQuaternion()
					modelInstanceItem.modeControl.currentMatrixData = Ven$CanvasMatrix4.initMatrix()
				})
				self.isRender = true
			})
		})
		modelRotationRangeXElement.addEventListener('input', function (e) {
			modelRotationRangeXShowSpanElement.textContent = +this.value
			const len = Math.sqrt(+this.value * +this.value)
			const ratationQuaternion =
				len === 0
					? Ven$Quaternion.initQuaternion()
					: Ven$Quaternion.fromRotation(Ven$Angles.degreeToRadian(len), new Ven$Vector3(+this.value / len, 0, 0))
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.currentQuaternion = Ven$Quaternion.multiplyQuaternions(
					ratationQuaternion,
					modelInstanceItem.modeControl.lastQuaternion
				)
				modelInstanceItem.modeControl.currentMatrixData = Ven$Quaternion.makeRotationFromQuaternion(
					modelInstanceItem.modeControl.currentQuaternion
				)
				/* ... */
				modelInstanceItem.modelRatation.x = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeXElement.addEventListener('change', function (e) {
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.lastQuaternion = modelInstanceItem.modeControl.currentQuaternion
			})
		})
		modelRotationRangeYElement.addEventListener('input', function (e) {
			modelRotationRangeYShowSpanElement.textContent = +this.value
			const len = Math.sqrt(+this.value * +this.value)
			const ratationQuaternion =
				len === 0
					? Ven$Quaternion.initQuaternion()
					: Ven$Quaternion.fromRotation(Ven$Angles.degreeToRadian(len), new Ven$Vector3(0, +this.value / len, 0))
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.currentQuaternion = Ven$Quaternion.multiplyQuaternions(
					ratationQuaternion,
					modelInstanceItem.modeControl.lastQuaternion
				)
				modelInstanceItem.modeControl.currentMatrixData = Ven$Quaternion.makeRotationFromQuaternion(
					modelInstanceItem.modeControl.currentQuaternion
				)
				/* ... */
				modelInstanceItem.modelRatation.y = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeYElement.addEventListener('change', function (e) {
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.lastQuaternion = modelInstanceItem.modeControl.currentQuaternion
			})
		})
		modelRotationRangeZElement.addEventListener('input', function (e) {
			modelRotationRangeZShowSpanElement.textContent = +this.value
			const len = Math.sqrt(+this.value * +this.value)
			const ratationQuaternion =
				len === 0
					? Ven$Quaternion.initQuaternion()
					: Ven$Quaternion.fromRotation(Ven$Angles.degreeToRadian(len), new Ven$Vector3(0, 0, +this.value / len))
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.currentQuaternion = Ven$Quaternion.multiplyQuaternions(
					ratationQuaternion,
					modelInstanceItem.modeControl.lastQuaternion
				)
				modelInstanceItem.modeControl.currentMatrixData = Ven$Quaternion.makeRotationFromQuaternion(
					modelInstanceItem.modeControl.currentQuaternion
				)
				/* ... */
				modelInstanceItem.modelRatation.z = +this.value
			})
			self.isRender = true
		})
		modelRotationRangeZElement.addEventListener('change', function (e) {
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modeControl.lastQuaternion = modelInstanceItem.modeControl.currentQuaternion
			})
		})
		modelOffsetRangeXElement.addEventListener('input', function (e) {
			modelOffsetRangeXShowSpanElement.textContent = +this.value
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.x = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeYElement.addEventListener('input', function (e) {
			modelOffsetRangeYShowSpanElement.textContent = +this.value
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.y = +this.value
			})
			self.isRender = true
		})
		modelOffsetRangeZElement.addEventListener('input', function (e) {
			modelOffsetRangeZShowSpanElement.textContent = +this.value
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modelOffset.z = +this.value
			})
			self.isRender = true
		})
		modelScaleRangeElement.addEventListener('input', function (e) {
			modelScaleRangeShowSpanElement.textContent = +this.value
			self.getModelInstances(self.glControl.modelInstances, self.downNumberKeys).forEach(modelInstanceItem => {
				modelInstanceItem.modelScale.x = +this.value
				modelInstanceItem.modelScale.y = +this.value
				modelInstanceItem.modelScale.z = +this.value
			})
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
			if (self.profile.autoTransformation) {
				self.profile.rotationCalculationType = 1
				rotationCalculationTypeRadioElements.forEach(itemElement => {
					itemElement.checked = itemElement.value === String(self.profile.rotationCalculationType)
				})
			}
		})
		fogStartDistRangeElement.addEventListener('input', function (e) {
			fogStartDistShowShowSpanElement.textContent = self.profile.fog.dist.distOfStartAndEye = +this.value
			console.log('light.fog.dist:', self.profile.light.intensityGain)
			self.isRender = true
		})
		fogEndDistRangeElement.addEventListener('input', function (e) {
			fogEndDistShowShowSpanElement.textContent = self.profile.fog.dist.distOfEndAndEye = +this.value
			console.log('light.fog.dist:', self.profile.light.intensityGain)
			self.isRender = true
		})
	}

	static getModelInstances(modelInstances = [], downNumberKeys = new Set()) {
		if (!downNumberKeys || downNumberKeys.size <= 0) {
			return [...modelInstances]
		}
		const filterModelInstances = []
		downNumberKeys.forEach(number => {
			const idx = number - 1
			if (modelInstances[idx]) {
				filterModelInstances.push(modelInstances[idx])
			}
		})
		return filterModelInstances
	}

	static renderModelInfomationView(modelInstances = []) {
		const modelInfomationElement = this.containerElement.querySelector(`[data-tagitem="model-infomation"]`)
		let htmlString = ``
		modelInstances.forEach((modelInstanceItem, index) => {
			htmlString += `
				<div style="font-size: 14px;">
					<div style="font-weight: 900;">MODEL ${index + 1}:</div> 
					<div style="padding: 2px 2px 2px 10px;">Model Offset: ${JSON.stringify(modelInstanceItem.modelOffset)}</div>
					<div style="padding: 2px 2px 2px 10px;">Model Scale: ${JSON.stringify(modelInstanceItem.modelScale)}</div>
					<div style="padding: 2px 2px 2px 10px;">Model Ratation: ${JSON.stringify(modelInstanceItem.modelRatation)}</div>
				</div>
			`
		})
		modelInfomationElement.innerHTML = htmlString
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

	static toggleModelSourceTypeView() {
		const modelFileSelectorFileElement = this.containerElement.querySelector(`[data-tag-name="modelFileSelector"]`)
		const modelPresetListSelectorSelectElement = this.containerElement.querySelector(`[data-tag-name="modelPresetListSelector"]`)
		const autoTransformationCheckboxElement = this.containerElement.querySelector(`[data-tag-name="autoTransformation"]`)
		autoTransformationCheckboxElement.checked = false
		this.profile.autoTransformation = false
		if (this.profile.modelSourceType === 1) {
			modelPresetListSelectorSelectElement.parentElement.style.display = 'flex'
			modelFileSelectorFileElement.parentElement.style.display = 'none'
		}
		if (this.profile.modelSourceType === 2) {
			modelPresetListSelectorSelectElement.parentElement.style.display = 'none'
			modelFileSelectorFileElement.parentElement.style.display = 'flex'
		}
	}

	static toggleModelModelDatas(modelType) {
		console.time(`CreateModelData`)
		this.glControl.modelInstances = []
		switch (modelType) {
			case 'model1': {
				const humanoidModelDatas1 = this.createHumanoidModelDatas()
				const humanoidModelDatas2 = this.createHumanoidModelDatas(15, 0, -20)
				this.glControl.modelInstances = [...humanoidModelDatas1.modelInstances, ...humanoidModelDatas2.modelInstances]
				break
			}
			case 'model2': {
				const cubeModelDatas1 = this.createtCubeModelDatas(20, 20, 20)
				this.glControl.modelInstances = [...cubeModelDatas1.modelInstances]
				break
			}
			case 'model3': {
				const shereModelDatas1 = this.createShereModelDatas(15, 50, 50)
				this.glControl.modelInstances = [...shereModelDatas1.modelInstances]
				break
			}
			case 'model4': {
				const zplaneModelDatas1 = this.createZPlaneModelDatas(50, 50, 0)
				this.glControl.modelInstances = [...zplaneModelDatas1.modelInstances]
				break
			}
		}
		this.glControl.modelInstances.forEach(modelInstanceItem => {
			modelInstanceItem.normalBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.featureBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.texCoordBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			if (!modelInstanceItem.modeControl.lastQuaternion) {
				modelInstanceItem.modeControl.lastQuaternion = Ven$Quaternion.initQuaternion()
			}
		})
		this.glControl.vertexFeatureSize = this.getVertexFeatureSize(this.glControl.modelInstances)
		console.timeEnd(`CreateModelData`)
		console.log(Program.glControl)
		this.renderModelInfomationView(this.glControl.modelInstances)
	}

	static canvasElementClickedAction(e) {
		const isPickedModelObject = this.isPickedModelObject(this.mouseInfo.nativeLeftDownX, this.mouseInfo.nativeLeftDownY)
		if (isPickedModelObject) {
			console.log(`has selected model body.`)
		} else {
			console.log(`click blank section.`)
		}
	}

	static isPickedModelObject(x, y) {
		this.glControl.setWebGLRenderClickedStatus()
		const pixels = new Uint8Array(4)
		let isPicked = false
		this.glControl.gl.readPixels(x, y, 1, 1, this.glControl.gl.RGBA, this.glControl.gl.UNSIGNED_BYTE, pixels)
		if (pixels[0] == 255) {
			isPicked = true
		}
		this.glControl.setWebGLRenderNormalStatus()
		return isPicked
	}

	static syncFogColor2ClearColor() {
		this.profile.clearColor.r = this.profile.fog.color.r
		this.profile.clearColor.g = this.profile.fog.color.g
		this.profile.clearColor.b = this.profile.fog.color.b
	}

	static createHumanoidModelDatas(offsetX = 0, offsetY = 0, offsetZ = 0) {
		const modelInstances = []
		const modelHead = new RectangularModel1(4, 3.5, 3.5, '#ffffff', 0 + offsetX, 12 + offsetY, 0 + offsetZ)
		const modelBody = new RectangularModel1(8, 10, 4, '#ffffff', 0 + offsetX, 5 + offsetY, 0 + offsetZ)
		const modelLeftArm = new RectangularModel1(2, 13.5, 2, '#ffffff', 5.5 + offsetX, 3 + offsetY, 0 + offsetZ)
		const modelRightArm = new RectangularModel1(2, 13.5, 2, '#ffffff', -5.5 + offsetX, 3 + offsetY, 0 + offsetZ)
		const modelLeftLeg = new RectangularModel1(2.5, 14.5, 2.5, '#ffffff', 2.5 + offsetX, -7.5 + offsetY, 0 + offsetZ)
		const modelRightLeg = new RectangularModel1(2.5, 14.5, 2.5, '#ffffff', -2.5 + offsetX, -7.5 + offsetY, 0 + offsetZ)
		const modelLeftFoot = new RectangularModel1(2.5, 2.5, 3.5, '#ffffff', 2.5 + offsetX, -15.5 + offsetY, 0.5 + offsetZ)
		const modelRightFoot = new RectangularModel1(2.5, 2.5, 3.5, '#ffffff', -2.5 + offsetX, -15.5 + offsetY, 0.5 + offsetZ)
		modelInstances.push(modelHead, modelBody, modelLeftArm, modelRightArm, modelLeftLeg, modelRightLeg, modelLeftFoot, modelRightFoot)
		return {
			modelInstances,
		}
	}

	static createtCubeModelDatas(width, length, depth, offsetX = 0, offsetY = 0, offsetZ = 0, color = '#ffffff') {
		const modelInstances = []
		const model1 = new RectangularModel1(width, length, depth, color, 0 + offsetX, 0 + offsetY, 0 + offsetZ)
		modelInstances.push(model1)
		return {
			modelInstances,
		}
	}

	static createShereModelDatas(radius, meridianCount, latitudeCount, offsetX = 0, offsetY = 0, offsetZ = 0, color = '#ffffff') {
		const modelInstances = []
		const model1 = new ShereModel1(radius, meridianCount, latitudeCount, color, 0 + offsetX, 0 + offsetY, 0 + offsetZ)
		modelInstances.push(model1)
		return {
			modelInstances,
		}
	}

	static createZPlaneModelDatas(width, length, zDist, offsetX = 0, offsetY = 0, offsetZ = 0, color = '#ffffff') {
		const modelInstances = []
		const model1 = new ZPlane1(width, length, zDist, color, 0 + offsetX, 0 + offsetY, 0 + offsetZ)
		modelInstances.push(model1)
		return {
			modelInstances,
		}
	}

	static getVertexFeatureSize(modelInstances) {
		let len = 0
		modelInstances.forEach(modelInstanceItem => {
			len += modelInstanceItem.vertexDatas.vertexFeature.length
		})
		return len
	}

	static clearView() {
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
		modelRotationXShowSpanElement.textContent = modelRotationRangeXElement.value = 0
		modelRotationYShowSpanElement.textContent = modelRotationRangeYElement.value = 0
		modelRotationZShowSpanElement.textContent = modelRotationRangeZElement.value = 0
		modelOffsetXShowSpanElement.textContent = modelOffsetRangeXElement.value = 0
		modelOffsetYShowSpanElement.textContent = modelOffsetRangeYElement.value = 0
		modelOffsetZShowSpanElement.textContent = modelOffsetRangeZElement.value = 0
		modelScaleRangeShowSpanElement.textContent = modelScaleRangeElement.value = 1
		this.glControl.modelInstances = []
		this.glControl.vertexFeatureSize = 0
		this.isRender = true
	}

	static setFileModelInstances(objModels) {
		this.glControl.modelInstances = [...objModels]
		this.glControl.modelInstances.forEach(modelInstanceItem => {
			modelInstanceItem.normalBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.vertexBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.colorBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.indexBuffer = ven$initElementArrayBufferForLaterUse(this.glControl.gl)
			modelInstanceItem.texCoordBuffer = ven$initArrayBufferForLaterUse(this.glControl.gl)
			if (!modelInstanceItem.modeControl.lastQuaternion) {
				modelInstanceItem.modeControl.lastQuaternion = Ven$Quaternion.initQuaternion()
			}
		})
		this.isRender = true
	}
}
