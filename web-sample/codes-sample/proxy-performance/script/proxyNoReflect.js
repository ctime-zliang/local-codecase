function proxyNoReflectTest() {
	const data = {
		num: 0,
	}
	const handle = {
		get(targetObject, prop, receiver) {
			return targetObject[prop]
		},
		set(targetObject, prop, value) {
			return (targetObject[prop] = value)
		},
	}
	const dataProxy = new Proxy(data, handle)
	let lastResult = 0
	console.time('ProxyNoReflect')
	for (let index = 0; index < LOOP_COUNT; index++) {
		lastResult += dataProxy.a
		dataProxy.a = index
	}
	console.timeEnd('ProxyNoReflect')
	console.log(`ProxyNoReflect: ${dataProxy.a}`)
}
