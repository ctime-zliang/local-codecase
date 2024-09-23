class Ven$Quaternion {
	static initQuaternion() {
		return new Ven$Quaternion()
	}

	/**
	 * @description 欧拉角转四元数
	 * @function setFromEuler
	 * @param {Ven$Euler} euler 欧拉角
	 * @return {Ven$Quaternion}
	 */
	static setFromEuler(euler) {
		const quaternion = new Ven$Quaternion()
		const x = euler.x
		const y = euler.y
		const z = euler.z
		const order = euler.order
		const cosx = Math.cos(x / 2)
		const cosy = Math.cos(y / 2)
		const cosz = Math.cos(z / 2)
		const sinx = Math.sin(x / 2)
		const siny = Math.sin(y / 2)
		const sinz = Math.sin(z / 2)

		if (order === 'XYZ') {
			quaternion.x = sinx * cosy * cosz + cosx * siny * sinz
			quaternion.y = cosx * siny * cosz - sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz + sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz - sinx * siny * sinz
		} else if (order === 'YXZ') {
			quaternion.x = sinx * cosy * cosz + cosx * siny * sinz
			quaternion.y = cosx * siny * cosz - sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz - sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz + sinx * siny * sinz
		} else if (order === 'ZXY') {
			quaternion.x = sinx * cosy * cosz - cosx * siny * sinz
			quaternion.y = cosx * siny * cosz + sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz + sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz - sinx * siny * sinz
		} else if (order === 'ZYX') {
			quaternion.x = sinx * cosy * cosz - cosx * siny * sinz
			quaternion.y = cosx * siny * cosz + sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz - sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz + sinx * siny * sinz
		} else if (order === 'YZX') {
			quaternion.x = sinx * cosy * cosz + cosx * siny * sinz
			quaternion.y = cosx * siny * cosz + sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz - sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz - sinx * siny * sinz
		} else if (order === 'XZY') {
			quaternion.x = sinx * cosy * cosz - cosx * siny * sinz
			quaternion.y = cosx * siny * cosz - sinx * cosy * sinz
			quaternion.z = cosx * cosy * sinz + sinx * siny * cosz
			quaternion.w = cosx * cosy * cosz + sinx * siny * sinz
		}
		return quaternion
	}

	/**
	 * @description 旋转轴向量旋转指定角度后对应的四元数
	 * @function setFromAxisAngle
	 * @param {number} radian 旋转弧度
	 * @param {Ven$Vector3} axisVector3 旋转轴(向量)
	 * @return {Ven$Quaternion}
	 */
	static setFromAxisAngle(radian, axisVector3) {
		const quaternion = new Ven$Quaternion()
		const iAxisVector3 = axisVector3.copy().normalize()
		const halfRadian = radian / 2
		const s = Math.sin(halfRadian)

		quaternion.x = iAxisVector3.x * s
		quaternion.y = iAxisVector3.y * s
		quaternion.z = iAxisVector3.z * s
		quaternion.w = Math.cos(halfRadian)
		return quaternion
	}

	/**
	 * @description 旋转矩阵对应的四元数
	 * @function setFromRotationMatrix
	 * @param {Ven$Matrix4} matrix4 旋转矩阵
	 * @return {Ven$Quaternion}
	 */
	static setFromRotationMatrix(matrix4) {
		const quaternion = new Ven$Quaternion()
		const m11 = matrix4.data[0]
		const m12 = matrix4.data[4]
		const m13 = matrix4.data[8]
		const m21 = matrix4.data[1]
		const m22 = matrix4.data[5]
		const m23 = matrix4.data[9]
		const m31 = matrix4.data[2]
		const m32 = matrix4.data[6]
		const m33 = matrix4.data[10]
		let t = m11 + m22 + m33
		let s = undefined

		if (t > 0) {
			s = 0.5 / Math.sqrt(t + 1.0)
			quaternion.w = 0.25 / s
			quaternion.x = (m32 - m23) * s
			quaternion.y = (m13 - m31) * s
			quaternion.z = (m21 - m12) * s
		} else if (m11 > m22 && m11 > m33) {
			s = 2 * Math.sqrt(1.0 + m11 - m22 - m33)
			quaternion.w = (m32 - m23) / s
			quaternion.x = 0.25 * s
			quaternion.y = (m12 + m21) / s
			quaternion.z = (m13 + m31) / s
		} else if (m22 > m33) {
			s = 2 * Math.sqrt(1.0 + m22 - m11 - m33)
			quaternion.w = (m13 - m31) / s
			quaternion.x = (m12 + m21) / s
			quaternion.y = 0.25 * s
			quaternion.z = (m23 + m32) / s
		} else {
			s = 2 * Math.sqrt(1.0 + m33 - m11 - m22)
			quaternion.w = (m21 - m12) / s
			quaternion.x = (m13 + m31) / s
			quaternion.y = (m23 + m32) / s
			quaternion.z = 0.25 * s
		}
		return quaternion
	}

	/**
	 * @description 求 qs 到 qe 的四元数球面差值
	 * @function setSlerp
	 * @param {Ven$Quaternion} qs 起始四元数
	 * @param {Ven$Quaternion} qe 结束四元数
	 * @param {number} t 差值比率
	 * @return {Ven$Quaternion}
	 */
	static setSlerp(qs, qe, t) {
		const quaternion = qs.copy()
		if (t === 0) {
			return quaternion
		}
		if (t === 1) {
			return Ven$Quaternion.copyBy(qe)
		}
		const x = quaternion.x
		const y = quaternion.y
		const z = quaternion.z
		const w = quaternion.w
		let cosHalfTheta = w * qe.w + x * qe.x + y * qe.y + z * qe.z
		if (cosHalfTheta < 0) {
			quaternion.w = -qe.w
			quaternion.x = -qe.x
			quaternion.y = -qe.y
			quaternion.z = -qe.z
			cosHalfTheta = -cosHalfTheta
		} else {
			quaternion.resetBy(qe)
		}
		if (cosHalfTheta >= 1) {
			quaternion.w = w
			quaternion.x = x
			quaternion.y = y
			quaternion.z = z
			return quaternion
		}
		const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta
		if (sqrSinHalfTheta <= Number.EPSILON) {
			const s = 1 - t
			quaternion.w = s * w + t * quaternion.w
			quaternion.x = s * x + t * quaternion.x
			quaternion.y = s * y + t * quaternion.y
			quaternion.z = s * z + t * quaternion.z
			return quaternion.normalize()
		}
		const sinHalfTheta = Math.sqrt(sqrSinHalfTheta)
		const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta)
		const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta
		const ratioB = Math.sin(t * halfTheta) / sinHalfTheta
		quaternion.w = w * ratioA + quaternion.w * ratioB
		quaternion.x = x * ratioA + quaternion.x * ratioB
		quaternion.y = y * ratioA + quaternion.y * ratioB
		quaternion.z = z * ratioA + quaternion.z * ratioB
		return quaternion
	}

	static fromRotation(radian, axisVector3) {
		const { x, y, z } = axisVector3
		const cos = Math.cos(radian / 2)
		const sin = Math.sin(radian / 2)
		return new Ven$Quaternion(x * sin, y * sin, z * sin, cos)
	}

	static multiplyQuaternions(quaternion1, quaternion2) {
		const quaternion = new Ven$Quaternion()
		const qax = quaternion1.x
		const qay = quaternion1.y
		const qaz = quaternion1.z
		const qaw = quaternion1.w
		const qbx = quaternion2.x
		const qby = quaternion2.y
		const qbz = quaternion2.z
		const qbw = quaternion2.w

		quaternion.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby
		quaternion.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz
		quaternion.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx
		quaternion.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz
		return quaternion
	}

	static makeRotationFromQuaternion(quaternion) {
		const zero = new Ven$Vector3(0, 0, 0)
		const one = new Ven$Vector3(1, 1, 1)
		return Ven$Quaternion_compose(zero, quaternion, one)
	}

	static copyBy(quaternion) {
		const iQuaternion = new Ven$Quaternion()
		iQuaternion.x = quaternion.x
		iQuaternion.y = quaternion.y
		iQuaternion.z = quaternion.z
		iQuaternion.w = quaternion.w
		return iQuaternion
	}

	constructor(x = 0, y = 0, z = 0, w = 1) {
		this._x = x
		this._y = y
		this._z = z
		this._w = w
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

	get w() {
		return this._w
	}
	set w(value) {
		this._w = value
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
	}

	get lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
	}

	resetBy(quaternion) {
		this.x = quaternion.x
		this.y = quaternion.y
		this.z = quaternion.z
		this.w = quaternion.w
	}

	/**
	 * 求出当前四元数旋转到目标四元数所经过的角度
	 */
	angleTo(targetQuaternion) {
		const clamp = (value, min, max) => {
			return Math.max(min, Math.min(value, max))
		}
		return 2 * Math.acos(Math.abs(clamp(this.dot(targetQuaternion), -1, 1)))
	}

	/**
	 * 当前四元数的共轭四元数
	 */
	conjugate() {
		this.x *= -1
		this.y *= -1
		this.z *= -1
	}

	/**
	 * 当前四元数的逆四元数
	 */
	inverse() {
		return this.conjugate()
	}

	/**
	 * 当前四元数的点积
	 */
	dot(quaternion) {
		return this.x * quaternion.x + this.y * quaternion.y + this.z * quaternion.z + this.w * quaternion.w
	}

	normalize() {
		let len = this.length
		if (len === 0) {
			this.x = 0
			this.y = 0
			this.z = 0
			this.w = 1
		} else {
			len = 1 / len
			this.x *= len
			this.y *= len
			this.z *= len
			this.w *= len
		}
	}

	multiply(quaternion) {
		return Ven$Quaternion.multiplyQuaternions(this, quaternion)
	}

	copy() {
		const quaternion = new Ven$Quaternion()
		quaternion.x = this.x
		quaternion.y = this.y
		quaternion.z = this.z
		quaternion.w = this.w
		return quaternion
	}

	toString() {
		return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`
	}
}

function Ven$Quaternion_compose(position, quaternion, scale) {
	const array = new Array(16)
	const x = quaternion.x
	const y = quaternion.y
	const z = quaternion.z
	const w = quaternion.w
	const x2 = x + x
	const y2 = y + y
	const z2 = z + z
	const xx = x * x2
	const xy = x * y2
	const xz = x * z2
	const yy = y * y2
	const yz = y * z2
	const zz = z * z2
	const wx = w * x2
	const wy = w * y2
	const wz = w * z2
	const sx = scale.x
	const sy = scale.y
	const sz = scale.z

	array[0] = (1 - (yy + zz)) * sx
	array[1] = (xy + wz) * sx
	array[2] = (xz - wy) * sx
	array[3] = 0

	array[4] = (xy - wz) * sy
	array[5] = (1 - (xx + zz)) * sy
	array[6] = (yz + wx) * sy
	array[7] = 0

	array[8] = (xz + wy) * sz
	array[9] = (yz - wx) * sz
	array[10] = (1 - (xx + yy)) * sz
	array[11] = 0

	array[12] = position.x
	array[13] = position.y
	array[14] = position.z
	array[15] = 1
	return array
}
