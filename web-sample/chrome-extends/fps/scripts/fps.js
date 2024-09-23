;(() => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 精简纯数字模式
	 * 		2 - 带标题的纯文本模式
	 * 		3 - 带标题的纯文本模式 + 画布图示模式
	 *		4 - 精简纯数字模式 + 画布图示模式
	 */
	const MODES = [0, 1, 2, 3, 4]
	const CANVAS_X_STEP_SIZE = 4
	/**
	 * 画布尺寸
	 */
	const CANVAS_RECT = [120, 40]
	const config = {
		mode: MODES[4],
		pathSize: CANVAS_RECT[0] / CANVAS_X_STEP_SIZE,
		/**
		 * 帧率刷新间隔(ms)
		 */
		interval: 200,
		/**
		 * 帧率告警阈值边界
		 */
		serious: [0, 19],
		warning: [20, 29],
	}
	const CONTAINER_STYLE = `
		display: block;
		position: fixed; 
		top: 2px;
		left: 2px;
		cursor: move;
		line-height: 14px;
		padding: 2px 4px;
		text-align: left;
		opacity: 1;
		white-space: nowrap;
		border: 1px solid rgba(50, 50, 50, 1);
		background-color: rgba(25, 25, 25, 0.85);
		box-shadow: rgba(75, 75, 75, 0.35) 0 0 5px;
		color: #00ee00 !important;
		font-size: 12px !important;
		font-weight: 400 !important;
		box-sizing: border-box !important;
		z-index: 99999999;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		-webkit-transform: translate3d(0, 0, 5px);
		-moz-transform: translate3d(0, 0, 5px);
		transform: translate3d(0, 0, 5px);
	`
	const CONTAINER_HOVER_STYLE = `
		opacity: 0.35 !important;
		background-color: rgba(25, 25, 25, 0) !important;
	`
	const WRAPPER_STYLE = `
		width: fit-content !important;
		min-width: fit-content !important;
		max-width: fit-content !important;
		height: fit-content !important;
		min-height: fit-content !important;
		max-height: fit-content !important;
	`
	const runtimeProfile = {}
	const styleProfile = {
		cssText: `
            ._fps-monitor-container {
                ${CONTAINER_STYLE}
            }
			._fps-monitor-container-hover {
                ${CONTAINER_HOVER_STYLE}
            }
            ._fps-monitor-tips-warning {
                color: #ff6600;
            }
            ._fps-monitor-tips-serious {
                color: #ff0000;
            }
        `,
	}

	const createHtmlString = () => {
		let htmlString = ``
		if (config.mode === MODES[1]) {
			htmlString = `
				<div class="_fps-monitor-container" style="${CONTAINER_STYLE}">
					<div style="${WRAPPER_STYLE}">
						<div data-tagitem="_fps-raf-simplify-count">-</div>
					</div>
				</div>
			`
			return htmlString
		}
		if (config.mode === MODES[2]) {
			htmlString = `
				<div class="_fps-monitor-container" style="${CONTAINER_STYLE}">
					<div style="${WRAPPER_STYLE}">
						<div data-tagitem="_fps-refresh-interval">-</div>
						<div data-tagitem="_fps-raf-count">-</div>
						<div data-tagitem="_fps-raf-count-ratio">-</div>
						<div data-tagitem="_fps-raf-interval-count">-</div>
					</div>
				</section>
			`
			return htmlString
		}
		if (config.mode === MODES[3]) {
			htmlString = `
				<div class="_fps-monitor-container" style="${CONTAINER_STYLE}">
					<div style="${WRAPPER_STYLE}">
						<div style="padding: 2.5px 0 5px 0;">
							<div data-tagitem="_fps-refresh-interval">-</div>
							<div data-tagitem="_fps-raf-count">-</div>
							<div data-tagitem="_fps-raf-count-ratio">-</div>
							<div data-tagitem="_fps-raf-interval-count">-</div>
						</div>
						<canvas 
							width="${CANVAS_RECT[0]}" 
							height="${CANVAS_RECT[1]}" 
							style="width: ${CANVAS_RECT[0]}px; height: ${CANVAS_RECT[1]}px; border: 1px solid rgba(135, 135, 135, 0.9);" 
							data-tagitem="_fps-raf-canvas-view">
						</canvas>
					</div>
				</div>
			`
			return htmlString
		}
		if (config.mode === MODES[4]) {
			htmlString = `
				<div class="_fps-monitor-container" style="${CONTAINER_STYLE}">
					<div style="${WRAPPER_STYLE}">
						<div style="padding: 2.5px 0 5px 0;">
							<div data-tagitem="_fps-raf-simplify-count">-</div>
						</div>
						<canvas 
							width="${CANVAS_RECT[0]}" 
							height="${CANVAS_RECT[1]}" 
							style="width: ${CANVAS_RECT[0]}px; height: ${CANVAS_RECT[1]}px; border: 1px solid rgba(135, 135, 135, 0.9);" 
							data-tagitem="_fps-raf-canvas-view">
						</canvas>
					</div>
				</div>
			`
			return htmlString
		}
		return htmlString
	}

	const initStorage = () => {
		try {
			const _fps_mode = window.localStorage.getItem('_fps_mode')
			if (typeof _fps_mode === 'undefined' || _fps_mode === null || isNaN(+_fps_mode) || !MODES.includes(+_fps_mode)) {
				window.localStorage.setItem('_fps_mode', config.mode)
			} else {
				config.mode = +_fps_mode
			}
		} catch (e) {
			console.warn(e)
			config.mode = MODES[4]
		}
	}

	const initViewStyle = cssText => {
		const styleElement = document.createElement('style')
		const headElement = document.head || document.getElementsByTagName('head')[0]
		let initStyleError = false
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			try {
				styleElement.styleSheet.cssText = cssText
			} catch (e) {
				initStyleError = true
			}
		} else {
			styleElement.appendChild(document.createTextNode(cssText))
		}
		headElement.appendChild(styleElement)
		return initStyleError
	}

	const initViewElement = () => {
		const rootElement = document.body || document.getElementsByTagName('body')[0]
		if (!rootElement) {
			throw new Error('document.body element not found.')
		}
		rootElement.appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initContainerElementHandler = () => {
		runtimeProfile.containerElement = document.querySelector('._fps-monitor-container')
		runtimeProfile.wrapperElement = runtimeProfile.containerElement.firstElementChild
	}

	const initElementHandler = () => {
		if (config.mode === MODES[1]) {
			runtimeProfile.rAFSimplifyCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-simplify-count"]')
		}
		if (config.mode === MODES[2]) {
			runtimeProfile.refreshIntervalElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-refresh-interval"]')
			runtimeProfile.rAFCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-count"]')
			runtimeProfile.rAFCountRatioElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-count-ratio"]')
			runtimeProfile.rAFIntervalCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-interval-count"]')
		}
		if (config.mode === MODES[3]) {
			runtimeProfile.refreshIntervalElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-refresh-interval"]')
			runtimeProfile.rAFCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-count"]')
			runtimeProfile.rAFCountRatioElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-count-ratio"]')
			runtimeProfile.rAFIntervalCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-interval-count"]')
			runtimeProfile.rAFCanvasElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-canvas-view"]')
		}
		if (config.mode === MODES[4]) {
			runtimeProfile.rAFSimplifyCountElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-simplify-count"]')
			runtimeProfile.rAFCanvasElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_fps-raf-canvas-view"]')
		}
	}

	const bindEvent = hostElement => {
		const dot = {}
		const mousedownHandler = evte => {
			dot.isMoudeDown = true
			dot.distX = evte.clientX - hostElement.offsetLeft
			dot.distY = evte.clientY - hostElement.offsetTop
			document.addEventListener('mousemove', mousemoveHandler)
			document.addEventListener('mouseup', mouseupHandler)
		}
		const mousemoveHandler = evte => {
			if (!dot.isMoudeDown) {
				return
			}
			const rect = hostElement.getBoundingClientRect()
			const xa = document.documentElement.clientWidth - rect.width
			const ya = document.documentElement.clienHeight - rect.height
			let moveX = evte.clientX - dot.distX
			let moveY = evte.clientY - dot.distY
			moveX = moveX <= 0 ? 0 : moveX
			moveX = moveX >= xa ? xa : moveX
			moveY = moveY <= 0 ? 0 : moveY
			moveY = moveY >= ya ? ya : moveY
			hostElement.style.left = moveX + 'px'
			hostElement.style.top = moveY + 'px'
		}
		const mouseupHandler = evte => {
			dot.isMoudeDown = false
			document.removeEventListener('mousemove', mousemoveHandler)
			document.removeEventListener('mousemove', mousemoveHandler)
		}
		const mouseoverHandler = evte => {
			runtimeProfile.containerElement.classList.add('_fps-monitor-container-hover')
		}
		const mouseleaveHandler = evte => {
			runtimeProfile.containerElement.classList.remove('_fps-monitor-container-hover')
		}
		hostElement.addEventListener('mousedown', mousedownHandler)
		hostElement.addEventListener('mouseover', mouseoverHandler)
		hostElement.addEventListener('mouseleave', mouseleaveHandler)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const initProfile = () => {
		config.interval = config.interval >= 1000 ? 1000 : config.interval
		/* ... */
		runtimeProfile._prevRAFCountTimeStamp = performance.now()
		runtimeProfile._prevRAFRefreshTimeStamp = performance.now()
		runtimeProfile.ctx = null
		if (runtimeProfile.rAFCanvasElement) {
			runtimeProfile.ctx = runtimeProfile.rAFCanvasElement.getContext('2d')
		}
		runtimeProfile.rAFCount = 0
		runtimeProfile.rAFCountRatio = 0
		runtimeProfile.rAFIntervalCount = 0
		runtimeProfile.pathData = []
		runtimeProfile.maxRAFCount = 60
		modifyProfile.updateMaxTopRAFCount()
		/* ... */
		window.fpsRuntimeProfile = runtimeProfile
	}

	const modifyProfile = {
		updateMaxTopRAFCount() {
			runtimeProfile.maxTopRAFCount = parseInt(runtimeProfile.maxRAFCount + runtimeProfile.maxRAFCount * 0.05)
			if (runtimeProfile.ctx) {
				runtimeProfile.linearGradient = runtimeProfile.ctx.createLinearGradient(0, 0, 0, runtimeProfile.maxTopRAFCount)
				runtimeProfile.linearGradient.addColorStop(0, 'rgba(47, 254, 212, 0.8)')
				runtimeProfile.linearGradient.addColorStop(0.4, 'rgba(2, 199, 252, 0.9)')
				runtimeProfile.linearGradient.addColorStop(1, 'rgba(19, 98, 251, 0.9)')
			}
		},
	}

	const countRAF = nowStamp => {
		runtimeProfile.rAFIntervalCount++
		runtimeProfile.rAFCount = 1000 / (nowStamp - runtimeProfile._prevRAFCountTimeStamp)
		const refreshDiffTime = nowStamp - runtimeProfile._prevRAFRefreshTimeStamp
		if (Math.abs(refreshDiffTime - config.interval) <= 5 || refreshDiffTime >= config.interval) {
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFIntervalCount / (refreshDiffTime / 1000)
			if (runtimeProfile.maxRAFCount <= runtimeProfile.rAFCountRatio) {
				runtimeProfile.maxRAFCount = runtimeProfile.rAFCountRatio
				modifyProfile.updateMaxTopRAFCount()
			}
			runtimeProfile.pathData.push(CANVAS_RECT[1] - parseInt((runtimeProfile.rAFCountRatio / runtimeProfile.maxTopRAFCount) * CANVAS_RECT[1]))
			if (runtimeProfile.pathData.length > config.pathSize + 1) {
				runtimeProfile.pathData.shift()
			}
			runtimeProfile.rAFCount = runtimeProfile.rAFCount.toFixed(2)
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFCountRatio.toFixed(2)
			renderView()
			runtimeProfile.rAFIntervalCount = 0
			runtimeProfile._prevRAFRefreshTimeStamp = nowStamp
		}
		runtimeProfile._prevRAFCountTimeStamp = nowStamp
		window.requestAnimationFrame(countRAF)
	}

	const resetRAF = () => {}

	const renderView = () => {
		const rAFCount = runtimeProfile.rAFCount >> 0
		if (config.mode === MODES[1]) {
			runtimeProfile.rAFSimplifyCountElement.innerHTML = `<span>${config.interval}/${runtimeProfile.rAFCount}/${runtimeProfile.rAFCountRatio}/${runtimeProfile.rAFIntervalCount}</span>`
			if (rAFCount >= config.warning[0] && rAFCount <= config.warning[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-warning')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-warning')
			}
			if (rAFCount >= config.serious[0] && rAFCount <= config.serious[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-serious')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-serious')
			}
		}
		if (config.mode === MODES[2]) {
			runtimeProfile.refreshIntervalElement.innerHTML = `Refresh: <span>${config.interval}ms</span>`
			runtimeProfile.rAFCountElement.innerHTML = `RAF(calc): <span>${runtimeProfile.rAFCount} per sec</span>`
			runtimeProfile.rAFCountRatioElement.innerHTML = `RAF(calc): <span>${runtimeProfile.rAFCountRatio} per sec</span>`
			runtimeProfile.rAFIntervalCountElement.innerHTML = `RAF(acc): <span>${runtimeProfile.rAFIntervalCount} per inter</span>`
			if (rAFCount >= config.warning[0] && rAFCount <= config.warning[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-warning')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-warning')
			}
			if (rAFCount >= config.serious[0] && rAFCount <= config.serious[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-serious')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-serious')
			}
		}
		if (config.mode === MODES[3]) {
			runtimeProfile.refreshIntervalElement.innerHTML = `Refresh: <span>${config.interval}ms</span>`
			runtimeProfile.rAFCountElement.innerHTML = `RAF(calc): <span>${runtimeProfile.rAFCount} per sec</span>`
			runtimeProfile.rAFCountRatioElement.innerHTML = `RAF(calc): <span>${runtimeProfile.rAFCountRatio} per sec</span>`
			runtimeProfile.rAFIntervalCountElement.innerHTML = `RAF(acc): <span>${runtimeProfile.rAFIntervalCount} per inter</span>`
			if (rAFCount >= config.warning[0] && rAFCount <= config.warning[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-warning')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-warning')
			}
			if (rAFCount >= config.serious[0] && rAFCount <= config.serious[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-serious')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-serious')
			}
			drawCanvas()
		}
		if (config.mode === MODES[4]) {
			runtimeProfile.rAFSimplifyCountElement.innerHTML = `<span>${config.interval}/${runtimeProfile.rAFCount}/${runtimeProfile.rAFCountRatio}/${runtimeProfile.rAFIntervalCount}</span>`
			if (rAFCount >= config.warning[0] && rAFCount <= config.warning[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-warning')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-warning')
			}
			if (rAFCount >= config.serious[0] && rAFCount <= config.serious[1]) {
				runtimeProfile.wrapperElement.classList.add('_fps-monitor-tips-serious')
			} else {
				runtimeProfile.wrapperElement.classList.remove('_fps-monitor-tips-serious')
			}
			drawCanvas()
		}
		resetRAF()
	}

	const drawCanvas = () => {
		const ctx = runtimeProfile.ctx
		const pathData = runtimeProfile.pathData
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		ctx.strokeSyle = 'rgba(255, 255, 255, 1)'
		ctx.beginPath()
		const sx = (config.pathSize - pathData.length + 1) * CANVAS_X_STEP_SIZE
		ctx.moveTo(sx, pathData[0])
		let i = 0
		for (i = 1; i < pathData.length; i++) {
			ctx.lineTo(sx + i * CANVAS_X_STEP_SIZE, pathData[i])
		}
		ctx.stroke()
		if (pathData.length >= 2) {
			ctx.lineTo(sx + (i - 1) * CANVAS_X_STEP_SIZE, CANVAS_RECT[1])
			ctx.lineTo(sx, CANVAS_RECT[1])
			ctx.stroke()
		}
		ctx.fillStyle = runtimeProfile.linearGradient
		ctx.fill()
	}

	const main = () => {
		if (typeof window.requestAnimationFrame !== 'function') {
			throw new Error('window.requestAnimationFrame no surppot.')
		}
		initStorage()
		if (typeof config.mode === 'undefined' || config.mode === null || isNaN(+config.mode) || !MODES.includes(+config.mode)) {
			return
		}
		initViewStyle(styleProfile.cssText)
		initViewElement()
		initContainerElementHandler()
		initElementHandler()
		initProfile()
		bindEvent(runtimeProfile.containerElement)
		window.requestAnimationFrame(countRAF)
	}

	window.addEventListener('DOMContentLoaded', () => {
		window.setTimeout(main)
	})
})()
