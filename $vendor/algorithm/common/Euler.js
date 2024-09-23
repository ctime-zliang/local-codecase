class Ven$Euler {
	static initEuler() {
		return new Ven$Euler()
	}

	static setFromRotationMatrix(matrix4, order) {
		const euler = new Ven$Euler()
		const clamp = (value, min, max) => {
			return Math.max(min, Math.min(value, max))
		}
		const m11 = matrix4.data[0]
		const m12 = matrix4.data[4]
		const m13 = matrix4.data[8]
		const m21 = matrix4.data[1]
		const m22 = matrix4.data[5]
		const m23 = matrix4.data[9]
		const m31 = matrix4.data[2]
		const m32 = matrix4.data[6]
		const m33 = matrix4.data[10]
		const iOrder = order || euler._order

		if (iOrder === 'XYZ') {
			euler.y = Math.asin(clamp(m13, -1, 1))
			if (Math.abs(m13) < 0.99999) {
				euler.x = Math.atan2(-m23, m33)
				euler.z = Math.atan2(-m12, m11)
			} else {
				euler.x = Math.atan2(m32, m22)
				euler.z = 0
			}
		} else if (iOrder === 'YXZ') {
			euler.x = Math.asin(-clamp(m23, -1, 1))
			if (Math.abs(m23) < 0.99999) {
				euler.y = Math.atan2(m13, m33)
				euler.z = Math.atan2(m21, m22)
			} else {
				euler.y = Math.atan2(-m31, m11)
				euler.z = 0
			}
		} else if (iOrder === 'ZXY') {
			euler.x = Math.asin(clamp(m32, -1, 1))
			if (Math.abs(m32) < 0.99999) {
				euler.y = Math.atan2(-m31, m33)
				euler.z = Math.atan2(-m12, m22)
			} else {
				euler.y = 0
				euler.z = Math.atan2(m21, m11)
			}
		} else if (iOrder === 'ZYX') {
			euler.y = Math.asin(-clamp(m31, -1, 1))
			if (Math.abs(m31) < 0.99999) {
				euler.x = Math.atan2(m32, m33)
				euler.z = Math.atan2(m21, m11)
			} else {
				euler.x = 0
				euler.z = Math.atan2(-m12, m22)
			}
		} else if (iOrder === 'YZX') {
			euler.z = Math.asin(clamp(m21, -1, 1))
			if (Math.abs(m21) < 0.99999) {
				euler.x = Math.atan2(-m23, m22)
				euler.y = Math.atan2(-m31, m11)
			} else {
				euler.x = 0
				euler.y = Math.atan2(m13, m33)
			}
		} else if (iOrder === 'XZY') {
			euler.z = Math.asin(-clamp(m12, -1, 1))
			if (Math.abs(m12) < 0.99999) {
				euler.x = Math.atan2(m32, m22)
				euler.y = Math.atan2(m13, m11)
			} else {
				euler.x = Math.atan2(-m23, m33)
				euler.y = 0
			}
		} else {
			console.warn('unsupported order: ' + iOrder)
		}
		euler.order = iOrder
		return euler
	}

	constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
		this._x = x
		this._y = y
		this._z = z
		this._order = order
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

	get order() {
		return this._order
	}
	set order(value) {
		this._order = value
	}

	resetBy(euler) {
		this.x = euler.x
		this.y = euler.y
		this.z = euler.z
		this.order = euler.order
	}

	toString() {
		return `Euler(${this.x}, ${this.y}, ${this.z}, ${this.order})`
	}
}
