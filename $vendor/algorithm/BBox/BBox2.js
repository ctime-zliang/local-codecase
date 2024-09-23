class Ven$BBox2 {
	static isValid(bbox2) {
		return Number.isFinite(bbox2.minX) && Number.isFinite(bbox2.minY) && Number.isFinite(bbox2.maxX) && Number.isFinite(bbox2.maxY)
	}

	constructor(minX, minY, maxX, maxY) {
		this._data = new Float64Array(4)
		if (minX > maxX) {
			minX = [maxX, (maxX = minX)][0]
		}
		if (minY > maxY) {
			minY = [maxY, (maxY = minY)][0]
		}
		this._minX = minX
		this._minY = minY
		this._maxX = maxX
		this._maxY = maxY
	}

	get minX() {
		return this._minX
	}
	set minX(value) {
		this._minX = value
	}

	get minY() {
		return this._minY
	}
	set minY(value) {
		this._minX = value
	}

	get maxX() {
		return this._maxX
	}
	set maxX(value) {
		this._maxX = value
	}

	get maxY() {
		return this._maxY
	}
	set maxY(value) {
		this._maxY = value
	}

	get width() {
		return this.maxX - this.minX
	}

	get height() {
		return this.maxY - this.minY
	}

	get UpperLeftPoint() {
		return new Vector2(this.minX, this.minY)
	}

	get UpperRightPoint() {
		return new Vector2(this.maxX, this.minY)
	}

	get LowerLeftPoint() {
		return new Vector2(this.minX, this.maxY)
	}

	get LowerRightPoint() {
		return new Vector2(this.maxX, this.maxY)
	}

	get CenterPoint() {
		return new Vector2(this.maxX - (this.maxX - this.minX) / 2, this.maxY - (this.maxY - this.minY) / 2)
	}

	get data() {
		this._data[0] = this.minX
		this._data[1] = this.minY
		this._data[2] = this.maxX
		this._data[3] = this.maxY
		return this._data
	}

	/**
	 * 判断当前 BBox2 实例是否包裹了传入的 vector2
	 */
	isContainsPoint(vector2) {
		return this.isContainsX(vector2.x) && this.isContainsY(vector2.y)
	}

	/**
	 * 判断当前 BBox2 实例是否包裹了传入的 bbox2
	 */
	isConatinsBBox2(bbox2) {
		return this.maxX >= bbox2.maxX && this.minX <= bbox2.minX && this.maxY >= bbox2.maxY && this.minY <= bbox2.minY
	}

	/**
	 * 判断传入的 bbox2 是否包裹了当前 BBox2 实例
	 */
	isBeWrappedByBBox2(bbox2) {
		return this.minX >= bbox2.minX && this.maxX <= bbox2.maxX && this.minY >= bbox2.minY && this.maxY <= bbox2.maxY
	}

	/**
	 * 判断当前 BBox2 实例与传入的 bbox2 边界范围是否相等
	 */
	equals(bbox2) {
		if (this.minX === bbox2.minX && this.minY === bbox2.minY && this.maxX === bbox2.maxX && this.maxY === bbox2.maxY) {
			return true
		}
		return false
	}

	/**
	 * 判断当前 BBox2 实例与传入的 bbox2 边界范围是否交叉
	 */
	isIntersect(bbox2) {
		const _minX = Math.max(this.minX, bbox2.minX)
		const _maxX = Math.max(this.maxX, bbox2.maxX)
		if (_minX > _maxX) {
			return false
		}
		const _minY = Math.max(this.minY, bbox2.minY)
		const _maxY = Math.max(this.maxY, bbox2.maxY)
		if (_minY > _maxY) {
			return false
		}
		return true
	}

	reset() {
		this.minX = Number.POSITIVE_INFINITY
		this.maxX = Number.NEGATIVE_INFINITY
		this.minY = Number.POSITIVE_INFINITY
		this.maxY = Number.NEGATIVE_INFINITY
	}

	toString() {
		return `BBox2 (${this.minX}, ${this.maxX}, ${this.minY}, ${this.maxY})`
	}

	isContainsX(x) {
		return x >= this.minX && x <= this.maxX
	}

	isContainsY(y) {
		return y >= this.minY && y <= this.maxY
	}
}
