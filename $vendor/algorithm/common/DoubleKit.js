class Ven$DoubleKit {
	static eps = 1e-8
	static precision = 1e8

	static regular(dis = 0) {
		return Math.round(dis * this.precision) / this.precision
	}

	static eq(a, b) {
		return Math.abs(a - b) <= this.eps
	}

	static neq(a, b) {
		return Math.abs(a - b) > this.eps
	}

	static less(a, b) {
		return a - b < -this.eps
	}

	static lesseq(a, b) {
		return a - b < this.eps
	}

	static greater(a, b) {
		return a - b > this.eps
	}

	static greatereq(a, b) {
		return a - b > -this.eps
	}

	static sqrt(dis) {
		if (Math.abs(dis) <= 1e-10) {
			return 0
		}
		return Math.sqrt(dis)
	}

	static sortAsc(a, b) {
		return a - b
	}

	static sortDesc(a, b) {
		return b - a
	}
}
