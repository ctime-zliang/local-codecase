const VEN$VECTOR3_ORIGIN_DATA = [0, 0, 0]

class Ven$Vector3 extends Ven$Vector {
	static ORIGIN = new Ven$Vector3()
	static X_INIT_UNIT_VERCTOR2 = new Ven$Vector3(1, 0, 0)
	static Y_INIT_UNIT_VERCTOR2 = new Ven$Vector3(0, 1, 0)
	static Z_INIT_UNIT_VERCTOR2 = new Ven$Vector3(0, 0, 1)

	constructor(x = VEN$VECTOR3_ORIGIN_DATA[0], y = VEN$VECTOR3_ORIGIN_DATA[1], z = VEN$VECTOR3_ORIGIN_DATA[2]) {
		super()
		this._x = x
		this._y = y
		this._z = z
	}

	get x() {
		return this._x
	}
	set x(value) {
		this._x = value
	}

	get y() {
		return this._y
	}
	set y(value) {
		this._y = value
	}

	get z() {
		return this._z
	}
	set z(value) {
		this._z = value
	}

	/**
	 * 向量长度
	 */
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	/**
	 * 向量副本
	 */
	copy() {
		return new Ven$Vector3(this.x, this.y, this.z)
	}

	/**
	 * 向量与向量相加
	 */
	add(vector3) {
		return new Ven$Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z)
	}

	/**
	 * 向量与标量相加
	 */
	addScalar(x, y, z) {
		return new Ven$Vector3(this.x + x, this.y + y, this.z + z)
	}

	/**
	 * 向量与向量相减
	 */
	sub(vector3) {
		return new Ven$Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z)
	}

	/**
	 * 向量与标量相减
	 */
	subScalar(x, y, z) {
		return new Ven$Vector3(this.x - x, this.y - y, this.z - z)
	}

	/**
	 * 向量缩放
	 */
	scale(x = 0, y = 0, z = 0) {
		return new Ven$Vector3(this.x * x, this.y * y, this.z * z)
	}

	/**
	 * 向量与标量的乘积
	 */
	mul(x = 0, y = 0, z = 0) {
		return this.scale(x, y, z)
	}

	/**
	 * 向量与向量叉乘
	 */
	cross(vector3) {
		const x = this.y * vector3.z - this.z * vector3.y
		const y = this.z * vector3.x - this.x * vector3.z
		const z = this.x * vector3.y - this.y * vector3.x
		return new Ven$Vector3(x, y, z)
	}

	/**
	 * 向量与向量点乘
	 */
	dot(vector3) {
		return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z
	}

	/**
	 * 应用 matrix4
	 */
	multiplyMatrix4(matrix4) {
		const x = this.x * matrix4.data[0] + this.y * matrix4.data[4] + this.z * matrix4.data[8] + matrix4.data[12]
		const y = this.x * matrix4.data[1] + this.y * matrix4.data[5] + this.z * matrix4.data[9] + matrix4.data[13]
		const z = this.x * matrix4.data[2] + this.y * matrix4.data[6] + this.z * matrix4.data[10] + matrix4.data[14]
		const w = this.x * matrix4.data[3] + this.y * matrix4.data[7] + this.z * matrix4.data[11] + matrix4.data[15]
		return new Ven$Vector3(x / w, y / w, z / w)
	}

	toString() {
		return `Vector3 (${this.x}, ${this.y}, ${this.z})`
	}

	toJSON() {
		return {
			x: this._x,
			y: this._y,
			z: this._z,
		}
	}

	/**
	 * 向量的单位向量
	 */
	normalize() {
		if (this.x === 0 && this.y === 0 && this.z === 0) {
			return new Ven$Vector3(0, 0, 0)
		}
		const sx = this.x / this.length
		const sy = this.y / this.length
		const sz = this.z / this.length
		return new Ven$Vector3(sx, sy, sz)
	}
}
