// prettier-ignore
const VEN$MATRIX3_ORIGIN_DATA = [
	1, 0, 0, 
	0, 1, 0, 
	0, 0, 1
]

class Ven$Matrix3 extends Ven$Matrix {
	static ORIGIN = new Ven$Matrix3()

	/**
	 * 平移矩阵(坐标)
	 */
	static createTranslateMatrix3ByCoordinate(x, y) {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			1, 0, x,
		 * 			0, 1, y,
		 * 			0, 0, 1
		 *		]
		 */
		// prettier-ignore
		return new Ven$Matrix3(
			// prettier-ignore
			[
				1, 0, 0, 
				0, 1, 0, 
				x, y, 1
			]
		)
	}

	/**
	 * 旋转矩阵(弧度)
	 */
	static createRotateZMatrix3ByRadian(radian) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			cos, -sin, 0,
		 * 			sin, cos,  0,
		 * 			0,   0,    1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix3(
			// prettier-ignore
			[
				cos,  sin, 0, 
				-sin, cos, 0, 
				0,    0,   1
			]
		)
	}

	/**
	 * 缩放矩阵(比例)
	 */
	static createScaleMatrix3ByRatio(ratio) {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			ratio, 0,     0,
		 * 			0,     ratio, 0,
		 * 			0,     0,     1
		 * 		]
		 */
		// prettier-ignore
		return new Ven$Matrix3(
			// prettier-ignore
			[
				ratio, 0,     0, 
				0,     ratio, 0, 
				0,     0,     1
			]
		)
	}

	/**
	 * 缩放矩阵(坐标)
	 */
	static createScaleMatrix3ByCoordinate(x, y) {
		// prettier-ignore
		/**
		 * 转置前
		 * 		[
		 * 			x, 0, 0,
		 * 			0, y, 0,
		 * 			0, 0, 1
		 * 		]
		 */
		return new Ven$Matrix3(
			// prettier-ignore
			[
				x, 0, 0, 
				0, y, 0, 
				0, 0, 1
			]
		)
	}

	constructor(data = [...VEN$MATRIX3_ORIGIN_DATA]) {
		super(3, 3, data)
		const a = this.data[0]
		const b = this.data[3]
		const d = this.data[1]
		const e = this.data[4]
		this._iScale = Math.sqrt(a * a + d * d)
		this._jScale = Math.sqrt(b * b + e * e)
	}

	get iScale() {
		return this._iScale
	}

	get jScale() {
		return this._jScale
	}

	multiply3(matrix3) {
		return new Ven$Matrix3(Ven$Matrix.matrixMul(3, 3, 3, 3, this.data, matrix3.data))
	}

	/**
	 * 平移变换
	 */
	translateByVector2(vector2) {
		return this.multiply3(Ven$Matrix3.createTranslateMatrix3ByCoordinate(vector2.x, vector2.y))
	}

	/**
	 * 绕轴旋转变换
	 */
	rotateZByRadian(radian) {
		return this.multiply3(Ven$Matrix3.createRotateZMatrix3ByRadian(radian))
	}

	/**
	 * 缩放变换
	 */
	scaleByRatio(ratio) {
		return this.multiply3(Ven$Matrix3.createScaleMatrix3ByRatio(ratio))
	}
	scaleByVector2(vector2) {
		return this.multiply3(Ven$Matrix3.createScaleMatrix3ByCoordinate(vector2.x, vector2.y))
	}

	det() {
		return this.data[0] * this.data[4] - this.data[3] * this.data[1]
	}

	isMirrored() {
		return this.det() < 0
	}

	resetBy(matrix3) {
		for (let i = 0; i < matrix3.data.length; i++) {
			this.data[i] = matrix3.data[i]
		}
	}

	/**
	 * 矩阵转置
	 */
	transpose() {
		return new Ven$Matrix3(super.transpose().data)
	}

	/**
	 * 计算当前矩阵(满足条件时)的逆矩阵
	 */
	getInverseMatrix() {
		return new Ven$Matrix3(super.getInverseMatrix().data)
	}
}
