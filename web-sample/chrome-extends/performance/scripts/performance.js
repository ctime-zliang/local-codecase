;(globalScope => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 显示全量指标
	 * 		2 - 显示[Memo + rAF]
	 */
	const MODES = [0, 1, 2]
	let _V_MODE = MODES[1]
	let _V_INTERVAL = 200
	/**
	 * 记录数据配置项
	 * 		[DATA_SIZE, PIX_STEP]
	 * |---|---|
	 * 		即
	 * 			RECORD_CONFIG[0] = 3
	 * 			RECORD_CONFIG[1] = 3
	 * 		则
	 * 			POLY_WIDHT = (RECORD_CONFIG[0] - 1) * RECORD_CONFIG[1]
	 */
	const RECORD_CONFIG = [30, 3]
	/**
	 * 画布尺寸
	 * 		[WIDTH, HEIGHT]
	 */
	const CANVAS_RECT = [(RECORD_CONFIG[0] - 1) * RECORD_CONFIG[1], 0]
	/**
	 * 分割区域尺寸
	 * 		[START_X, START_Y, WIDTH, HEIGHT]
	 */
	const MEMOTEXT_RECT = [0, 0, 0, 0]
	const RAFCOUNTTEXT_RECT = [0, 0, 0, 0]
	const RAFCCOUNTPOLY_RECT = [0, 0, 0, 0]
	const RICCOUNTTEXT_RECT = [0, 0, 0, 0]
	const RAFREFRESHTEXT_RECT = [0, 0, 0, 0]
	const RICCOUNTPOLY_RECT = [0, 0, 0, 0]
	/* ... */
	const FPS_THRESHOLD = [20, 30]
	const MEMO_RATIO_THRESHOLD = [0.6, 0.9]
	const TEXT_COLOR = ['rgba(255, 0, 0, 1)', 'rgba(255, 126, 82, 1)', 'rgba(0, 255, 0, 1)']
	const TEXT_FONT = `10px arial, sans-serif`
	const CONTAINER_STYLE = `
		display: block;
		position: fixed; 
		top: 2px;
		left: 2px;
		cursor: move;
		padding: 2px 4px 4px 4px;
		opacity: 1;
		border: 1px solid rgba(50, 50, 50, 1);
		background-color: rgba(25, 25, 25, 0.85);
		box-shadow: rgba(75, 75, 75, 0.35) 0 0 5px;
		box-sizing: border-box !important;
		z-index: 99999999;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		-webkit-transform: translate3d(0, 0, 1px) scale(1.0);
		-moz-transform: translate3d(0, 0, 1px) scale(1.0);
		transform: translate3d(0, 0, 1px) scale(1.0);
	`
	const CONTAINER_HOVER_STYLE = `
		opacity: 0.35 !important;
		background-color: rgba(25, 25, 25, 0) !important;
	`
	const styleProfile = {
		cssText: `
            ._performance-monitor-container {
                ${CONTAINER_STYLE}
            }
			._performance-monitor-container-hover {
                ${CONTAINER_HOVER_STYLE}
            }
        `,
	}

	const cacheProfile = {}
	const viewProfile = {}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const createHtmlString = () => {
		let htmlString = `
			<div class="_performance-monitor-container" style="${CONTAINER_STYLE}">
				<div style="width: ${CANVAS_RECT[0]}px !important; height: ${CANVAS_RECT[1]}px !important;">
					<canvas width="${CANVAS_RECT[0]}" height="${CANVAS_RECT[1]}" style="width: ${CANVAS_RECT[0]}px; height: ${CANVAS_RECT[1]}px;"></canvas>
				</div>
			</div>
		`
		return htmlString
	}

	const initStorage = () => {
		try {
			const _performance_mode = globalScope.localStorage.getItem('_performance_mode')
			if (isNaN(+_performance_mode) || !MODES.includes(+_performance_mode)) {
				globalScope.localStorage.setItem('_performance_mode', _V_MODE)
				return
			}
			_V_MODE = +_performance_mode
		} catch (e) {
			console.warn(e)
		}
	}

	const initViewStyle = cssText => {
		const styleElement = document.createElement('style')
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssText
		} else {
			styleElement.appendChild(document.createTextNode(cssText))
		}
		;(document.head || document.getElementsByTagName('head')[0]).appendChild(styleElement)
	}

	const initViewElement = () => {
		const rootElement = document.body || document.getElementsByTagName('body')[0]
		if (!rootElement) {
			throw new Error('document.body element not found.')
		}
		rootElement.appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initDomElementHandler = () => {
		cacheProfile.containerElement = document.querySelector('._performance-monitor-container')
		cacheProfile.wrapperElement = cacheProfile.containerElement.firstElementChild
		cacheProfile.mainCanvasElement = cacheProfile.containerElement.getElementsByTagName('canvas')[0]
	}

	const bindEvent = hostElement => {
		const profile = {}
		const mousedownHandler = evte => {
			profile.isMoudeDown = true
			profile.distX = evte.clientX - hostElement.offsetLeft
			profile.distY = evte.clientY - hostElement.offsetTop
			document.addEventListener('mousemove', mousemoveHandler)
			document.addEventListener('mouseup', mouseupHandler)
		}
		const mousemoveHandler = evte => {
			if (!profile.isMoudeDown) {
				return
			}
			const rect = hostElement.getBoundingClientRect()
			const [xa, ya] = [document.documentElement.clientWidth - rect.width, document.documentElement.clienHeight - rect.height]
			let [moveX, moveY] = [evte.clientX - profile.distX, evte.clientY - profile.distY]
			hostElement.style.left = ((moveX = moveX <= 0 ? 0 : moveX), (moveX = moveX >= xa ? xa : moveX), moveX) + 'px'
			hostElement.style.top = ((moveY = moveY <= 0 ? 0 : moveY), (moveY = moveY >= ya ? ya : moveY), moveY) + 'px'
		}
		const mouseupHandler = evte => {
			profile.isMoudeDown = false
			document.removeEventListener('mousemove', mousemoveHandler)
			document.removeEventListener('mousemove', mousemoveHandler)
		}
		const mouseoverHandler = evte => {
			cacheProfile.containerElement.classList.add('_performance-monitor-container-hover')
		}
		const mouseleaveHandler = evte => {
			cacheProfile.containerElement.classList.remove('_performance-monitor-container-hover')
		}
		const visiblitychangeHandler = evte => {
			if (document.visibilityState === 'hidden') {
				globalScope.clearTimeout(cacheProfile.visiblityChangeTimer)
				cacheProfile.visibilityState = document.visibilityState
				return
			}
			cacheProfile.visiblityChangeTimer = globalScope.setTimeout(() => {
				cacheProfile.visibilityState = document.visibilityState
			}, 300)
		}
		hostElement.addEventListener('mousedown', mousedownHandler)
		hostElement.addEventListener('mouseover', mouseoverHandler)
		hostElement.addEventListener('mouseleave', mouseleaveHandler)
		document.addEventListener('visibilitychange', visiblitychangeHandler)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const initRect = () => {
		if (_V_MODE === MODES[0]) {
			console.warn(`[performance] the performance panel has been blocked.`)
			return
		}
		if (_V_MODE === MODES[1]) {
			// prettier-ignore
			[0, 0, null, 14].forEach((item, index) => { MEMOTEXT_RECT[index] = item });
			// prettier-ignore
			[0, 14, null, 14].forEach((item, index) => { RAFCOUNTTEXT_RECT[index] = item });
			// prettier-ignore
			[0, 28, null, 20].forEach((item, index) => { RAFCCOUNTPOLY_RECT[index] = item});
			// prettier-ignore
			[0, 48, null, 14].forEach((item, index) => { RICCOUNTTEXT_RECT[index] = item });
			// prettier-ignore
			[52, 48, null, 14].forEach((item, index) => { RAFREFRESHTEXT_RECT[index] = item });
			// prettier-ignore
			[0, 62, null, 20].forEach((item, index) => { RICCOUNTPOLY_RECT[index] = item });
			CANVAS_RECT[1] = 62 + 20
			return
		}
		if (_V_MODE === MODES[2]) {
			// prettier-ignore
			[0, 0, null, 14].forEach((item, index) => { MEMOTEXT_RECT[index] = item });
			// prettier-ignore
			[0, 14, null, 14].forEach((item, index) => { RAFCOUNTTEXT_RECT[index] = item });
			// prettier-ignore
			[0, 28, null, 20].forEach((item, index) => { RAFCCOUNTPOLY_RECT[index] = item});
			CANVAS_RECT[1] = 28 + 20
			return
		}
	}

	const initProfile = () => {
		const nowStamp = performance.now()
		_V_INTERVAL = _V_INTERVAL >= 1000 ? 1000 : _V_INTERVAL
		/* ... */
		cacheProfile.ctx = null
		if (cacheProfile.mainCanvasElement) {
			cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
			cacheProfile.rAFLinearGradient = createLinearGradient(RAFCCOUNTPOLY_RECT[0], RAFCCOUNTPOLY_RECT[1], RAFCCOUNTPOLY_RECT[0], RAFCCOUNTPOLY_RECT[1] + RAFCCOUNTPOLY_RECT[3])
			cacheProfile.rICLinearGradient = createLinearGradient(RICCOUNTPOLY_RECT[0], RICCOUNTPOLY_RECT[1], RICCOUNTPOLY_RECT[0], RICCOUNTPOLY_RECT[1] + RICCOUNTPOLY_RECT[3])
		}
		/* ... */
		const maxBlockIntervalThreshold = _V_INTERVAL * 1.5
		cacheProfile.maxBlockInterval = maxBlockIntervalThreshold >= 1000 ? 1000 : maxBlockIntervalThreshold
		/* ... */
		cacheProfile._prevRAFRefreshTimeStamp = cacheProfile._prevRAFCountTimeStamp = nowStamp
		cacheProfile._refreshRAFDiffTime = 0
		cacheProfile.rAFIntervalCount = cacheProfile.rAFCountRatio = cacheProfile.rAFCountCalc = 0
		cacheProfile.rAFYPositions = []
		cacheProfile.maxRAFCount = 60
		cacheProfile.maxTopRAFCount = parseInt(cacheProfile.maxRAFCount + cacheProfile.maxRAFCount * 0.05) >> 0
		/* ... */
		cacheProfile._prevRICRefreshTimeStamp = cacheProfile._prevRICCountTimeStamp = nowStamp
		cacheProfile.rICIntervalCount = cacheProfile.rICCountRatio = 0
		cacheProfile.rICYPositions = []
	}

	const createLinearGradient = (startX, startY, endX, endY) => {
		const linearGradient = cacheProfile.ctx.createLinearGradient(startX, startY, endX, endY)
		linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
		linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
		linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
		return linearGradient
	}

	const transMemoryUnit = byteSize => {
		return (byteSize / Math.pow(1024.0, 2)).toFixed(2)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const countRIC = deadline => {
		cacheProfile.rICIntervalCount++
		globalScope.requestIdleCallback(countRIC)
	}

	const countRAF = nowStamp => {
		cacheProfile.rAFIntervalCount++
		cacheProfile.rAFCountCalc = 1000 / (nowStamp - cacheProfile._prevRAFCountTimeStamp)
		cacheProfile._refreshRAFDiffTime = nowStamp - cacheProfile._prevRAFRefreshTimeStamp
		let needRfreshView = false
		if (cacheProfile.visibilityState === 'visible' && cacheProfile._refreshRAFDiffTime >= cacheProfile.maxBlockInterval) {
			const si = (cacheProfile._refreshRAFDiffTime / _V_INTERVAL) >> 0
			cacheProfile.rAFYPositions = [].concat(cacheProfile.rAFYPositions, new Array(si).fill(RAFCCOUNTPOLY_RECT[1] + RAFCCOUNTPOLY_RECT[3]))
			cacheProfile.rICYPositions = [].concat(cacheProfile.rICYPositions, new Array(si).fill(RICCOUNTPOLY_RECT[1]))
			needRfreshView = true
		}
		if (Math.abs(cacheProfile._refreshRAFDiffTime - _V_INTERVAL) <= 5 || cacheProfile._refreshRAFDiffTime >= _V_INTERVAL) {
			cacheProfile.rAFCountRatio = cacheProfile.rAFIntervalCount / (cacheProfile._refreshRAFDiffTime / 1000)
			if (cacheProfile.maxRAFCount <= cacheProfile.rAFCountRatio) {
				cacheProfile.maxRAFCount = cacheProfile.rAFCountRatio
				cacheProfile.maxTopRAFCount = (cacheProfile.maxRAFCount + cacheProfile.maxRAFCount * 0.05) >> 0
			}
			cacheProfile.rICCountRatio = cacheProfile.rICIntervalCount / (cacheProfile.maxRAFCount * (cacheProfile._refreshRAFDiffTime / 1000))
			cacheProfile.rAFYPositions.push(RAFCCOUNTPOLY_RECT[1] + ((cacheProfile.maxTopRAFCount - cacheProfile.rAFCountRatio) / cacheProfile.maxTopRAFCount) * RAFCCOUNTPOLY_RECT[3])
			cacheProfile.rICYPositions.push(RICCOUNTPOLY_RECT[1] + cacheProfile.rICCountRatio * RICCOUNTPOLY_RECT[3])
			if (cacheProfile.rAFYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rAFYPositions = cacheProfile.rAFYPositions.slice(cacheProfile.rAFYPositions.length - RECORD_CONFIG[0], cacheProfile.rAFYPositions.length)
			}
			if (cacheProfile.rICYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rICYPositions = cacheProfile.rICYPositions.slice(cacheProfile.rICYPositions.length - RECORD_CONFIG[0], cacheProfile.rICYPositions.length)
			}
			cacheProfile._prevRAFRefreshTimeStamp = nowStamp
			needRfreshView = true
		}
		cacheProfile._prevRAFCountTimeStamp = nowStamp
		if (needRfreshView) {
			updateViewProfile()
			drawViewCanvas()
			cacheProfile.rICIntervalCount = cacheProfile.rAFIntervalCount = 0
		}
		globalScope.requestAnimationFrame(countRAF)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const updateViewProfile = () => {
		const memoryInfo = performance.memory || {}
		viewProfile.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit || 0
		viewProfile.totalJSHeapSize = memoryInfo.totalJSHeapSize || 0
		viewProfile.usedJSHeapSize = memoryInfo.usedJSHeapSize || 0
		/* ... */
		viewProfile.refreshRAFDiffTime = cacheProfile._refreshRAFDiffTime.toFixed(2)
		viewProfile.rAFCountCalc = cacheProfile.rAFCountCalc.toFixed(2)
		viewProfile.rAFCountRatio = cacheProfile.rAFCountRatio.toFixed(2)
		viewProfile.rAFIntervalCount = cacheProfile.rAFIntervalCount
		viewProfile.rAFYPositions = [...cacheProfile.rAFYPositions]
		viewProfile.rICCountRatio = cacheProfile.rICCountRatio.toFixed(4)
		viewProfile.rICIntervalCount = cacheProfile.rICIntervalCount
		viewProfile.rICYPositions = [...cacheProfile.rICYPositions]
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const resetCanvasStatus = () => {
		const ctx = cacheProfile.ctx
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		ctx.font = TEXT_FONT
		ctx.textBaseline = 'middle'
	}

	const drawMemoryText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${transMemoryUnit(viewProfile.usedJSHeapSize)}/${transMemoryUnit(viewProfile.totalJSHeapSize)} M`
		ctx.fillStyle =
			viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
				? TEXT_COLOR[0]
				: viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[0] && viewProfile.usedJSHeapSize < viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
				? TEXT_COLOR[1]
				: TEXT_COLOR[2]
		ctx.fillText(textContent, MEMOTEXT_RECT[0], MEMOTEXT_RECT[1] + MEMOTEXT_RECT[3] / 2)
	}

	const drawRAFRefreshText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.refreshRAFDiffTime}`
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, RAFREFRESHTEXT_RECT[0], RAFREFRESHTEXT_RECT[1] + RAFREFRESHTEXT_RECT[3] / 2)
	}

	const drawRAFText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.rAFCountRatio}/${viewProfile.rAFCountCalc}/${viewProfile.rAFIntervalCount}`
		const refValue = viewProfile.rAFCountCalc >> 0
		ctx.fillStyle = refValue < FPS_THRESHOLD[0] ? TEXT_COLOR[0] : refValue >= FPS_THRESHOLD[0] && refValue < FPS_THRESHOLD[1] ? TEXT_COLOR[1] : TEXT_COLOR[2]
		ctx.fillText(textContent, RAFCOUNTTEXT_RECT[0], RAFCOUNTTEXT_RECT[1] + RAFCOUNTTEXT_RECT[3] / 2)
	}

	const drawRICText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.rICIntervalCount}/${(Math.max(0, 1 - +viewProfile.rICCountRatio) * 100).toFixed(2)}%`
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, RICCOUNTTEXT_RECT[0], RICCOUNTTEXT_RECT[1] + RICCOUNTTEXT_RECT[3] / 2)
	}

	const drawPolyline = (positions, polylineBottomY, linearGradient) => {
		const ctx = cacheProfile.ctx
		ctx.beginPath()
		const sx = (RECORD_CONFIG[0] - positions.length) * RECORD_CONFIG[1]
		ctx.moveTo(sx, positions[0])
		let i = 0
		for (i = 1; i < positions.length; i++) {
			ctx.lineTo(sx + i * RECORD_CONFIG[1], positions[i])
		}
		ctx.stroke()
		ctx.strokeStyle = 'rgba(19, 98, 251, 1.0)'
		if (positions.length >= 2) {
			ctx.lineTo(sx + (i - 1) * RECORD_CONFIG[1], polylineBottomY)
			ctx.lineTo(sx, polylineBottomY)
			ctx.stroke()
		}
		ctx.fillStyle = linearGradient
		ctx.fill()
	}

	const drawViewCanvas = () => {
		if (_V_MODE === MODES[0]) {
			return
		}
		if (_V_MODE === MODES[1]) {
			resetCanvasStatus()
			drawMemoryText()
			drawRAFText()
			drawPolyline(viewProfile.rAFYPositions, RAFCCOUNTPOLY_RECT[1] + RAFCCOUNTPOLY_RECT[3], cacheProfile.rAFLinearGradient)
			drawRICText()
			drawRAFRefreshText()
			drawPolyline(viewProfile.rICYPositions, RICCOUNTPOLY_RECT[1] + RICCOUNTPOLY_RECT[3], cacheProfile.rICLinearGradient)
			return
		}
		if (_V_MODE === MODES[2]) {
			resetCanvasStatus()
			drawMemoryText()
			drawRAFText()
			drawPolyline(viewProfile.rAFYPositions, RAFCCOUNTPOLY_RECT[1] + RAFCCOUNTPOLY_RECT[3], cacheProfile.rAFLinearGradient)
			return
		}
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const main = () => {
		initStorage()
		initRect()
		if (isNaN(+_V_MODE) || !MODES.includes(+_V_MODE)) {
			return
		}
		/* ... */
		initViewStyle(styleProfile.cssText)
		initViewElement()
		initDomElementHandler()
		initProfile()
		bindEvent(cacheProfile.containerElement)
		globalScope.requestAnimationFrame(countRAF)
		globalScope.requestAnimationFrame(countRIC)
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main)
	})
})(window)
