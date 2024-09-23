function setMessageTimeoutTest() {
	let a = performance.now()
	window.setMessageTimeout(() => {
		let b = performance.now()
		console.log(`-> polyfill.level 01`, b - a)
		window.setMessageTimeout(() => {
			let c = performance.now()
			console.log(`-> polyfill.level 02`, c - b)
			window.setMessageTimeout(() => {
				let d = performance.now()
				console.log(`-> polyfill.level 03`, d - c)
				window.setMessageTimeout(() => {
					let e = performance.now()
					console.log(`-> polyfill.level 04`, e - d)
					window.setMessageTimeout(() => {
						let f = performance.now()
						console.log(`-> polyfill.level 05`, f - e)
						window.setMessageTimeout(() => {
							let g = performance.now()
							console.log(`-> polyfill.level 06`, g - f)
							window.setMessageTimeout(() => {
								let h = performance.now()
								console.log(`-> polyfill.level 07`, h - g)
								window.setMessageTimeout(() => {
									let i = performance.now()
									console.log(`-> polyfill.level 08`, i - h)
									window.setMessageTimeout(() => {
										let j = performance.now()
										console.log(`-> polyfill.level 09`, j - i)
										window.setMessageTimeout(() => {
											let k = performance.now()
											console.log(`-> polyfill.level 10`, k - j)
										}, 0)
									}, 0)
								}, 0)
							}, 0)
						}, 0)
					}, 0)
				}, 0)
			}, 0)
		}, 0)
	}, 0)
}
