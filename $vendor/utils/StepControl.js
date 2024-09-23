class Ven$StepControl {
	constructor(initialValue, stepSize, maxValue = Number.MAX_SAFE_INTEGER) {
		this._initialValue = initialValue
		this._setValue = initialValue
		this._stepSize = stepSize
		this._maxValue = maxValue
		this._lastTimeStamp = performance.now()
	}

	updateLastStamp() {
		this._lastTimeStamp = performance.now()
	}

	getNextValue() {
		const now = performance.now()
		const elapsed = now - this._lastTimeStamp
		this._lastTimeStamp = now
		this._setValue = this._setValue + (this._stepSize * elapsed) / 1000.0
		if (this._setValue > this._maxValue) {
			this._setValue = this._initialValue
		}
		return this._setValue
	}
}
