function getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const REQUEST_TIMEOUT = 3000

async function asyncFetch() {
	const delay = getRandomInArea(2500, 6000)
	return new Promise((resolve, reject) => {
		window.setTimeout(() => {
			if (delay > REQUEST_TIMEOUT) {
				reject('failer')
				return
			}
			resolve('done.')
		}, delay)
	})
}

const asyncTimeoutHandler = new Ven$AsyncTimeout(3, REQUEST_TIMEOUT)
asyncTimeoutHandler.setEveryOperateListener((attempt, error, maxRetries, timeout, delay) => {
	let message = `第 ${attempt + 1}/${maxRetries} 次执行任务等待耗时已大于设置的超时时间 ${timeout} ms`
	if (attempt + 1 >= maxRetries) {
		message += `, 操作即将退出.`
	} else {
		message += `, 将在 ${delay}ms 后再次尝试执行.`
	}
	console.log(message)
	console.warn(error)
})
asyncTimeoutHandler.setTaskStartListener((timeSamp, maxRetries, timeout, delay) => {
	console.log(`Async task start...`, timeSamp)
})
asyncTimeoutHandler.setTaskFinishListener((timeSamp, maxRetries, timeout, delay) => {
	console.log(`Async task finish...`, timeSamp)
})

asyncTimeoutHandler
	.exec(asyncFetch)
	.then(res => {
		console.log(res)
	})
	.catch(err => {
		console.error(err)
	})
