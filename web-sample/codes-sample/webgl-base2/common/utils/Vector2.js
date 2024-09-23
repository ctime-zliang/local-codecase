/**
 * 向量 A(ax, ay) 和 向量 B(bx, by)
 *      叉乘
 *           = ax * by - bx * ay
 *           = |a| * |b| * sin(θ)
 *      点乘
 *          = ax * bx + ay * by
 *          = |a| * |b| * cos(θ)
 */

class Vector2 {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	get length() {
		return Math.hypot(this.x, this.y)
	}

	get dir() {
		return Math.atan2(this.y, this.x)
	}

	get dirDeg() {
		return Math.atan2(this.y, this.x) * (180 / Math.PI)
	}

	copy() {
		return new Vector2(this.x, this.y)
	}

	add(v) {
		this.x += v.x
		this.y += v.y
		return this
	}

	sub(v) {
		this.x -= v.x
		this.y -= v.y
		return this
	}

	scale(a) {
		this.x *= a
		this.y *= a
		return this
	}

	cross(v) {
		return this.x * v.y - v.x * this.y
	}

	dot(v) {
		return this.x * v.x + v.y * this.y
	}

	normalize() {
		return this.scale(1 / this.length)
	}

	/**
	 * 将向量 v0(x0, y0) 旋转 θ 角度后
	 * 		x = x0 * cos(θ) - y0 * sin(θ)
	 * 		y = x0 * sin(θ) + x0 * cos(θ)
	 */
	rotate(rad) {
		const c = Math.cos(rad)
		const s = Math.sin(rad)
		const [x, y] = [this.x, this.y]
		this.x = x * c + y * -s
		this.y = x * s + y * c
		return this
	}
}
