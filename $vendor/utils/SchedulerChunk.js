class Ven$SchedulerChunk {
	static broswerSchedulerChunk(taskSize, taskHandler) {
		const scheduler = task => {
			const start = performance.now()
			window.setTimeout(() => {
				task(() => {
					return performance.now() - start < 1000 / 60
				})
			}, 1)
		}
		return new Ven$SchedulerChunk(taskSize, taskHandler, scheduler)
	}

	static broswerSchedulerChunk2(taskSize, taskHandler) {
		const scheduler = task => {
			const start = performance.now()
			window.requestAnimationFrame(timeStamp => {
				task(() => {
					return performance.now() - start < 1000 / 60
				})
			})
		}
		return new Ven$SchedulerChunk(taskSize, taskHandler, scheduler)
	}

	static broswerSchedulerChunk3(taskSize, taskHandler) {
		const scheduler = task => {
			window.requestIdleCallback(
				idle => {
					task(() => {
						// return idle.timeRemaining() || idle.didTimeout
						return idle.timeRemaining()
					})
				},
				{ timeout: 500 }
			)
		}
		return new Ven$SchedulerChunk(taskSize, taskHandler, scheduler)
	}

	constructor(taskSize, taskHandler, scheduler) {
		this._isRuning = false
		/* ... */
		this._taskSize = taskSize
		this._taskHandler = taskHandler
		this._scheduler = scheduler
		this._chunkStartCallback = null
		this._chunkEndCallback = null
		this._finishCallback = null
		/* ... */
		this._chunkCount = 0
	}

	get isRuning() {
		return this._isRuning
	}

	start() {
		if (this._taskSize <= 0 || this._isRuning) {
			return
		}
		this._isRuning = true
		let i = 0
		const run = () => {
			this._chunkStartCallback && this._chunkStartCallback(this._chunkCount, i)
			++this._chunkCount
			if (i >= this._taskSize) {
				this._chunkEndCallback && this._chunkEndCallback(this._chunkCount - 1, i)
				this._finishCallback && this._finishCallback()
				this._isRuning = false
				return
			}
			const task = goOn => {
				while (goOn() && i < this._taskSize) {
					this._taskHandler(i)
					i++
				}
				this._chunkEndCallback && this._chunkEndCallback(this._chunkCount - 1, i)
				run()
			}
			this._scheduler(task)
		}
		run()
	}

	setChunkStartHandler(callback) {
		this._chunkStartCallback = callback
	}

	setChunkEndHandler(callback) {
		this._chunkEndCallback = callback
	}

	setChunkFinishHandler(callback) {
		this._finishCallback = callback
	}
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

class Ven$SchedulerSlice {
	static broswerSchedulerSlice(taskSize, taskHandler) {
		const scheduler = task => {
			window.setTimeout(() => {
				task()
			}, 1)
		}
		return new Ven$SchedulerSlice(taskSize, taskHandler, scheduler)
	}

	static broswerSchedulerSlice2(taskSize, taskHandler) {
		const scheduler = task => {
			window.requestAnimationFrame(timeStamp => {
				task()
			})
		}
		return new Ven$SchedulerSlice(taskSize, taskHandler, scheduler)
	}

	static broswerSchedulerSlice3(taskSize, taskHandler) {
		const scheduler = task => {
			window.requestIdleCallback(
				idle => {
					task()
				},
				{ timeout: 500 }
			)
		}
		return new Ven$SchedulerSlice(taskSize, taskHandler, scheduler)
	}

	constructor(taskSize, taskHandler, scheduler) {
		this._profile = {
			chunkTimeSize: 10,
			isRuning: false,
		}
		/* ... */
		this._taskSize = taskSize
		this._taskHandler = taskHandler
		this._scheduler = scheduler
		this._chunkStartCallback = null
		this._chunkEndCallback = null
		this._finishCallback = null
	}

	get isRuning() {
		return this._profile.isRuning
	}

	start() {
		const chunkHandler = this._createChunkHandler()
		if (this._profile.isRuning) {
			return
		}
		this._profile.isRuning = true
		chunkHandler()
	}

	setChunkStartHandler(callback) {
		this._chunkStartCallback = callback
	}

	setChunkEndHandler(callback) {
		this._chunkEndCallback = callback
	}

	setChunkFinishHandler(callback) {
		this._finishCallback = callback
	}

	_createChunkHandler() {
		const refConfig = { chunkCount: 0, taskIndex: 0 }
		const gen = function* (taskSize, taskHandler) {
			let count = 0
			while (count < taskSize) {
				refConfig.taskIndex = count
				yield taskHandler(count)
				count++
			}
		}
		const { _profile, _taskSize, _scheduler, _taskHandler, _chunkStartCallback, _chunkEndCallback, _finishCallback } = this
		const generator = gen(_taskSize, _taskHandler)
		if (!generator || typeof generator.next !== 'function') {
			return
		}
		return function next() {
			_chunkStartCallback && _chunkStartCallback(refConfig.chunkCount, refConfig.taskIndex)
			refConfig.chunkCount++
			const start = performance.now()
			let generatorResult = null
			do {
				generatorResult = generator.next()
				refConfig.count = generatorResult.value
			} while (generatorResult.done !== true && performance.now() - start < _profile.chunkTimeSize)
			if (generatorResult.done) {
				_chunkEndCallback && _chunkEndCallback(refConfig.chunkCount - 1, refConfig.taskIndex)
				_finishCallback && _finishCallback()
				_profile.isRuning = false
				return
			}
			_chunkEndCallback && _chunkEndCallback(refConfig.chunkCount - 1, refConfig.taskIndex)
			_scheduler(next)
		}
	}
}
