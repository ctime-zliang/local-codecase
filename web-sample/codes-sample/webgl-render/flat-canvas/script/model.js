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

class TestModel1 extends Model1 {
	constructor() {
		super()
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			// prettier-ignore
			vertexFeature: new Float32Array([
				/**
				 * 右侧三角
				 */
				/* 绿色 */
				0.125, 0.75, -4.0, 0.4, 1.0, 0.4, 1.0, 
				-0.25, -0.75, -4.0, 0.4, 1.0, 0.4, 1.25, 
				0.5, -0.75, -4.0, 1.0, 0.4, 0.4, 1.0,
				/* 黄色 */
				0.375, 0.75, -2.0, 1.0, 1.0, 0.4, 1.0, 
				0.0, -0.75, -2.0, 1.0, 1.0, 0.4, 1.0, 
				0.75, -0.75, -2.0, 1.0, 0.4, 0.4, 1.0,
				/* 蓝色 */
				0.625, 0.75, 0.0, 0.4, 0.4, 1.0, 1.0, 
				0.25, -0.75, 0.0, 0.4, 0.4, 1.0, 1.0, 
				1.0, -0.75, 0.0, 1.0, 0.4, 0.4, 1.0,
			]),
		}
	}
}

class TestModel2 extends Model1 {
	constructor() {
		super()
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			// prettier-ignore
			vertexFeature: new Float32Array([
				-0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
				-0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
				0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
                /* ... */
                -0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
                0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
                0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
			]),
		}
	}
}

class TestModel3 extends Model1 {
	constructor() {
		super()
		this.vertexDatas = this._createVertexData()
	}

	_createVertexData() {
		return {
			// prettier-ignore
			vertexFeature: new Float32Array([
				0, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
				-0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 
				0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
			]),
		}
	}
}
