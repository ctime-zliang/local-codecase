class ConcurrencyTaskQueue {
	constructor(windowSize = 5) {
		/**
		 * 当前正在进行的任务个数
		 */
		this._runingCount = 0
		/**
		 * 已读取到的任务总个数
		 */
		this._handleCount = 0
		this._queue = []
		this._results = []
		this._windowSize = windowSize
		this._finishCallback = null
		this._taskStartCallback = null
		this._taskEndCallback = null
	}

	pushTask(taskItem) {
		this._queue.push(taskItem)
	}

	setFinishCallback(callback) {
		this._finishCallback = callback
	}

	setTaskStartCallback(callback) {
		this._taskStartCallback = callback
	}

	setTaskEndCallback(callback) {
		this._taskEndCallback = callback
	}

	next() {
		while (this._runingCount < this._windowSize && this._queue.length > 0) {
			this._runingCount += 1
			this._handleCount += 1
			const taskIndex = this._handleCount - 1
			const taskItem = this._queue.shift()
			this._taskStartCallback && this._taskStartCallback(taskIndex)
			taskItem(taskIndex)
				.then(result => {
					this._results.push(result)
				})
				.catch(result => {
					this._results.push(result)
				})
				.finally(() => {
					this._runingCount -= 1
					this._taskEndCallback && this._taskEndCallback(this._results[this._results.length - 1])
					this.next()
				})
		}
		if (this._runingCount <= 0) {
			this._finishCallback && this._finishCallback(this._results)
		}
	}
}

const getRandomInArea = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const delay = (delayTime, taskIndex) => {
	return new Promise((res, rej) => {
		window.setTimeout(() => {
			const rdm = Math.random()
			if (rdm >= 0.5) {
				res({ type: 'resolved', data: { time: delayTime, random: rdm, taskIndex } })
				return
			}
			rej({ type: 'rejected', data: { time: delayTime, random: rdm, taskIndex } })
		}, delayTime)
	})
}

function main() {
	const ctq = new ConcurrencyTaskQueue(5)
	const TASK_SIZE = 20
	for (let i = 0; i < TASK_SIZE; i++) {
		const delayTime = getRandomInArea(1000, 5000)
		const taskItem = taskIndex => {
			return delay(delayTime, taskIndex)
		}
		ctq.pushTask(taskItem)
	}
	ctq.setTaskStartCallback(taskIndex => {
		console.log(`${taskIndex} 单次任务启动...`)
	})
	ctq.setTaskEndCallback(result => {
		console.log(`单次任务结束...`, result)
	})
	ctq.setFinishCallback(results => {
		console.log(`任务结束...`, results)
	})
	ctq.next()
}

window.document.addEventListener('DOMContentLoaded', () => {
	main()
})
