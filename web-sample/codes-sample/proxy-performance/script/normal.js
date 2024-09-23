function normalTest() {
	const data = {
		num: 0,
	}
	let lastResult = 0
	console.time('Normal')
	for (let index = 0; index < LOOP_COUNT; index++) {
		lastResult += data.a
		data.a = index
	}
	console.timeEnd('Normal')
	console.log(`Normal: ${data.a}`)
}
