class Ven$Rtree_Rectangle {
	static overlapRectangle(rectA, rectB) {
		if ((rectA.h === 0 && rectA.w === 0) || (rectB.h === 0 && rectB.w === 0)) {
			return (
				rectA.sx <= rectB.sx + rectB.w && rectA.sx + rectA.w >= rectB.sx && rectA.sy <= rectB.sy + rectB.h && rectA.sy + rectA.h >= rectB.sy
			)
		}
		return rectA.sx < rectB.sx + rectB.w && rectA.sx + rectA.w > rectB.sx && rectA.sy < rectB.sy + rectB.h && rectA.sy + rectA.h > rectB.sy
	}

	/**
	 * 判断 rectA 是否包含于 rectB 中
	 */
	static containsRectangle(rectA, rectB) {
		return rectA.sx + rectA.w <= rectB.sx + rectB.w && rectA.sx >= rectB.sx && rectA.sy + rectA.h <= rectB.sy + rectB.h && rectA.sy >= rectB.sy
	}

	/**
	 * 读取 referenceRect 的尺寸数据来修改 expandRect 的尺寸数据
	 * 使得 expandRect 占用范围能够"覆盖" referenceRect
	 *
	 * expandRect - 待扩展的矩形
	 * referenceRect - 被覆盖的矩形
	 */
	static expandRectangle(expandRect, referenceRect) {
		let nx = Math.min(expandRect.sx, referenceRect.sx)
		let ny = Math.min(expandRect.sy, referenceRect.sy)
		expandRect.w = Math.max(expandRect.sx + expandRect.w, referenceRect.sx + referenceRect.w) - nx
		expandRect.h = Math.max(expandRect.sy + expandRect.h, referenceRect.sy + referenceRect.h) - ny
		expandRect.sx = nx
		expandRect.sy = ny
		return expandRect
	}

	/**
	 * 读取 nodes 中各项的矩形尺寸, 重新修改 expandRect 的矩形尺寸
	 * 以使得 expandRect 能够包含所有 nodes[i]
	 */
	static makeMBR(expandRect, nodes) {
		if (!nodes.length || !expandRect) {
			return {
				sx: 0,
				sy: 0,
				w: 0,
				h: 0,
			}
		}
		expandRect.sx = nodes[0].sx
		expandRect.sy = nodes[0].sy
		expandRect.w = nodes[0].w
		expandRect.h = nodes[0].h
		for (let i = 1; i < nodes.length; i++) {
			Ven$Rtree_Rectangle.expandRectangle(expandRect, nodes[i])
		}
		return expandRect
	}

	static squarifiedRatio(l, w, fill) {
		// const lperi = (l + w) / 2
		// const larea = l * w
		// const lgeo = larea / (lperi * lperi)
		// return (larea * fill) / lgeo
		const a = (l + w) / 2
		return a * a * fill
	}

	constructor(sx, sy, w, h) {
		this._sx = 0
		this._sy = 0
		this._w = 0
		this._h = 0
		this._ex = 0
		this._ey = 0
		this._p = false
		this.reset(sx, sy, w, h)
	}

	get sx() {
		return this._sx
	}
	set sx(value) {
		this._sx = value
	}

	get sy() {
		return this._sy
	}
	set sy(value) {
		this._sy = value
	}

	get ex() {
		return this._ex
	}
	set ex(value) {
		this._ex = value
	}

	get ey() {
		return this._ey
	}
	set ey(value) {
		this._ey = value
	}

	get p() {
		return this._p
	}
	set p(value) {
		this._p = value
	}

	get w() {
		return this._w
	}
	set w(value) {
		this._w = value
	}

	get h() {
		return this._h
	}
	set h(value) {
		this._h = value
	}

	reset(sx, sy, w, h) {
		this._sx = sx
		this._sy = sy
		this._w = w
		this._h = h
		this._ex = this._sx + this._w
		this._ey = this._sy + this._h
		this._p = this._w + this._h ? false : true
	}

	overlap(rect) {
		if (this.p || rect.p) {
			return this.sx <= rect.ex && this.ex >= rect.sx && this.sy <= rect.ey && this.ey >= rect.sy
		}
		return this.sx < rect.ex && this.ex > rect.sx && this.sy < rect.ey && this.ey > rect.sy
	}

	expand(rect) {
		let nx = 0
		let ny = 0
		let sx = 0
		let sy = 0
		let w = 0
		let h = 0
		if (this.sx > rect.sx) {
			nx = rect.sx
		} else {
			nx = this.sx
		}
		if (this.sy > rect.sy) {
			ny = rect.sy
		} else {
			ny = this.sy
		}
		if (this.ex > rect.ex) {
			w = this.ex - nx
		} else {
			w = rect.ex - nx
		}
		if (this.ey > rect.ey) {
			h = this.ey - ny
		} else {
			h = rect.ey - ny
		}
		sx = nx
		sx = ny
		this.reset(sx, sy, w, h)
		return this
	}
}
