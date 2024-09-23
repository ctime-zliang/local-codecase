function receiveMessageHandler(e) {
	const { data } = e
	const now = new Date().getTime()
	// console.log(now - data.startTimer)
	// if (data.buffer) {
	//     const int32 = new Int32Array(data.buffer)
	//     int32[0] = 1
	//     int32[1] = 1
	// }
	if (data) {
		const int32 = new Int32Array(data)
		int32[0] = 1
		int32[1] = 1
	}
	console.log(`message.recevier`, e.data)
	console.log(`\n`)
}

self.addEventListener('message', receiveMessageHandler)
