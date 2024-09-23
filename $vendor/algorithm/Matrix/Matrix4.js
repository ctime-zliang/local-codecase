// prettier-ignore
const VEN$MATRIX4_ORIGIN_DATA = [
	1, 0, 0, 0, 
	0, 1, 0, 0, 
	0, 0, 1, 0,
	0, 0, 0, 1
]

class Ven$Matrix4 extends Ven$Matrix {
	static ORIGIN = new Ven$Matrix4()

	/**
	 * 平移矩阵(坐标)
	 */
	static createTranslateMatrix4ByCoordinate(x, y, z) {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			1, 0, 0, x,
		 * 			0, 1, 0, y,
		 * 			0, 0, 1, z,
		 * 			0, 0, 0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				1, 0, 0, 0, 
				0, 1, 0, 0, 
				0, 0, 1, 0, 
				x, y, z, 1
			]
		)
	}

	/**
	 * 旋转矩阵(弧度)
	 */
	static createRotateXMatrix4ByRadian(radian) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			1, 0,   0,    0,
		 * 			0, cos, -sin, 0,
		 * 			0, sin, cos,  0,
		 * 			0, 0,   0,    1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				1, 0,    0,   0, 
				0, cos,  sin, 0, 
				0, -sin, cos, 0, 
				0, 0,    0,   1
			]
		)
	}
	static createRotateYMatrix4ByRadian(radian) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			cos,  0, sin, 0,
		 * 			0,    1, 0,   0,
		 * 			-sin, 0, cos, 0,
		 * 			0, 0, 0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				cos, 0, -sin, 0, 
				0,   1, 0,    0, 
				sin, 0, cos,  0, 
				0,   0, 0,    1
			]
		)
	}
	static createRotateZMatrix4ByRadian(radian) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			cos, -sin, 0, 0,
		 * 			sin, cos,  0, 0,
		 * 			0,   0,    1, 0,
		 * 			0,   0,    0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				cos,  sin, 0, 0, 
				-sin, cos, 0, 0, 
				0,    0,   1, 0, 
				0,    0,   0, 1
			]
		)
	}

	/**
	 * 缩放矩阵(坐标)
	 */
	static createScaleMatrix4ByCoordinate(x, y, z) {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			x, 0, 0, 0,
		 * 			0, y, 0, 0,
		 * 			0, 0, z, 0,
		 * 			0, 0, 0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				x, 0, 0, 0, 
				0, y, 0, 0, 
				0, 0, z, 0, 
				0, 0, 0, 1
			]
		)
	}

	/**
	 * 翻转矩阵
	 */
	static createFlipXMatrix4() {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			1, 0,  0, 0,
		 * 			0, -1, 0, 0,
		 * 			0, 0,  1, 0,
		 * 			0, 0,  0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				1, 0,  0, 0, 
				0, -1, 0, 0, 
				0, 0,  1, 0, 
				0, 0,  0, 1
			]
		)
	}
	static createFlipYMatrix4() {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			-1, 0, 0, 0,
		 * 			0,  1, 0, 0,
		 * 			0,  0, 1, 0,
		 * 			0,  0, 0, 1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix4(
			// prettier-ignore
			[
				-1, 0, 0, 0, 
				0,  1, 0, 0, 
				0,  0, 1, 0, 
				0,  0, 0, 1
			])
	}

	static matrix4RotateZByRadianForPoint(radian, centerPoint) {
		if (centerPoint.equalsWithPoint(Ven$Vector2.ORIGIN)) {
			return Ven$Matrix4.matrix4RotateZByRadian(radian)
		}
		return Ven$Matrix4.createTranslateMatrix4ByCoordinate(-centerPoint.x, -centerPoint.y, 0)
			.rotateZByRadian(radian)
			.translateByVector3(centerPoint.x, centerPoint.y, 0)
	}

	static getMatrix4(startTranslate, endTranslate, radian, scaleX) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		const x = scaleX * (startTranslate.x * cos - startTranslate.y * sin) + endTranslate.x
		const y = startTranslate.x * sin + startTranslate.y * cos + endTranslate.y
		const data = [scaleX * cos, sin, 0, 0, -sin * scaleX, cos, 0, 0, 0, 0, 1, 0, x, y, 0, 1]
		return new Ven$Matrix4(data)
	}

	constructor(data = [...VEN$MATRIX4_ORIGIN_DATA]) {
		super(4, 4, data)
	}

	multiply4(matrix4) {
		return new Ven$Matrix4(Ven$Matrix.matrixMul(4, 4, 4, 4, this.data, matrix4.data))
	}

	/**
	 * 平移变换
	 */
	translateByVector3(vector3) {
		return this.multiply4(Ven$Matrix4.createTranslateMatrix4ByCoordinate(vector3.x, vector3.y, vector3.z))
	}

	/**
	 * 绕轴旋转变换
	 */
	rotateXByRadian(radian) {
		return this.multiply4(Ven$Matrix4.createRotateXMatrix4ByRadian(radian))
	}
	rotateYByRadian(radian) {
		return this.multiply4(Ven$Matrix4.createRotateYMatrix4ByRadian(radian))
	}
	rotateZByRadian(radian) {
		return this.multiply4(Ven$Matrix4.createRotateZMatrix4ByRadian(radian))
	}

	/**
	 * 缩放变换
	 */
	scaleByVector3(vector3) {
		return this.multiply4(Ven$Matrix4.createScaleMatrix4ByCoordinate(vector3.x, vector3.y, vector3.z))
	}

	setOriginByVector3(vector3) {
		return Ven$Matrix4.createTranslateMatrix4ByCoordinate(-vector3.x, -vector3.y, -vector3.z)
			.multiply4(this)
			.multiply4(Ven$Matrix4.createTranslateMatrix4ByCoordinate(vector3.x, vector3.y, vector3.z))
	}

	toMatrix3() {
		return new Ven$Matrix3([this.data[0], this.data[1], 0, this.data[4], this.data[5], 0, this.data[12], this.data[13], 1])
	}

	resetBy(matrix4) {
		for (let i = 0; i < matrix4.data.length; i++) {
			this.data[i] = matrix4.data[i]
		}
	}

	/**
	 * 矩阵转置
	 */
	transpose() {
		return new Ven$Matrix4(super.transpose().data)
	}

	/**
	 * 计算当前矩阵(满足条件时)的逆矩阵
	 */
	getInverseMatrix() {
		return new Ven$Matrix4(super.getInverseMatrix().data)
	}
}
