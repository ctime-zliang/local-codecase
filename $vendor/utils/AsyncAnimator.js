class Ven$AsyncAnimator {
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
				const progress = Math.min(1.0, (timestamp - startTime2) / duration)
				update.call(this, easing ? easing(progress) : progress, progress)
				if (progress < 1.0) {
					qId = window.requestAnimationFrame(step)
				} else {
					resolve(startTime2 + duration)
				}
			}
			this.cancel = () => {
				window.cancelAnimationFrame(qId)
				update.call(this, 0, 0)
				resolve(startTime2 + duration)
			}
			qId = window.requestAnimationFrame(step)
		})
	}

	ease(easing) {
		return new AsyncAnimator(this.duration, this.update, easing)
	}
}
