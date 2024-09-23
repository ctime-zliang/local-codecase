class AsyncAnimator {
	constructor(duration, update, easing) {
		this._duration = duration
		this._update = update
		this._easing = easing
	}

	animate(startTime = 0) {
		const duration = this._duration
		const update = this._update
		const easing = this._easing
		let startTime2 = startTime || 0
		return new Promise((resolve, reject) => {
			let qId = 0
			const step = timestamp => {
				startTime2 = startTime2 || timestamp
				const p = Math.min(1.0, (timestamp - startTime2) / duration)
				update.call(self, easing ? easing(p) : p, p)
				if (p < 1.0) {
					qId = requestAnimationFrame(step)
				} else {
					resolve(startTime2 + duration)
				}
			}
			self.cancel = function () {
				cancelAnimationFrame(qId)
				update.call(self, 0, 0)
				resolve(startTime2 + duration)
			}
			qId = requestAnimationFrame(step)
		})
	}

	ease(easing) {
		return new AsyncAnimator(this.duration, this.update, easing)
	}
}
