function setTimeoutTest() {
	let a = performance.now()
	window.setTimeout(() => {
		let b = performance.now()
		console.log(`native.level 01`, b - a)
		window.setTimeout(() => {
			let c = performance.now()
			console.log(`native.level 02`, c - b)
			window.setTimeout(() => {
				let d = performance.now()
				console.log(`native.level 03`, d - c)
				window.setTimeout(() => {
					let e = performance.now()
					console.log(`native.level 04`, e - d)
					window.setTimeout(() => {
						let f = performance.now()
						console.log(`native.level 05`, f - e)
						window.setTimeout(() => {
							let g = performance.now()
							console.log(`native.level 06`, g - f)
							window.setTimeout(() => {
								let h = performance.now()
								console.log(`native.level 07`, h - g)
								window.setTimeout(() => {
									let i = performance.now()
									console.log(`native.level 08`, i - h)
									window.setTimeout(() => {
										let j = performance.now()
										console.log(`native.level 09`, j - i)
										window.setTimeout(() => {
											let k = performance.now()
											console.log(`native.level 10`, k - j)
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
