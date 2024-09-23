class Ven$Vector {
	static hypot(deltaX, deltaY) {
		let xs = Math.abs(deltaX)
		let ys = Math.abs(deltaY)
		if (ys > xs) {
			const swap = ys
			ys = xs
			xs = swap
		}
		if (xs === 0) {
			return ys
		}
		const t = ys / xs
		return xs * Math.sqrt(1 + t * t)
	}

	static distance(x1, y1, x2, y2) {
		return this.hypot(x2 - x1, y2 - y1)
	}

	constructor() {
		/* ... */
	}
}
