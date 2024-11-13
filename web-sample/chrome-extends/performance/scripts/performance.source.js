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
			[65, 48, null, 14], // 刷新间隔文本数值 配置项
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
		if (!MODES.slice(1).includes(_V_MODE)) {
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
			globalScope.setTimeout(() => cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-hidden`))
		}
		const documentMouseMoveHandler = evte => {
			if (!MODES.slice(1).includes(_V_MODE) || !cacheProfile.panelRect) {
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
			cacheProfile.visiblityChangeTimer = globalScope.setTimeout(statusText => (cacheProfile.visibilityState = statusText), 300, document.visibilityState)
		}
		cacheProfile.containerElement.addEventListener('mouseenter', containerMouseEnterHandler, true)
		document.addEventListener('visibilitychange', documentVisiblityChangeHandler)
		document.addEventListener('mousemove', documentMouseMoveHandler, true)
	}

	const setRect = () => {
		const _A_ = ELEMENTS_RECT.splice(0)
		MODESRECT[_V_MODE].forEach((arrItem, idx) => (ELEMENTS_RECT[idx] = [...arrItem]))
		CANVAS_RECT[1] = ELEMENTS_RECT[ELEMENTS_RECT.length - 1][1] + ELEMENTS_RECT[ELEMENTS_RECT.length - 1][3]
	}

	const profileManager = {
		setCommonProfile(nowStamp) {
			_V_INTERVAL = _V_INTERVAL >= 1000 ? 1000 : _V_INTERVAL
			cacheProfile.visibilityState = 'visible'
			cacheProfile.panelRect = null
			cacheProfile.ctx = null
			if (cacheProfile.mainCanvasElement) {
				cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
			}
			const maxBlockIntervalThreshold = _V_INTERVAL * 1.5
			cacheProfile.maxBlockInterval = maxBlockIntervalThreshold >= 1000 ? 1000 : maxBlockIntervalThreshold
			/* ... */
			cacheProfile.prevRefreshViewTimeStamp = cacheProfile.prevRAFExecuteTimeStamp = nowStamp
			cacheProfile.rafExecuteDiffTime = cacheProfile.refreshViewDiffTime = 0
		},
		setRAFCommonProfile(nowStamp) {
			cacheProfile.rAFIntervalCount = cacheProfile.rAFRatioCycleAverage = cacheProfile.rAFRatioInstant = 0
			cacheProfile.rAFRatioCycleAverageYPositions = []
			cacheProfile.maxRAFRatioCycleAverage = 60
		},
		setRAFPolylineProfile(nowStamp, startX, startY, endX, endY) {
			const linearGradient = cacheProfile.ctx.createLinearGradient(startX, startY, endX, endY)
			linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
			linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
			linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
			cacheProfile.rAFLinearGradient = linearGradient
		},
		setRICCommonProfile(nowStamp) {
			cacheProfile.rICIntervalCount = cacheProfile.rdleRatioCycleAverage = 0
			cacheProfile.rdleRatioCycleAverageYPositions = []
		},
		setRdlePolylineProfile(nowStamp, startX, startY, endX, endY) {
			const linearGradient = cacheProfile.ctx.createLinearGradient(startX, startY, endX, endY)
			linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
			linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
			linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
			cacheProfile.rICLinearGradient = linearGradient
		},
	}
	const setProfile = () => {
		const nowStamp = performance.now()
		profileManager.setCommonProfile(nowStamp)
		if (_V_MODE === MODES[1]) {
			profileManager.setRAFCommonProfile(nowStamp)
			profileManager.setRAFPolylineProfile(nowStamp, ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
			profileManager.setRICCommonProfile(nowStamp)
			profileManager.setRdlePolylineProfile(nowStamp, ELEMENTS_RECT[5][0], ELEMENTS_RECT[5][1], ELEMENTS_RECT[5][0], ELEMENTS_RECT[5][1] + ELEMENTS_RECT[5][3])
		}
		if (_V_MODE === MODES[2]) {
			profileManager.setRAFCommonProfile(nowStamp)
			profileManager.setRAFPolylineProfile(nowStamp, ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][0], ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
		}
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const idleCallbackManager = {}
	const requestIdleCallbackHandler = deadline => {
		if (!MODES.slice(1).includes(_V_MODE)) {
			globalScope.requestIdleCallback(requestIdleCallbackHandler)
			return
		}
		cacheProfile.rICIntervalCount++
		globalScope.requestIdleCallback(requestIdleCallbackHandler)
	}

	const frameCallbackManager = {
		fillRAFPolylineBlockData(size, polylineBottomY) {
			cacheProfile.rAFRatioCycleAverageYPositions = [].concat(cacheProfile.rAFRatioCycleAverageYPositions, new Array(size).fill(polylineBottomY))
		},
		fillRdlePolylineBlockData(size, polylineTopY) {
			cacheProfile.rdleRatioCycleAverageYPositions = [].concat(cacheProfile.rdleRatioCycleAverageYPositions, new Array(size).fill(polylineTopY))
		},
		calcRAFCommonData() {
			cacheProfile.rAFRatioCycleAverage = cacheProfile.rAFIntervalCount / (cacheProfile.refreshViewDiffTime / 1000)
			if (cacheProfile.maxRAFRatioCycleAverage <= cacheProfile.rAFRatioCycleAverage) {
				cacheProfile.maxRAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage
			}
		},
		calcRAFPolylineData(polylineTopY, polylineHeight) {
			cacheProfile.rAFRatioCycleAverageYPositions.push(polylineTopY + ((cacheProfile.maxRAFRatioCycleAverage - cacheProfile.rAFRatioCycleAverage) / cacheProfile.maxRAFRatioCycleAverage) * polylineHeight)
			if (cacheProfile.rAFRatioCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rAFRatioCycleAverageYPositions = cacheProfile.rAFRatioCycleAverageYPositions.slice(
					cacheProfile.rAFRatioCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.rAFRatioCycleAverageYPositions.length
				)
			}
		},
		calcRdleCommonData() {
			cacheProfile.rdleRatioCycleAverage = cacheProfile.rICIntervalCount / (cacheProfile.maxRAFRatioCycleAverage * (cacheProfile.refreshViewDiffTime / 1000))
		},
		calcRdlePolylineData(polylineTopY, polylineHeight) {
			cacheProfile.rdleRatioCycleAverageYPositions.push(polylineTopY + cacheProfile.rdleRatioCycleAverage * polylineHeight)
			if (cacheProfile.rdleRatioCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rdleRatioCycleAverageYPositions = cacheProfile.rdleRatioCycleAverageYPositions.slice(
					cacheProfile.rdleRatioCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.rdleRatioCycleAverageYPositions.length
				)
			}
		},
	}
	const requestAnimationFrameHandler = nowStamp => {
		if (!MODES.slice(1).includes(_V_MODE)) {
			globalScope.requestAnimationFrame(requestAnimationFrameHandler)
			return
		}
		/**
		 * 记录 实际的面板视图刷新间隔时间
		 */
		cacheProfile.refreshViewDiffTime = nowStamp - cacheProfile.prevRefreshViewTimeStamp
		/**
		 * 记录 两次相邻的 RAF 的实际运行间隔时间
		 */
		cacheProfile.rafExecuteDiffTime = nowStamp - cacheProfile.prevRAFExecuteTimeStamp
		/**
		 * 记录 一轮实际的面板视图刷新间隔时间内 RAF 的执行次数
		 */
		cacheProfile.rAFIntervalCount++
		/**
		 * 记录 由两次相邻的 RAF 的实际运行时间计算出的瞬时 RAF 执行频率
		 */
		cacheProfile.rAFRatioInstant = 1000 / cacheProfile.rafExecuteDiffTime
		let needRfreshView = false
		if (cacheProfile.visibilityState === 'visible' && cacheProfile.refreshViewDiffTime >= cacheProfile.maxBlockInterval) {
			const si = (cacheProfile.refreshViewDiffTime / _V_INTERVAL) >> 0
			if (_V_MODE === MODES[1]) {
				frameCallbackManager.fillRAFPolylineBlockData(si, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
				frameCallbackManager.fillRdlePolylineBlockData(si, ELEMENTS_RECT[5][1])
			}
			if (_V_MODE === MODES[2]) {
				frameCallbackManager.fillRAFPolylineBlockData(si, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3])
			}
			needRfreshView = true
		}
		if (Math.abs(cacheProfile.refreshViewDiffTime - _V_INTERVAL) <= 5 || cacheProfile.refreshViewDiffTime >= _V_INTERVAL) {
			if (_V_MODE === MODES[1]) {
				frameCallbackManager.calcRAFCommonData()
				frameCallbackManager.calcRAFPolylineData(ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][3])
				frameCallbackManager.calcRdleCommonData()
				frameCallbackManager.calcRdlePolylineData(ELEMENTS_RECT[5][1], ELEMENTS_RECT[5][3])
			}
			if (_V_MODE === MODES[2]) {
				frameCallbackManager.calcRAFCommonData()
				frameCallbackManager.calcRAFPolylineData(ELEMENTS_RECT[2][1], ELEMENTS_RECT[2][3])
			}
			needRfreshView = true
		}
		if (needRfreshView) {
			updateViewProfile()
			renderViewCanvas()
			cacheProfile.prevRefreshViewTimeStamp = nowStamp
			cacheProfile.rICIntervalCount = cacheProfile.rAFIntervalCount = 0
		}
		cacheProfile.prevRAFExecuteTimeStamp = nowStamp
		globalScope.requestAnimationFrame(requestAnimationFrameHandler)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const viewProfile = {}
	const updateManager = {
		memoryDataSubmit() {
			const memoryInfo = performance.memory || {}
			viewProfile.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit || 0
			viewProfile.totalJSHeapSize = memoryInfo.totalJSHeapSize || 0
			viewProfile.usedJSHeapSize = memoryInfo.usedJSHeapSize || 0
		},
		rafCommonDataSubmit() {
			viewProfile.rAFRatioInstant = cacheProfile.rAFRatioInstant.toFixed(2)
			viewProfile.rAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage.toFixed(2)
			viewProfile.rAFIntervalCount = cacheProfile.rAFIntervalCount
		},
		rafPolylineDataSubmit() {
			viewProfile.rAFRatioCycleAverageYPositions = [...cacheProfile.rAFRatioCycleAverageYPositions]
		},
		rdleCommonDataSubmit() {
			viewProfile.rdleRatioCycleAverage = cacheProfile.rdleRatioCycleAverage.toFixed(4)
			viewProfile.rICIntervalCount = cacheProfile.rICIntervalCount
		},
		refreshTextDataSubmit() {
			viewProfile.refreshViewDiffTime = cacheProfile.refreshViewDiffTime.toFixed(2)
		},
		rdlePolylineDataSubmit() {
			viewProfile.rdleRatioCycleAverageYPositions = [...cacheProfile.rdleRatioCycleAverageYPositions]
		},
	}
	const updateViewProfile = () => {
		if (_V_MODE === MODES[1]) {
			updateManager.memoryDataSubmit()
			updateManager.rafCommonDataSubmit()
			updateManager.rafPolylineDataSubmit()
			updateManager.rdleCommonDataSubmit()
			updateManager.refreshTextDataSubmit()
			updateManager.rdlePolylineDataSubmit()
		}
		if (_V_MODE === MODES[2]) {
			updateManager.memoryDataSubmit()
			updateManager.rafCommonDataSubmit()
			updateManager.rafPolylineDataSubmit()
		}
	}

	const resetCanvasStatus = () => {
		cacheProfile.ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		cacheProfile.ctx.lineWidth = 1
		cacheProfile.ctx.font = `${FONT_SIZE}px arial, sans-serif`
		cacheProfile.ctx.textBaseline = 'top'
	}

	const drawManager = {
		drawMemoryText(fillStartX, fillStartY) {
			const textContent = `${(viewProfile.usedJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)}/${(viewProfile.totalJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)} M`
			cacheProfile.ctx.fillStyle =
				viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
					? TEXT_COLOR[0]
					: viewProfile.usedJSHeapSize >= viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[0] && viewProfile.usedJSHeapSize < viewProfile.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
					? TEXT_COLOR[1]
					: TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRAFRefreshText(fillStartX, fillStartY) {
			const textContent = `${viewProfile.refreshViewDiffTime}`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRAFText(fillStartX, fillStartY) {
			const textContent = `${viewProfile.rAFRatioCycleAverage}/${viewProfile.rAFRatioInstant}/${viewProfile.rAFIntervalCount}`
			const refValue = viewProfile.rAFRatioInstant >> 0
			cacheProfile.ctx.fillStyle = refValue < FPS_THRESHOLD[0] ? TEXT_COLOR[0] : refValue >= FPS_THRESHOLD[0] && refValue < FPS_THRESHOLD[1] ? TEXT_COLOR[1] : TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRICText(fillStartX, fillStartY) {
			const textContent = `${viewProfile.rICIntervalCount}/${(Math.max(0, 1 - +viewProfile.rdleRatioCycleAverage) * 100).toFixed(2)}%`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawPolyline(positions, polylineBottomY, linearGradient) {
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
		},
	}
	const renderViewCanvas = () => {
		resetCanvasStatus()
		if (_V_MODE === MODES[1]) {
			drawManager.drawMemoryText(ELEMENTS_RECT[0][0], ELEMENTS_RECT[0][1] + (ELEMENTS_RECT[0][3] - FONT_SIZE) / 2)
			drawManager.drawRAFText(ELEMENTS_RECT[1][0], ELEMENTS_RECT[1][1] + (ELEMENTS_RECT[1][3] - FONT_SIZE) / 2)
			drawManager.drawPolyline(viewProfile.rAFRatioCycleAverageYPositions, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3], cacheProfile.rAFLinearGradient)
			drawManager.drawRICText(ELEMENTS_RECT[3][0], ELEMENTS_RECT[3][1] + (ELEMENTS_RECT[3][3] - FONT_SIZE) / 2)
			drawManager.drawRAFRefreshText(ELEMENTS_RECT[4][0], ELEMENTS_RECT[4][1] + (ELEMENTS_RECT[4][3] - FONT_SIZE) / 2)
			drawManager.drawPolyline(viewProfile.rdleRatioCycleAverageYPositions, ELEMENTS_RECT[5][1] + ELEMENTS_RECT[5][3], cacheProfile.rICLinearGradient)
			return
		}
		if (_V_MODE === MODES[2]) {
			drawManager.drawMemoryText(ELEMENTS_RECT[0][0], ELEMENTS_RECT[0][1] + (ELEMENTS_RECT[0][3] - FONT_SIZE) / 2)
			drawManager.drawRAFText(ELEMENTS_RECT[1][0], ELEMENTS_RECT[1][1] + (ELEMENTS_RECT[1][3] - FONT_SIZE) / 2)
			drawManager.drawPolyline(viewProfile.rAFRatioCycleAverageYPositions, ELEMENTS_RECT[2][1] + ELEMENTS_RECT[2][3], cacheProfile.rAFLinearGradient)
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
		globalScope.requestAnimationFrame(requestAnimationFrameHandler)
		globalScope.requestAnimationFrame(requestIdleCallbackHandler)
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main)
	})
})(window)
