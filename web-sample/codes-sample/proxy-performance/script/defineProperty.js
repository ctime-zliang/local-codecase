function definePropertyTest() {
	const data = {
		num: 0,
	}
	let getResult = data.a
	Object.defineProperty(data, 'a', {
		get() {
			return getResult
		},
		set(value) {
			getResult = value
		},
	})
	let lastResult = 0
	console.time('DefineProperty')
	for (let index = 0; index < LOOP_COUNT; index++) {
		lastResult += data.a
		data.a = index
	}
	console.timeEnd('DefineProperty')
	console.log(`DefineProperty: ${data.a}`)
}
