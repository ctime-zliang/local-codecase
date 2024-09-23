function main() {
	// FileReaders.init()

	// InputFilter.init()

	ComplexTasks.elementUpdation.init(document.getElementById('appContainer'), 100)
	let prev = performance.now()
	const fn1 = now => {
		const dist = now - prev
		ComplexTasks.elementUpdation.update(dist)
		window.requestAnimationFrame(fn1)
		prev = now
	}
	fn1()
}

window.addEventListener('DOMContentLoaded', function (e) {
	main()
})
