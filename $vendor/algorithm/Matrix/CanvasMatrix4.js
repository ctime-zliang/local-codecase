class Ven$CanvasMatrix4 {
	static initMatrix() {
		return new Ven$Matrix4()
	}

	static setFromArray(array) {
		if (array.length !== 16) {
			return new Ven$Matrix4()
		}
		const matrix4 = new Ven$Matrix4()
		for (let i = 0; i < 16; i++) {
			matrix4.data[i] = array[i]
		}
		return matrix4
	}

	static copyMatrix(refMatrix4) {
		const matrix4 = new Ven$Matrix4()
		for (let i = 0; i < refMatrix4.data.length; i++) {
			matrix4.data[i] = refMatrix4.data[i]
		}
		return matrix4
	}

	/**
	 * @description 创建旋转变换矩阵: 基于欧拉角
	 * @function setRotationFromEuler
	 * @param {Ven$Euler} euler 欧拉角
	 * @return {Ven$Matrix4}
	 */
	static setRotationFromEuler(euler) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z, order } = euler
		const a = Math.cos(x)
		const b = Math.sin(x)
		const c = Math.cos(y)
		const d = Math.sin(y)
		const e = Math.cos(z)
		const f = Math.sin(z)
		if (order === 'XYZ') {
			const ae = a * e
			const af = a * f
			const be = b * e
			const bf = b * f

			matrix4.data[0] = c * e
			matrix4.data[4] = -c * f
			matrix4.data[8] = d

			matrix4.data[1] = af + be * d
			matrix4.data[5] = ae - bf * d
			matrix4.data[9] = -b * c

			matrix4.data[2] = bf - ae * d
			matrix4.data[6] = be + af * d
			matrix4.data[10] = a * c
		} else if (order === 'YXZ') {
			const ce = c * e
			const cf = c * f
			const de = d * e
			const df = d * f

			matrix4.data[0] = ce + df * b
			matrix4.data[4] = de * b - cf
			matrix4.data[8] = a * d

			matrix4.data[1] = a * f
			matrix4.data[5] = a * e
			matrix4.data[9] = -b

			matrix4.data[2] = cf * b - de
			matrix4.data[6] = df + ce * b
			matrix4.data[10] = a * c
		} else if (order === 'ZXY') {
			const ce = c * e
			const cf = c * f
			const de = d * e
			const df = d * f

			matrix4.data[0] = ce - df * b
			matrix4.data[4] = -a * f
			matrix4.data[8] = de + cf * b

			matrix4.data[1] = cf + de * b
			matrix4.data[5] = a * e
			matrix4.data[9] = df - ce * b

			matrix4.data[2] = -a * d
			matrix4.data[6] = b
			matrix4.data[10] = a * c
		} else if (order === 'ZYX') {
			const ae = a * e
			const af = a * f
			const be = b * e
			const bf = b * f

			matrix4.data[0] = c * e
			matrix4.data[4] = be * d - af
			matrix4.data[8] = ae * d + bf

			matrix4.data[1] = c * f
			matrix4.data[5] = bf * d + ae
			matrix4.data[9] = af * d - be

			matrix4.data[2] = -d
			matrix4.data[6] = b * c
			matrix4.data[10] = a * c
		} else if (order === 'YZX') {
			const ac = a * c
			const ad = a * d
			const bc = b * c
			const bd = b * d

			matrix4.data[0] = c * e
			matrix4.data[4] = bd - ac * f
			matrix4.data[8] = bc * f + ad

			matrix4.data[1] = f
			matrix4.data[5] = a * e
			matrix4.data[9] = -b * e

			matrix4.data[2] = -d * e
			matrix4.data[6] = ad * f + bc
			matrix4.data[10] = ac - bd * f
		} else if (order === 'XZY') {
			const ac = a * c
			const ad = a * d
			const bc = b * c
			const bd = b * d

			matrix4.data[0] = c * e
			matrix4.data[4] = -f
			matrix4.data[8] = d * e

			matrix4.data[1] = ac * f + bd
			matrix4.data[5] = a * e
			matrix4.data[9] = ad * f - bc

			matrix4.data[2] = bc * f - ad
			matrix4.data[6] = b * e
			matrix4.data[10] = bd * f + ac
		}

		matrix4.data[3] = 0
		matrix4.data[7] = 0
		matrix4.data[11] = 0

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建旋转变换矩阵: 基于四元数
	 * @function setRotationFromQuaternion
	 * @param {Ven$Quaternion} quaternion 四元数
	 * @return {Ven$Matrix4}
	 */
	static setRotationFromQuaternion(quaternion) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z, w } = quaternion
		const x2 = 2 * x
		const y2 = 2 * y
		const z2 = 2 * z
		const xx = x * x2
		const xy = x * y2
		const xz = x * z2
		const yy = y * y2
		const yz = y * z2
		const zz = z * z2
		const wx = w * x2
		const wy = w * y2
		const wz = w * z2

		matrix4.data[0] = 1 - (yy + zz)
		matrix4.data[1] = xy + wz
		matrix4.data[2] = xz - wy
		matrix4.data[3] = 0

		matrix4.data[4] = xy - wz
		matrix4.data[5] = 1 - (xx + zz)
		matrix4.data[6] = yz + wx
		matrix4.data[7] = 0

		matrix4.data[8] = xz + wy
		matrix4.data[9] = yz - wx
		matrix4.data[10] = 1 - (xx + yy)
		matrix4.data[11] = 0

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建变换矩阵: 旋转矩阵
	 * @function setRotate
	 * @param {number} radian 旋转弧度
	 * @param {Ven$Vector3} axisVector3 旋转轴(向量)
	 * @return {Ven$Matrix4}
	 */
	static setRotate(radian, axisVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = axisVector3
		let vx = x
		let vy = y
		let vz = z
		let s = Math.sin(radian)
		let c = Math.cos(radian)
		if (0 !== vx && 0 === vy && 0 === vz) {
			/**
			 * 绕 X 轴
			 */
			if (vx < 0) {
				s = -s
			}
			matrix4.data[0] = 1
			matrix4.data[4] = 0
			matrix4.data[8] = 0
			matrix4.data[12] = 0
			matrix4.data[1] = 0
			matrix4.data[5] = c
			matrix4.data[9] = -s
			matrix4.data[13] = 0
			matrix4.data[2] = 0
			matrix4.data[6] = s
			matrix4.data[10] = c
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else if (0 === vx && 0 !== vy && 0 === vz) {
			/**
			 * 绕 Y 轴
			 */
			if (vy < 0) {
				s = -s
			}
			matrix4.data[0] = c
			matrix4.data[4] = 0
			matrix4.data[8] = s
			matrix4.data[12] = 0
			matrix4.data[1] = 0
			matrix4.data[5] = 1
			matrix4.data[9] = 0
			matrix4.data[13] = 0
			matrix4.data[2] = -s
			matrix4.data[6] = 0
			matrix4.data[10] = c
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else if (0 === vx && 0 === vy && 0 !== vz) {
			/**
			 * 绕 Z 轴
			 */
			if (vz < 0) {
				s = -s
			}
			matrix4.data[0] = c
			matrix4.data[4] = -s
			matrix4.data[8] = 0
			matrix4.data[12] = 0
			matrix4.data[1] = s
			matrix4.data[5] = c
			matrix4.data[9] = 0
			matrix4.data[13] = 0
			matrix4.data[2] = 0
			matrix4.data[6] = 0
			matrix4.data[10] = 1
			matrix4.data[14] = 0
			matrix4.data[3] = 0
			matrix4.data[7] = 0
			matrix4.data[11] = 0
			matrix4.data[15] = 1
		} else {
			/**
			 * 绕任意方向轴
			 */
			const len = Math.sqrt(vx * vx + vy * vy + vz * vz)
			if (len !== 1) {
				const rlen = 1 / len
				vx *= rlen
				vy *= rlen
				vz *= rlen
			}
			let nc = 1 - c
			let xy = vx * vy
			let yz = vy * vz
			let zx = vz * vx
			let xs = vx * s
			let ys = vy * s
			let zs = vz * s
			matrix4.data[0] = vx * vx * nc + c
			matrix4.data[1] = xy * nc + zs
			matrix4.data[2] = zx * nc - ys
			matrix4.data[3] = 0
			matrix4.data[4] = xy * nc - zs
			matrix4.data[5] = vy * vy * nc + c
			matrix4.data[6] = yz * nc + xs
			matrix4.data[7] = 0
			matrix4.data[8] = zx * nc + ys
			matrix4.data[9] = yz * nc - xs
			matrix4.data[10] = vz * vz * nc + c
			matrix4.data[11] = 0
			matrix4.data[12] = 0
			matrix4.data[13] = 0
			matrix4.data[14] = 0
			matrix4.data[15] = 1
		}
		return matrix4
	}

	/**
	 * @description 创建变换矩阵: 平移矩阵
	 * @function setTranslate
	 * @param {Ven$Vector3} directionVector3 位移(向量)
	 * @return {Ven$Matrix4}
	 */
	static setTranslate(directionVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = directionVector3
		matrix4.data[0] = 1
		matrix4.data[4] = 0
		matrix4.data[8] = 0
		matrix4.data[12] = x
		matrix4.data[1] = 0
		matrix4.data[5] = 1
		matrix4.data[9] = 0
		matrix4.data[13] = y
		matrix4.data[2] = 0
		matrix4.data[6] = 0
		matrix4.data[10] = 1
		matrix4.data[14] = z
		matrix4.data[3] = 0
		matrix4.data[7] = 0
		matrix4.data[11] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建变换矩阵: 缩放矩阵
	 * @function setScale
	 * @param {Ven$Vector3} directionVector3 位移(向量)
	 * @return {Ven$Matrix4}
	 */
	static setScale(directionVector3) {
		const matrix4 = new Ven$Matrix4()
		const { x, y, z } = directionVector3
		matrix4.data[0] = x
		matrix4.data[4] = 0
		matrix4.data[8] = 0
		matrix4.data[12] = 0
		matrix4.data[1] = 0
		matrix4.data[5] = y
		matrix4.data[9] = 0
		matrix4.data[13] = 0
		matrix4.data[2] = 0
		matrix4.data[6] = 0
		matrix4.data[10] = z
		matrix4.data[14] = 0
		matrix4.data[3] = 0
		matrix4.data[7] = 0
		matrix4.data[11] = 0
		matrix4.data[15] = 1
		return matrix4
	}

	/**
	 * @description 创建正交投影矩阵
	 * @function setOrtho
	 * @param {number} left 可视范围左侧裁剪位置(左侧边界)
	 * @param {number} right 可视范围右侧裁剪位置(右侧边界)
	 * @param {number} bottom 可视范围底部裁剪位置(底部边界)
	 * @param {number} top 可视范围顶部裁剪位置(顶部边界)
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static setOrtho(left, right, bottom, top, near, far) {
		const matrix4 = new Ven$Matrix4()
		if (left === right || bottom === top || near === far) {
			throw 'null frustum'
		}
		const rw = 1 / (right - left)
		const rh = 1 / (top - bottom)
		const rd = 1 / (far - near)
		matrix4.data[0] = 2 * rw
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0
		matrix4.data[4] = 0
		matrix4.data[5] = 2 * rh
		matrix4.data[6] = 0
		matrix4.data[7] = 0
		matrix4.data[8] = 0
		matrix4.data[9] = 0
		matrix4.data[10] = -2 * rd
		matrix4.data[11] = 0
		matrix4.data[12] = -(right + left) * rw
		matrix4.data[13] = -(top + bottom) * rh
		matrix4.data[14] = -(far + near) * rd
		matrix4.data[15] = 1
		return matrix4
	}
	static setOrthoRectView(aspect, near = 100, far = -100, padding = 1) {
		return this.setOrtho(-aspect * padding, aspect * padding, -padding, padding, near, far)
	}

	/**
	 * @description 创建透视投影矩阵
	 * @function setPerspective
	 * @param {number} fovy 可视范围上下边界面构成的夹角
	 * @param {number} aspect 可视范围宽高比
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static setPerspective(fovy, aspect, near, far) {
		const matrix4 = new Ven$Matrix4()
		if (near === far || aspect === 0) {
			throw 'null frustum'
		}
		if (near <= 0) {
			throw 'near <= 0'
		}
		if (far <= 0) {
			throw 'far <= 0'
		}
		let _fovy = (Math.PI * fovy) / 180 / 2
		let s = Math.sin(_fovy)
		if (s === 0) {
			throw 'null frustum'
		}
		let rd = 1 / (far - near)
		let ct = Math.cos(_fovy) / s

		matrix4.data[0] = ct / aspect
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0

		matrix4.data[4] = 0
		matrix4.data[5] = ct
		matrix4.data[6] = 0
		matrix4.data[7] = 0

		matrix4.data[8] = 0
		matrix4.data[9] = 0
		matrix4.data[10] = -(far + near) * rd
		matrix4.data[11] = -1

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = -2 * near * far * rd
		matrix4.data[15] = 0
		return matrix4
	}

	/**
	 * @description 创建透视投影矩阵
	 * @function setOrtho
	 * @param {number} left 可视范围左侧裁剪位置(左侧边界)
	 * @param {number} right 可视范围右侧裁剪位置(右侧边界)
	 * @param {number} bottom 可视范围底部裁剪位置(底部边界)
	 * @param {number} top 可视范围顶部裁剪位置(顶部边界)
	 * @param {number} near 可视范围纵深方向近端裁剪位置(近端边界)
	 * @param {number} far 可视范围纵深方向远端裁剪位置(远端边界)
	 * @return {Ven$Matrix4}
	 */
	static setFrustum(left, right, bottom, top, near, far) {
		const matrix4 = new Ven$Matrix4()
		if (left === right || top === bottom || near === far) {
			throw 'null frustum'
		}
		if (near <= 0) {
			throw 'near <= 0'
		}
		if (far <= 0) {
			throw 'far <= 0'
		}
		const rw = 1 / (right - left)
		const rh = 1 / (top - bottom)
		const rd = 1 / (far - near)

		matrix4.data[0] = 2 * near * rw
		matrix4.data[1] = 0
		matrix4.data[2] = 0
		matrix4.data[3] = 0

		matrix4.data[4] = 0
		matrix4.data[5] = 2 * near * rh
		matrix4.data[6] = 0
		matrix4.data[7] = 0

		matrix4.data[8] = (right + left) * rw
		matrix4.data[9] = (top + bottom) * rh
		matrix4.data[10] = -(far + near) * rd
		matrix4.data[11] = -1

		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = -2 * near * far * rd
		matrix4.data[15] = 0
		return matrix4
	}

	/**
	 * @description 创建视图矩阵
	 * @function setLookAt
	 * @param {Ven$Vector3} eyeVector3 观察者视点位置
	 * @param {Ven$Vector3} atVector3 观察目标点位置
	 * @param {Ven$Vector3} upVector3 观察者上方向
	 * @return {Ven$Matrix4}
	 */
	static setLookAt(eyeVector3, atVector3, upVector3 = new Ven$Vector3(0, 1, 0)) {
		const matrix4 = new Ven$Matrix4()
		const { x: eyeX, y: eyeY, z: eyeZ } = eyeVector3
		const { x: atX, y: atY, z: atZ } = atVector3
		const { x: upX, y: upY, z: upZ } = upVector3
		let fx = atX - eyeX
		let fy = atY - eyeY
		let fz = atZ - eyeZ

		const rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)
		fx *= rlf
		fy *= rlf
		fz *= rlf
		let sx = fy * upZ - fz * upY
		let sy = fz * upX - fx * upZ
		let sz = fx * upY - fy * upX

		const rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)
		sx *= rls
		sy *= rls
		sz *= rls
		let ux = sy * fz - sz * fy
		let uy = sz * fx - sx * fz
		let uz = sx * fy - sy * fx

		matrix4.data[0] = sx
		matrix4.data[1] = ux
		matrix4.data[2] = -fx
		matrix4.data[3] = 0
		matrix4.data[4] = sy
		matrix4.data[5] = uy
		matrix4.data[6] = -fy
		matrix4.data[7] = 0
		matrix4.data[8] = sz
		matrix4.data[9] = uz
		matrix4.data[10] = -fz
		matrix4.data[11] = 0
		matrix4.data[12] = 0
		matrix4.data[13] = 0
		matrix4.data[14] = 0
		matrix4.data[15] = 1
		// return matrix4.multiply4(Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(-eyeX, -eyeY, -eyeZ)))
		return Ven$CanvasMatrix4.setTranslate(new Ven$Vector3(-eyeX, -eyeY, -eyeZ)).multiply4(matrix4)
	}

	/**
	 * @description 创建转置矩阵
	 * @function setTranspose
	 * @param {Ven$Matrix4} sourceMatrix4 矩阵
	 * @return {Ven$Matrix4}
	 */
	static setTranspose(sourceMatrix4) {
		const matrix4 = new Ven$Matrix4()
		for (let i = 0; i < sourceMatrix4.data.length; i++) {
			matrix4.data[i] = sourceMatrix4.data[i]
		}
		let t = undefined

		t = matrix4.data[1]
		matrix4.data[1] = matrix4.data[4]
		matrix4.data[4] = t
		t = matrix4.data[2]
		matrix4.data[2] = matrix4.data[8]
		matrix4.data[8] = t
		t = matrix4.data[3]
		matrix4.data[3] = matrix4.data[12]
		matrix4.data[12] = t
		t = matrix4.data[6]
		matrix4.data[6] = matrix4.data[9]
		matrix4.data[9] = t
		t = matrix4.data[7]
		matrix4.data[7] = matrix4.data[13]
		matrix4.data[13] = t
		t = matrix4.data[11]
		matrix4.data[11] = matrix4.data[14]
		matrix4.data[14] = t
		return matrix4
	}

	/**
	 * @description 创建逆矩阵
	 * @function setInverse
	 * @param {Ven$Matrix4} sourceMatrix4 矩阵
	 * @return {Ven$Matrix4}
	 */
	static setInverse(sourceMatrix4) {
		const invMatrix4 = new Ven$Matrix4()
		const resultMatrix4 = new Ven$Matrix4()
		invMatrix4.data[0] =
			sourceMatrix4.data[5] * sourceMatrix4.data[10] * sourceMatrix4.data[15] -
			sourceMatrix4.data[5] * sourceMatrix4.data[11] * sourceMatrix4.data[14] -
			sourceMatrix4.data[9] * sourceMatrix4.data[6] * sourceMatrix4.data[15] +
			sourceMatrix4.data[9] * sourceMatrix4.data[7] * sourceMatrix4.data[14] +
			sourceMatrix4.data[13] * sourceMatrix4.data[6] * sourceMatrix4.data[11] -
			sourceMatrix4.data[13] * sourceMatrix4.data[7] * sourceMatrix4.data[10]
		invMatrix4.data[4] =
			-sourceMatrix4.data[4] * sourceMatrix4.data[10] * sourceMatrix4.data[15] +
			sourceMatrix4.data[4] * sourceMatrix4.data[11] * sourceMatrix4.data[14] +
			sourceMatrix4.data[8] * sourceMatrix4.data[6] * sourceMatrix4.data[15] -
			sourceMatrix4.data[8] * sourceMatrix4.data[7] * sourceMatrix4.data[14] -
			sourceMatrix4.data[12] * sourceMatrix4.data[6] * sourceMatrix4.data[11] +
			sourceMatrix4.data[12] * sourceMatrix4.data[7] * sourceMatrix4.data[10]
		invMatrix4.data[8] =
			sourceMatrix4.data[4] * sourceMatrix4.data[9] * sourceMatrix4.data[15] -
			sourceMatrix4.data[4] * sourceMatrix4.data[11] * sourceMatrix4.data[13] -
			sourceMatrix4.data[8] * sourceMatrix4.data[5] * sourceMatrix4.data[15] +
			sourceMatrix4.data[8] * sourceMatrix4.data[7] * sourceMatrix4.data[13] +
			sourceMatrix4.data[12] * sourceMatrix4.data[5] * sourceMatrix4.data[11] -
			sourceMatrix4.data[12] * sourceMatrix4.data[7] * sourceMatrix4.data[9]
		invMatrix4.data[12] =
			-sourceMatrix4.data[4] * sourceMatrix4.data[9] * sourceMatrix4.data[14] +
			sourceMatrix4.data[4] * sourceMatrix4.data[10] * sourceMatrix4.data[13] +
			sourceMatrix4.data[8] * sourceMatrix4.data[5] * sourceMatrix4.data[14] -
			sourceMatrix4.data[8] * sourceMatrix4.data[6] * sourceMatrix4.data[13] -
			sourceMatrix4.data[12] * sourceMatrix4.data[5] * sourceMatrix4.data[10] +
			sourceMatrix4.data[12] * sourceMatrix4.data[6] * sourceMatrix4.data[9]

		invMatrix4.data[1] =
			-sourceMatrix4.data[1] * sourceMatrix4.data[10] * sourceMatrix4.data[15] +
			sourceMatrix4.data[1] * sourceMatrix4.data[11] * sourceMatrix4.data[14] +
			sourceMatrix4.data[9] * sourceMatrix4.data[2] * sourceMatrix4.data[15] -
			sourceMatrix4.data[9] * sourceMatrix4.data[3] * sourceMatrix4.data[14] -
			sourceMatrix4.data[13] * sourceMatrix4.data[2] * sourceMatrix4.data[11] +
			sourceMatrix4.data[13] * sourceMatrix4.data[3] * sourceMatrix4.data[10]
		invMatrix4.data[5] =
			sourceMatrix4.data[0] * sourceMatrix4.data[10] * sourceMatrix4.data[15] -
			sourceMatrix4.data[0] * sourceMatrix4.data[11] * sourceMatrix4.data[14] -
			sourceMatrix4.data[8] * sourceMatrix4.data[2] * sourceMatrix4.data[15] +
			sourceMatrix4.data[8] * sourceMatrix4.data[3] * sourceMatrix4.data[14] +
			sourceMatrix4.data[12] * sourceMatrix4.data[2] * sourceMatrix4.data[11] -
			sourceMatrix4.data[12] * sourceMatrix4.data[3] * sourceMatrix4.data[10]
		invMatrix4.data[9] =
			-sourceMatrix4.data[0] * sourceMatrix4.data[9] * sourceMatrix4.data[15] +
			sourceMatrix4.data[0] * sourceMatrix4.data[11] * sourceMatrix4.data[13] +
			sourceMatrix4.data[8] * sourceMatrix4.data[1] * sourceMatrix4.data[15] -
			sourceMatrix4.data[8] * sourceMatrix4.data[3] * sourceMatrix4.data[13] -
			sourceMatrix4.data[12] * sourceMatrix4.data[1] * sourceMatrix4.data[11] +
			sourceMatrix4.data[12] * sourceMatrix4.data[3] * sourceMatrix4.data[9]
		invMatrix4.data[13] =
			sourceMatrix4.data[0] * sourceMatrix4.data[9] * sourceMatrix4.data[14] -
			sourceMatrix4.data[0] * sourceMatrix4.data[10] * sourceMatrix4.data[13] -
			sourceMatrix4.data[8] * sourceMatrix4.data[1] * sourceMatrix4.data[14] +
			sourceMatrix4.data[8] * sourceMatrix4.data[2] * sourceMatrix4.data[13] +
			sourceMatrix4.data[12] * sourceMatrix4.data[1] * sourceMatrix4.data[10] -
			sourceMatrix4.data[12] * sourceMatrix4.data[2] * sourceMatrix4.data[9]

		invMatrix4.data[2] =
			sourceMatrix4.data[1] * sourceMatrix4.data[6] * sourceMatrix4.data[15] -
			sourceMatrix4.data[1] * sourceMatrix4.data[7] * sourceMatrix4.data[14] -
			sourceMatrix4.data[5] * sourceMatrix4.data[2] * sourceMatrix4.data[15] +
			sourceMatrix4.data[5] * sourceMatrix4.data[3] * sourceMatrix4.data[14] +
			sourceMatrix4.data[13] * sourceMatrix4.data[2] * sourceMatrix4.data[7] -
			sourceMatrix4.data[13] * sourceMatrix4.data[3] * sourceMatrix4.data[6]
		invMatrix4.data[6] =
			-sourceMatrix4.data[0] * sourceMatrix4.data[6] * sourceMatrix4.data[15] +
			sourceMatrix4.data[0] * sourceMatrix4.data[7] * sourceMatrix4.data[14] +
			sourceMatrix4.data[4] * sourceMatrix4.data[2] * sourceMatrix4.data[15] -
			sourceMatrix4.data[4] * sourceMatrix4.data[3] * sourceMatrix4.data[14] -
			sourceMatrix4.data[12] * sourceMatrix4.data[2] * sourceMatrix4.data[7] +
			sourceMatrix4.data[12] * sourceMatrix4.data[3] * sourceMatrix4.data[6]
		invMatrix4.data[10] =
			sourceMatrix4.data[0] * sourceMatrix4.data[5] * sourceMatrix4.data[15] -
			sourceMatrix4.data[0] * sourceMatrix4.data[7] * sourceMatrix4.data[13] -
			sourceMatrix4.data[4] * sourceMatrix4.data[1] * sourceMatrix4.data[15] +
			sourceMatrix4.data[4] * sourceMatrix4.data[3] * sourceMatrix4.data[13] +
			sourceMatrix4.data[12] * sourceMatrix4.data[1] * sourceMatrix4.data[7] -
			sourceMatrix4.data[12] * sourceMatrix4.data[3] * sourceMatrix4.data[5]
		invMatrix4.data[14] =
			-sourceMatrix4.data[0] * sourceMatrix4.data[5] * sourceMatrix4.data[14] +
			sourceMatrix4.data[0] * sourceMatrix4.data[6] * sourceMatrix4.data[13] +
			sourceMatrix4.data[4] * sourceMatrix4.data[1] * sourceMatrix4.data[14] -
			sourceMatrix4.data[4] * sourceMatrix4.data[2] * sourceMatrix4.data[13] -
			sourceMatrix4.data[12] * sourceMatrix4.data[1] * sourceMatrix4.data[6] +
			sourceMatrix4.data[12] * sourceMatrix4.data[2] * sourceMatrix4.data[5]

		invMatrix4.data[3] =
			-sourceMatrix4.data[1] * sourceMatrix4.data[6] * sourceMatrix4.data[11] +
			sourceMatrix4.data[1] * sourceMatrix4.data[7] * sourceMatrix4.data[10] +
			sourceMatrix4.data[5] * sourceMatrix4.data[2] * sourceMatrix4.data[11] -
			sourceMatrix4.data[5] * sourceMatrix4.data[3] * sourceMatrix4.data[10] -
			sourceMatrix4.data[9] * sourceMatrix4.data[2] * sourceMatrix4.data[7] +
			sourceMatrix4.data[9] * sourceMatrix4.data[3] * sourceMatrix4.data[6]
		invMatrix4.data[7] =
			sourceMatrix4.data[0] * sourceMatrix4.data[6] * sourceMatrix4.data[11] -
			sourceMatrix4.data[0] * sourceMatrix4.data[7] * sourceMatrix4.data[10] -
			sourceMatrix4.data[4] * sourceMatrix4.data[2] * sourceMatrix4.data[11] +
			sourceMatrix4.data[4] * sourceMatrix4.data[3] * sourceMatrix4.data[10] +
			sourceMatrix4.data[8] * sourceMatrix4.data[2] * sourceMatrix4.data[7] -
			sourceMatrix4.data[8] * sourceMatrix4.data[3] * sourceMatrix4.data[6]
		invMatrix4.data[11] =
			-sourceMatrix4.data[0] * sourceMatrix4.data[5] * sourceMatrix4.data[11] +
			sourceMatrix4.data[0] * sourceMatrix4.data[7] * sourceMatrix4.data[9] +
			sourceMatrix4.data[4] * sourceMatrix4.data[1] * sourceMatrix4.data[11] -
			sourceMatrix4.data[4] * sourceMatrix4.data[3] * sourceMatrix4.data[9] -
			sourceMatrix4.data[8] * sourceMatrix4.data[1] * sourceMatrix4.data[7] +
			sourceMatrix4.data[8] * sourceMatrix4.data[3] * sourceMatrix4.data[5]
		invMatrix4.data[15] =
			sourceMatrix4.data[0] * sourceMatrix4.data[5] * sourceMatrix4.data[10] -
			sourceMatrix4.data[0] * sourceMatrix4.data[6] * sourceMatrix4.data[9] -
			sourceMatrix4.data[4] * sourceMatrix4.data[1] * sourceMatrix4.data[10] +
			sourceMatrix4.data[4] * sourceMatrix4.data[2] * sourceMatrix4.data[9] +
			sourceMatrix4.data[8] * sourceMatrix4.data[1] * sourceMatrix4.data[6] -
			sourceMatrix4.data[8] * sourceMatrix4.data[2] * sourceMatrix4.data[5]

		let det =
			sourceMatrix4.data[0] * invMatrix4.data[0] +
			sourceMatrix4.data[1] * invMatrix4.data[4] +
			sourceMatrix4.data[2] * invMatrix4.data[8] +
			sourceMatrix4.data[3] * invMatrix4.data[12]
		if (det === 0) {
			return resultMatrix4
		}
		det = 1 / det
		for (let i = 0; i < invMatrix4.data.length; i++) {
			resultMatrix4.data[i] = invMatrix4.data[i] * det
		}
		return resultMatrix4
	}
}
