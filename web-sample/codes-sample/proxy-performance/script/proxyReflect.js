function proxyReflectTest() {
	const data = {
		num: 0,
	}
	const handle = {
		get(targetObject, prop, receiver) {
			return Reflect.get(targetObject, prop)
		},
		set(targetObject, prop, value) {
			return Reflect.set(targetObject, prop, value)
		},
	}
	const dataProxy = new Proxy(data, handle)
	let lastResult = 0
	console.time('ProxyReflect')
	for (let index = 0; index < LOOP_COUNT; index++) {
		lastResult += dataProxy.a
		dataProxy.a = index
	}
	console.timeEnd('ProxyReflect')
	console.log(`ProxyReflect: ${dataProxy.a}`)
}
