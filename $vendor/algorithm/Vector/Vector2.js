const VEN$VECTOR2_ORIGIN_DATA = [0, 0]

class Ven$Vector2 extends Ven$Vector {
	static ORIGIN = new Ven$Vector2()
	static X_INIT_UNIT_VERCTOR2 = new Ven$Vector2(1, 0)
	static Y_INIT_UNIT_VERCTOR2 = new Ven$Vector2(0, 1)

	/**
	 * 计算某个初始弧度在经过特定矩阵变换后的弧度
	 */
	static caculateAngle(radian, matrix4) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		const x = cos * matrix4.data[0] + sin * matrix4.data[4]
		const y = cos * matrix4.data[1] + sin * matrix4.data[5]
		const vector2 = new Ven$Vector2(x, y).normalize()
		return Math.atan2(vector2.x, vector2.y)
	}

	/**
	 * 计算某个弧度的单位向量
	 */
	static getInitVector2ByRadian(radian) {
		return new Ven$Vector2(Math.cos(radian), Math.sin(radian))
	}

	constructor(x = VEN$VECTOR2_ORIGIN_DATA[0], y = VEN$VECTOR2_ORIGIN_DATA[1]) {
		super()
		this._x = x
		this._y = y
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

	/**
	 * 向量长度
	 */
	get length() {
		return Math.hypot(this.x, this.y)
	}

	/**
	 * 向量弧度方向
	 */
	get dir() {
		return Math.atan2(this.y, this.x)
	}

	/**
	 * 向量角度方向
	 */
	get dirDeg() {
		return Math.atan2(this.y, this.x) * (180 / Math.PI)
	}

	/**
	 * 向量副本
	 */
	copy() {
		return new Ven$Vector2(this.x, this.y)
	}

	/**
	 * 向量与向量相加
	 */
	add(vector2) {
		return new Ven$Vector2(this.x + vector2.x, this.y + vector2.y)
	}

	/**
	 * 向量与标量相加
	 */
	addScalar(x, y) {
		return new Ven$Vector2(this.x + x, this.y + y)
	}

	/**
	 * 向量与向量相减
	 */
	sub(vector2) {
		return new Ven$Vector2(this.x - vector2.x, this.y - vector2.y)
	}

	/**
	 * 向量与标量相减
	 */
	subScalar(x, y) {
		return new Ven$Vector2(this.x - x, this.y - y)
	}

	/**
	 * 向量缩放
	 */
	scale(x = 0, y = 0) {
		return new Ven$Vector2(this.x * x, this.y * y)
	}

	/**
	 * 向量与标量的乘积
	 */
	mul(x = 0, y = 0) {
		return this.scale(x, y)
	}

	/**
	 * 向量与向量叉乘
	 */
	cross(vector2) {
		return this.x * vector2.y - vector2.x * this.y
	}

	/**
	 * 向量与向量点乘
	 */
	dot(vector2) {
		return this.x * vector2.x + this.y * vector2.y
	}

	/**
	 * 向量 sin 值
	 */
	getSin() {
		return this.y / this.length
	}

	/**
	 * 向量 cos 值
	 */
	getCos() {
		return this.x / this.length
	}

	/**
	 * 该向量的终点的 bbox2
	 */
	getEndDotBbbox2() {
		return new Ven$BBox2(this.x, this.x, this.y, this.y)
	}

	/**
	 * 设当前向量为 B, 输入向量 A, 计算 AB 向量的弧度
	 */
	agnleOfTowVector(vector2) {
		return Math.atan2(this.y - vector2.y, this.x - vector2.x)
	}

	/**
	 * 设当前向量为 B, 输入向量 A, 计算 AB 向量与 X 轴正向的弧度
	 */
	agnleXOfTowVector(vector2) {
		let radian = this.agnleOfTowVector(vector2)
		if (radian < 0) {
			radian = Math.PI * 2 + radian
		}
		return radian
	}

	/**
	 * 计算当前点与输入点 P(vector2) 的距离
	 * 		向量与向量 vector2 的距离
	 */
	distance(vector2) {
		const deltaX = vector2.x - this._x
		const deltaY = vector2.y - this._y
		return Ven$Vector.hypot(deltaX, deltaY)
	}

	/**
	 * 向量旋转 - 绕起点旋转 radian(弧度) 后的结果向量
	 * 		将向量 v0(x0, y0) 旋转 θ 角度后
	 * 			x = x0 * cos(θ) - y0 * sin(θ)
	 * 			y = x0 * sin(θ) + x0 * cos(θ)
	 */
	rotate(radian) {
		const c = Math.cos(radian)
		const s = Math.sin(radian)
		const [x, y] = [this.x, this.y]
		return new Ven$Vector2(x * c + y * -s, x * s + y * c)
	}

	/**
	 * 向量旋转 - 绕向量外定点旋转 radian(弧度) 后的结果向量
	 */
	rotateSurround(center2, radian) {
		const cos = Math.cos(radian)
		const sin = Math.sin(radian)
		const dx = this.x - center2.x
		const dy = this.y - center2.y
		return new Ven$Vector2(dx * cos + dy * -sin, dx * sin + dy * cos)
	}

	/**
	 * 向量关于 origin2 坐标点的中心对称向量
	 */
	mirrorSurround(origin2 = Ven$Vector2.ORIGIN) {
		return new Ven$Vector2(2 * origin2.x, 2 * origin2.y - this.y)
	}

	/**
	 * 向量关于 origin2 坐标点的 x 坐标值的 X 轴镜像
	 */
	mirrorSurroundX(origin2 = Ven$Vector2.ORIGIN) {
		return new Ven$Vector2(this.x, 2 * origin2.y - this.y)
	}

	/**
	 * 向量关于 origin2 坐标点的 y 坐标值的 Y 轴镜像
	 */
	mirrorSurroundY(origin2 = Ven$Vector2.ORIGIN) {
		return new Ven$Vector2(2 * origin2.x - this.x, this.y)
	}

	/**
	 * 应用 matrix3
	 */
	multiplyMatrix3(matrix3) {
		const x = this.x * matrix3.data[0] + this.y * matrix3.data[3] + matrix3.data[6]
		const y = this.x * matrix3.data[1] + this.y * matrix3.data[4] + matrix3.data[7]
		return new Ven$Vector2(x, y)
	}

	/**
	 * 应用 matrix4
	 */
	multiplyMatrix4(matrix4) {
		const x = this.x * matrix4.data[0] + this.y * matrix4.data[4] + matrix4.data[12]
		const y = this.x * matrix4.data[1] + this.y * matrix4.data[5] + matrix4.data[13]
		return new Ven$Vector2(x, y)
	}

	toString() {
		return `Vector2 (${this.x}, ${this.y})`
	}

	toJSON() {
		return {
			x: this._x,
			y: this._y,
		}
	}

	/**
	 * 向量的单位向量
	 */
	normalize() {
		if (this.x === 0 && this.y === 0) {
			return new Ven$Vector2(0, 0)
		}
		const sx = this.x / this.length
		const sy = this.y / this.length
		return new Ven$Vector2(sx, sy)
	}

	/**
	 * 判断当前向量与输入向量是否相等
	 */
	equalsWithVector2(vector2, place = 0) {
		if (vector2 instanceof Ven$Vector2) {
			return Ven$Decimals.equalsFloat(vector2.x, this.x, place) && Ven$Decimals.equalsFloat(vector2.y, this.y, place)
		}
		return false
	}

	/**
	 * 判断当前坐标点与输入坐标点是否相等
	 */
	equalsWithPoint(p) {
		return Ven$DoubleKit.eq(this.x, p.x) && Ven$DoubleKit.eq(this.y, p.y)
	}
}
