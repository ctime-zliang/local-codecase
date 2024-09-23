class BaseModel1 {
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

class RectangularModel1 extends BaseModel1 {
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

class ShereModel1 extends BaseModel1 {
	constructor(radius, meridianCount, latitudeCount, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this.modelParam = {
			radius,
			meridianCount,
			latitudeCount,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return createShereDatas(
			this.modelParam.radius,
			this.modelParam.meridianCount,
			this.modelParam.latitudeCount,
			{
				redRange: [this.modelParam.rgba.r, this.modelParam.rgba.r],
				greenRange: [this.modelParam.rgba.g, this.modelParam.rgba.g],
				blueRange: [this.modelParam.rgba.b, this.modelParam.rgba.b],
				alphaRange: [1, 1],
			},
			this.modelParam.offsetX,
			this.modelParam.offsetY,
			this.modelParam.offsetZ
		)
	}
}

class ObjModel1 extends BaseModel1 {
	constructor() {
		super()
	}
}

class ZPlane1 extends BaseModel1 {
	constructor(width, length, zDist, color = '#ffffff', offsetX = 0, offsetY = 0, offsetZ = 0) {
		super()
		this.modelParam = {
			width,
			length,
			zDist,
			rgba: ven$hex2Rgba(color),
			offsetX,
			offsetY,
			offsetZ,
		}
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			vertexFeature: new Float32Array([
				-this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				-this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
				-this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
				this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
				-this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				-this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
				this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
				this.modelParam.width / 2 + this.modelParam.offsetX,
				this.modelParam.zDist + this.modelParam.offsetY,
				-this.modelParam.length / 2 + this.modelParam.offsetZ,
				this.modelParam.rgba.r / 255,
				this.modelParam.rgba.g / 255,
				this.modelParam.rgba.b / 255,
				1.0,
			]),
			// prettier-ignore
			vertexNormals: new Float32Array([
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
				0, 1, 0,
			]),
		}
	}
}
