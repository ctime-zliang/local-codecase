;(globalScope => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 显示全量指标
	 * 		2 - 显示[Memo + rAF]
	 */
	const MODES = [0, 1, 2]
	/**
	 * 分割区域尺寸
	 * 		[START_X, START_Y, WIDTH, HEIGHT]
	 */
	const MODESRECT = [
		[[0, 0, null, 0]],
		[
			[0, 0, null, 14], // 内存数值 配置项
			[0, 14, null, 14], // RAF 文本数值 配置项
			[0, 28, null, 20], // RAF 折线图示 配置项
			[0, 48, null, 14], // RIC 文本数值 配置项
			[52, 48, null, 14], // 刷新间隔文本数值 配置项
			[0, 62, null, 20], // RIC 折线图示 配置项
		],
		[
			[0, 0, null, 14], // 内存数值 配置项
			[0, 14, null, 14], // RAF 文本数值 配置项
			[0, 28, null, 20], // RAF 折线图示 配置项
		],
	]
	const ELEMENTS_RECT = []
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
	/* ... */
	const FPS_THRESHOLD = [20, 30]
	const MEMO_RATIO_THRESHOLD = [0.6, 0.9]
	const TEXT_COLOR = ['rgba(255, 0, 0, 1)', 'rgba(255, 126, 82, 1)', 'rgba(0, 255, 0, 1)']
	const FONT_SIZE = 10
	const STYLE_CLASSNAME_PREFIEX = '_performance-monitor-container'
	const CONTAINER_STYLE = `
		display: flex;
		position: fixed; 
		top: 2px;
		left: 2px;
		cursor: move;
		padding: 3px 4px 4px 4px;
		opacity: 1;
		border: 1px solid rgba(50, 50, 50, 1);
		border-radius: 2px;
		background-color: rgba(25, 25, 25, 0.85);
		box-shadow: rgba(75, 75, 75, 0.35) 0 0 5px;
		z-index: 999999999;
		-webkit-transform: translate3d(0, 0, 1px) scale(1.0);
		-moz-transform: translate3d(0, 0, 1px) scale(1.0);
		transform: translate3d(0, 0, 1px) scale(1.0);
	`
	const CONTAINER_HOVER_STYLE = `
		display: none !important;
		opacity: 0.35 !important;
		background-color: rgba(25, 25, 25, 0) !important;
	`
	const styleProfile = {
		cssText: `
            .${STYLE_CLASSNAME_PREFIEX} {
                ${CONTAINER_STYLE}
            }
			.${STYLE_CLASSNAME_PREFIEX}-hidden {
                ${CONTAINER_HOVER_STYLE}
            }
        `,
	}

	const cacheProfile = {}
	const viewProfile = {}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const createHtmlString = () => {
		return `<div class="${STYLE_CLASSNAME_PREFIEX}"><canvas width="${CANVAS_RECT[0]}" height="${CANVAS_RECT[1]}"></canvas></div>`
	}

	const handleStorage = () => {
		try {
			const _performance_mode = globalScope.localStorage.getItem('_performance_mode')
			if (_performance_mode === null || isNaN(+_performance_mode) || !MODES.includes(+_performance_mode)) {
				globalScope.localStorage.setItem('_performance_mode', _V_MODE)
				return
			}
			_V_MODE = +_performance_mode
		} catch (e) {}
	}

	const initViewStyle = () => {
		const styleElement = document.createElement('style')
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = styleProfile.cssText
		} else {
			styleElement.appendChild(document.createTextNode(styleProfile.cssText))
		}
		;(document.head || document.getElementsByTagName('head')[0]).appendChild(styleElement)
	}

	const initViewElement = () => {
		;(document.body || document.getElementsByTagName('body')[0]).appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initDomElementHandler = () => {
		cacheProfile.containerElement = document.querySelector(`.${STYLE_CLASSNAME_PREFIEX}`)
		cacheProfile.mainCanvasElement = cacheProfile.containerElement.getElementsByTagName('canvas')[0]
	}

	/****************************************************************************************************/
	/****************************************************************************************************/

	const updateContainerVisible = () => {
		if (!isDisplayableMode()) {
			cacheProfile.containerElement.style.display = 'none'
			return
		}
		cacheProfile.containerElement.style.display = 'flex'
	}

	const updateCanvasRect = () => {
		cacheProfile.mainCanvasElement.width = CANVAS_RECT[0]
		cacheProfile.mainCanvasElement.height = CANVAS_RECT[1]
	}

	const bindEvent = () => {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'PAGE_LOADED') {
				cacheProfile.tabId = message.data.tabId
			}
			if (message.action === 'USER_CHANGE_MODE') {
				if (MODES.includes(+message.data.modeValue)) {
					try {
						globalScope.localStorage.setItem('_performance_mode', ((_V_MODE = +message.data.modeValue), _V_MODE))
					} catch (e) {}
					setup()
				}
			}
		})
		const containerMouseEnterHandler = evte => {
			cacheProfile.panelRect = cacheProfile.containerElement.getBoundingClientRect()
			globalScope.setTimeout(() => {
				cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-hidden`)
			})
		}
		const documentMouseMoveHandler = evte => {
			if (!isDisplayableMode() || !cacheProfile.panelRect) {
				return
			}
			if (evte.clientX >= cacheProfile.panelRect.left && evte.clientX <= cacheProfile.panelRect.right && evte.clientY >= cacheProfile.panelRect.top && evte.clientY <= cacheProfile.panelRect.bottom) {
				cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-hidden`)
			} else {
				cacheProfile.containerElement.classList.remove(`${STYLE_CLASSNAME_PREFIEX}-hidden`)
			}
		}
		const documentVisiblityChangeHandler = evte => {
			if (document.visibilityState === 'hidden') {
				globalScope.clearTimeout(cacheProfile.visiblityChangeTimer)
				cacheProfile.visibilityState = document.visibilityState
				return
			}
			cacheProfile.visiblityChangeTimer = globalScope.setTimeout(
				statusText => {
					cacheProfile.visibilityState = statusText
				},
				300,
				document.visibilityState
			)
		}
		cacheProfile.containerElement.addEventListener('mouseenter', containerMouseEnterHandler, true)
		document.addEventListener('visibilitychange', documentVisiblityChangeHandler)
		document.addEventListener('mousemove', documentMouseMoveHandler, true)
	}

	const setRect = () => {
		const _A_ = ELEMENTS_RECT.splice(0)
		MODESRECT[_V_MODE].forEach((arrItem, idx) => {
			ELEMENTS_RECT[idx] = [...arrItem]
		})
		CANVAS_RECT[1] = ELEMENTS_RECT[ELEMENTS_RECT.length - 1][1] + ELEMENTS_RECT[ELEMENTS_RECT.length - 1][3]
	}

	const setProfile = () => {
		const nowStamp = performance.now()
		_V_INTERVAL = _V_INTERVAL >= 1000 ? 1000 : _V_INTERVAL
		cacheProfile.visibilityState = 'visible'
		cacheProfile.panelRect = null
		cacheProfile.ctx = null
		if (cacheProfile.mainCanvasElement) {
			cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
			if (_V_MODE === MODES[1]) {
				cacheProfile.rAFLinearGradient = createLinearGradient(ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
				cacheProfile.rICLinearGradient = createLinearGradient(ELEMENTS_RECT[5][0], ELEMENTS_RECT[5][1], ELEMENTS_RECT[5][0], ELEMENTS_RECT[5][1] + ELEMENTS_RECT[5][3])
			}
			if (_V_MODE === MODES[2]) {
				cacheProfile.rAFLinearGradient = createLinearGradient(ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
			}
		}
		const maxBlockIntervalThreshold = _V_INTERVAL * 1.5
		cacheProfile.maxBlockInterval = maxBlockIntervalThreshold >= 1000 ? 1000 : maxBlockIntervalThreshold
		/* ... */
		cacheProfile._prevRAFRefreshTimeStamp = cacheProfile._prevRAFCountTimeStamp = nowStamp
		cacheProfile._refreshRAFDiffTime = 0
		cacheProfile.rAFIntervalCount = cacheProfile.rAFCountRatio = cacheProfile.rAFCountCalc = 0
		cacheProfile.rAFYPositions = []
		cacheProfile.maxRAFCount = 60
		cacheProfile.maxTopRAFCount = (cacheProfile.maxRAFCount + cacheProfile.maxRAFCount * 0.05) >> 0
		/* ... */
		cacheProfile._prevRICRefreshTimeStamp = cacheProfile._prevRICCountTimeStamp = nowStamp
		cacheProfile.rICIntervalCount = cacheProfile.rdleRatio = 0
		cacheProfile.rdleRatioYPositions = []
	}

	const createLinearGradient = (startX, startY, endX, endY) => {
		const linearGradient = cacheProfile.ctx.createLinearGradient(startX, startY, endX, endY)
		linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
		linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
		linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
		return linearGradient
	}

	const resetCanvasStatus = () => {
		const ctx = cacheProfile.ctx
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		ctx.font = `${FONT_SIZE}px arial, sans-serif`
		ctx.textBaseline = 'top'
	}

	const isDisplayableMode = () => {
		return MODES.slice(1).includes(_V_MODE)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const countRIC = deadline => {
		if (!isDisplayableMode()) {
			globalScope.requestIdleCallback(countRIC)
			return
		}
		cacheProfile.rICIntervalCount++
		globalScope.requestIdleCallback(countRIC)
	}

	const countRAF = nowStamp => {
		if (!isDisplayableMode()) {
			globalScope.requestAnimationFrame(countRAF)
			return
		}
		cacheProfile.rAFIntervalCount++
		cacheProfile.rAFCountCalc = 1000 / (nowStamp - cacheProfile._prevRAFCountTimeStamp)
		cacheProfile._refreshRAFDiffTime = nowStamp - cacheProfile._prevRAFRefreshTimeStamp
		let needRfreshView = false
		if (cacheProfile.visibilityState === 'visible' && cacheProfile._refreshRAFDiffTime >= cacheProfile.maxBlockInterval) {
			const si = (cacheProfile._refreshRAFDiffTime / _V_INTERVAL) >> 0
			cacheProfile.rAFYPositions = [].concat(cacheProfile.rAFYPositions, new Array(si).fill(ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3]))
			cacheProfile.rdleRatioYPositions = [].concat(cacheProfile.rdleRatioYPositions, new Array(si).fill(ELEMENTS_RECT[5][1]))
			needRfreshView = true
		}
		if (Math.abs(cacheProfile._refreshRAFDiffTime - _V_INTERVAL) <= 5 || cacheProfile._refreshRAFDiffTime >= _V_INTERVAL) {
			cacheProfile.rAFCountRatio = cacheProfile.rAFIntervalCount / (cacheProfile._refreshRAFDiffTime / 1000)
			if (cacheProfile.maxRAFCount <= cacheProfile.rAFCountRatio) {
				cacheProfile.maxRAFCount = cacheProfile.rAFCountRatio
				cacheProfile.maxTopRAFCount = (cacheProfile.maxRAFCount + cacheProfile.maxRAFCount * 0.05) >> 0
			}
			cacheProfile.rdleRatio = cacheProfile.rICIntervalCount / (cacheProfile.maxRAFCount * (cacheProfile._refreshRAFDiffTime / 1000))
			cacheProfile.rAFYPositions.push(ELEMENTS_RECT[2][1] + ((cacheProfile.maxTopRAFCount - cacheProfile.rAFCountRatio) / cacheProfile.maxTopRAFCount) * ELEMENTS_RECT[2][3])
			cacheProfile.rdleRatioYPositions.push(ELEMENTS_RECT[5][1] + cacheProfile.rdleRatio * ELEMENTS_RECT[5][3])
			if (cacheProfile.rAFYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rAFYPositions = cacheProfile.rAFYPositions.slice(cacheProfile.rAFYPositions.length - RECORD_CONFIG[0], cacheProfile.rAFYPositions.length)
			}
			if (cacheProfile.rdleRatioYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rdleRatioYPositions = cacheProfile.rdleRatioYPositions.slice(cacheProfile.rdleRatioYPositions.length - RECORD_CONFIG[0], cacheProfile.rdleRatioYPositions.length)
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

	const updateViewProfile = () => {
		const memoryInfo = performance.memory || {}
		viewProfile.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit || 0
		viewProfile.totalJSHeapSize = memoryInfo.totalJSHeapSize || 0
		viewProfile.usedJSHeapSize = memoryInfo.usedJSHeapSize || 0
		viewProfile.refreshRAFDiffTime = cacheProfile._refreshRAFDiffTime.toFixed(2)
		viewProfile.rAFCountCalc = cacheProfile.rAFCountCalc.toFixed(2)
		viewProfile.rAFCountRatio = cacheProfile.rAFCountRatio.toFixed(2)
		viewProfile.rAFIntervalCount = cacheProfile.rAFIntervalCount
		viewProfile.rAFYPositions = [...cacheProfile.rAFYPositions]
		viewProfile.rdleRatio = cacheProfile.rdleRatio.toFixed(4)
		viewProfile.rICIntervalCount = cacheProfile.rICIntervalCount
		viewProfile.rdleRatioYPositions = [...cacheProfile.rdleRatioYPositions]
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const drawMemoryText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${(viewProfile.usedJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)}/${(viewProfile.totalJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)} M`
		ctx.fillStyle =
			viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
				? TEXT_COLOR[0]
				: viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[0] && viewProfile.usedJSHeapSize < viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
				? TEXT_COLOR[1]
				: TEXT_COLOR[2]
		ctx.fillText(textContent, ELEMENTS_RECT[0][0], ELEMENTS_RECT[0][1] + (ELEMENTS_RECT[0][3] - FONT_SIZE) / 2)
	}

	const drawRAFRefreshText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.refreshRAFDiffTime}`
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, ELEMENTS_RECT[4][0], ELEMENTS_RECT[4][1] + (ELEMENTS_RECT[4][3] - FONT_SIZE) / 2)
	}

	const drawRAFText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.rAFCountRatio}/${viewProfile.rAFCountCalc}/${viewProfile.rAFIntervalCount}`
		const refValue = viewProfile.rAFCountCalc >> 0
		ctx.fillStyle = refValue < FPS_THRESHOLD[0] ? TEXT_COLOR[0] : refValue >= FPS_THRESHOLD[0] && refValue < FPS_THRESHOLD[1] ? TEXT_COLOR[1] : TEXT_COLOR[2]
		ctx.fillText(textContent, ELEMENTS_RECT[1][0], ELEMENTS_RECT[1][1] + (ELEMENTS_RECT[1][3] - FONT_SIZE) / 2)
	}

	const drawRICText = () => {
		const ctx = cacheProfile.ctx
		const textContent = `${viewProfile.rICIntervalCount}/${(Math.max(0, 1 - +viewProfile.rdleRatio) * 100).toFixed(2)}%`
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, ELEMENTS_RECT[3][0], ELEMENTS_RECT[3][1] + (ELEMENTS_RECT[3][3] - FONT_SIZE) / 2)
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
		resetCanvasStatus()
		if (_V_MODE === MODES[1]) {
			drawMemoryText()
			drawRAFText()
			drawPolyline(viewProfile.rAFYPositions, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3], cacheProfile.rAFLinearGradient)
			drawRICText()
			drawRAFRefreshText()
			drawPolyline(viewProfile.rdleRatioYPositions, ELEMENTS_RECT[5][1] + ELEMENTS_RECT[5][3], cacheProfile.rICLinearGradient)
			return
		}
		if (_V_MODE === MODES[2]) {
			drawMemoryText()
			drawRAFText()
			drawPolyline(viewProfile.rAFYPositions, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3], cacheProfile.rAFLinearGradient)
			return
		}
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const setup = () => {
		handleStorage()
		setRect()
		setProfile()
		updateCanvasRect()
		updateContainerVisible()
	}

	const main = () => {
		initViewStyle()
		initViewElement()
		initDomElementHandler()
		bindEvent()
		setup()
		globalScope.requestAnimationFrame(countRAF)
		globalScope.requestAnimationFrame(countRIC)
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main)
	})
})(window)
