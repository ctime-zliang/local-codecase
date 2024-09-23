class Ven$AsyncTimeout {
	constructor(maxRetries = 3, timeout = 5000, delay = 500) {
		this._everyOperateListener = null
		this._taskStartListener = null
		this._taskFinishListener = null
		this._maxRetries = maxRetries
		this._timeout = timeout
		this._delay = delay
	}

	setEveryOperateListener(fn) {
		this._everyOperateListener = fn
		return this
	}
	setTaskStartListener(fn) {
		this._taskStartListener = fn
		return this
	}
	setTaskFinishListener(fn) {
		this._taskFinishListener = fn
		return this
	}

	async exec(fn) {
		let attempt = 0
		this._taskStartListener && this._taskStartListener(new Date().getTime(), this._maxRetries, this._timeout, this._delay)
		while (attempt < this._maxRetries) {
			try {
				const result = await Promise.race([
					fn(),
					this._timeoutController().then(() => {
						throw new Error('[delay controller] async task timeout...')
					}),
				])
				this._taskFinishListener && this._taskFinishListener(new Date().getTime(), this._maxRetries, this._timeout, this._delay)
				return result
			} catch (error) {
				this._everyOperateListener && this._everyOperateListener(attempt, error, this._maxRetries, this._timeout, this._delay)
				attempt++
				if (attempt === this._maxRetries) {
					throw error
				}
				await this._delayController()
			}
		}
	}

	async _delayController() {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				resolve(null)
			}, this._delay)
		})
	}

	async _timeoutController() {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				resolve(null)
			}, this._timeout)
		})
	}
}
