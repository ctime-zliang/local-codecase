;(globalScope => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 显示原生 JS 全量指标
	 */
	const MODES = [0, 1]
	/**
	 * 画布尺寸
	 */
	const CANVAS_RECT = [79, 78]
	/**
	 * 区域尺寸
	 * 		[START_X, START_Y, WIDTH, HEIGHT]
	 */
	const ELEMENTS_RECT = [
		[[0, 0, null, 0]],
		[
			[0, 0, null, 14], // RAF 文本数值
			[0, 14, null, 18], // RAF 折线图示
			[0, 32, null, 14], // RIC 文本数值
			[50, 32, null, 14], // 刷新间隔文本数值
			[0, 46, null, 18], // RIC 折线图示
			[0, 64 + 1, null, 14], // 统计内存数值
		],
	]
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
	const RECORD_CONFIG = [27, 3]
	/**
	 * FPS 阶段告警阈值(数值)
	 */
	const FPS_THRESHOLD = [20, 30]
	/**
	 * 内存占用阶段告警阈值(百分比)
	 */
	const MEMO_RATIO_THRESHOLD = [0.6, 0.9]
	/**
	 * 告警提示文本颜色
	 */
	const TEXT_COLOR = ['rgba(255, 0, 0, 1.0)', 'rgba(255, 126, 82, 1.0)', 'rgba(0, 255, 0, 1.0)']
	/**
	 * 折线图颜色
	 */
	const POLYLINE_STROKE_COLOR = 'rgba(17, 125, 187, 1.0)'
	const POLYLINE_FILL_COLOR = 'rgba(120, 233, 232, 0.85)'
	/**
	 * 文本显示字体大小
	 */
	const FONT_SIZE = 10
	/**
	 * 显示运行模式
	 */
	let _V_MODE = MODES[1]
	/**
	 * 常规项刷新间隔
	 */
	let _V_STARDARD_INTERVAL = 200
	/* ... */
	const STYLE_CLASSNAME_PREFIEX = '_performance-monitor-container'
	const CONTAINER_STYLE = `
		display: flex;
		position: fixed; 
		top: 2px;
		left: 2px;
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

	const initManager = {
		createHtmlString() {
			return `<div class="${STYLE_CLASSNAME_PREFIEX}"><canvas></canvas></div>`
		},
		handleStorage() {
			try {
				const _performance_mode = globalScope.localStorage.getItem('_performance_mode')
				if (_performance_mode === null || isNaN(+_performance_mode) || !MODES.includes(+_performance_mode)) {
					globalScope.localStorage.setItem('_performance_mode', _V_MODE)
					return
				}
				_V_MODE = +_performance_mode
			} catch (e) {}
		},
		initViewStyle() {
			const styleElement = document.createElement('style')
			styleElement.type = 'text/css'
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = styleProfile.cssText
			} else {
				styleElement.appendChild(document.createTextNode(styleProfile.cssText))
			}
			;(document.head || document.getElementsByTagName('head')[0]).appendChild(styleElement)
		},
		initViewElement() {
			;(document.body || document.getElementsByTagName('body')[0]).appendChild(document.createRange().createContextualFragment(initManager.createHtmlString()))
		},
		initDomElementHandler() {
			cacheProfile.containerElement = document.querySelector(`.${STYLE_CLASSNAME_PREFIEX}`)
			cacheProfile.mainCanvasElement = cacheProfile.containerElement.getElementsByTagName('canvas')[0]
		},
	}

	const operaManager = {
		updateContainerVisible() {
			if (!MODES.slice(1).includes(_V_MODE)) {
				cacheProfile.containerElement.style.display = 'none'
				return
			}
			cacheProfile.containerElement.style.display = 'flex'
		},
		updateCanvasRect() {
			cacheProfile.mainCanvasElement.width = CANVAS_RECT[0]
			cacheProfile.mainCanvasElement.height = CANVAS_RECT[1]
			cacheProfile.mainCanvasElement.style.width = `${CANVAS_RECT[0]}px`
			cacheProfile.mainCanvasElement.style.height = `${CANVAS_RECT[1]}px`
		},
	}

	const bindEvent = () => {
		window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'USR_CHANGE_MODE') {
				if (MODES.includes(+message.data.modeValue)) {
					try {
						globalScope.localStorage.setItem('_performance_mode', ((_V_MODE = +message.data.modeValue), _V_MODE))
					} catch (e) {}
					refresh()
				}
				return
			}
			if (message.action === 'USR_GET_CPUINFO') {
				console.log(message)
				return
			}
		})
		/****************************************************************************************************/
		/****************************************************************************************************/
		const containerMouseEnterHandler = evte => {
			cacheProfile.panelRect = cacheProfile.containerElement.getBoundingClientRect()
			globalScope.setTimeout(() => cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-hidden`))
		}
		const documentMouseMoveHandler = evte => {
			if (!MODES.slice(1).includes(_V_MODE) || !cacheProfile.panelRect) {
				return
			}
			if (
				evte.clientX >= cacheProfile.panelRect.left &&
				evte.clientX <= cacheProfile.panelRect.right &&
				evte.clientY >= cacheProfile.panelRect.top &&
				evte.clientY <= cacheProfile.panelRect.bottom
			) {
				cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-hidden`)
				return
			}
			cacheProfile.containerElement.classList.remove(`${STYLE_CLASSNAME_PREFIEX}-hidden`)
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

	const profileManager = {
		update() {
			const nowStamp = performance.now()
			profileManager.setCommonProfile(nowStamp)
			if (_V_MODE === MODES[1]) {
				profileManager.setRAFCommonProfile(nowStamp)
				profileManager.setRICCommonProfile(nowStamp)
			}
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		setCommonProfile(nowStamp) {
			_V_STARDARD_INTERVAL = _V_STARDARD_INTERVAL >= 1000 ? 1000 : _V_STARDARD_INTERVAL
			cacheProfile.visibilityState = 'visible'
			cacheProfile.panelRect = null
			cacheProfile.ctx = null
			if (cacheProfile.mainCanvasElement) {
				cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
			}
			const maxBlockIntervalThreshold = _V_STARDARD_INTERVAL * 1.5
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
		setRICCommonProfile(nowStamp) {
			cacheProfile.rICIntervalCount = cacheProfile.rIdleRatioCycleAverage = 0
			cacheProfile.rIdleRatioCycleAverageYPositions = []
		},
	}

	const samplingCallbackManager = {
		requestIdleCallbackHandler(deadline) {
			if (!MODES.slice(1).includes(_V_MODE)) {
				globalScope.requestIdleCallback(samplingCallbackManager.requestIdleCallbackHandler)
				return
			}
			cacheProfile.rICIntervalCount++
			globalScope.requestIdleCallback(samplingCallbackManager.requestIdleCallbackHandler)
		},
		requestAnimationFrameHandler(nowStamp) {
			if (!MODES.slice(1).includes(_V_MODE)) {
				globalScope.requestAnimationFrame(samplingCallbackManager.requestAnimationFrameHandler)
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
				const si = (cacheProfile.refreshViewDiffTime / _V_STARDARD_INTERVAL) >> 0
				if (_V_MODE === MODES[1]) {
					const AREA_RECT = ELEMENTS_RECT[_V_MODE]
					samplingCallbackManager.fillRAFPolylineBlockData(si, AREA_RECT[1][1] + AREA_RECT[1][3])
					samplingCallbackManager.fillRIdlePolylineBlockData(si, AREA_RECT[4][1])
				}
				needRfreshView = true
			}
			if (Math.abs(cacheProfile.refreshViewDiffTime - _V_STARDARD_INTERVAL) <= 5 || cacheProfile.refreshViewDiffTime >= _V_STARDARD_INTERVAL) {
				if (_V_MODE === MODES[1]) {
					const AREA_RECT = ELEMENTS_RECT[_V_MODE]
					samplingCallbackManager.calcRAFCommonData()
					samplingCallbackManager.calcRAFPolylineData(AREA_RECT[1][1], AREA_RECT[1][3])
					samplingCallbackManager.calcRIdleCommonData()
					samplingCallbackManager.calcRIdlePolylineData(AREA_RECT[4][1], AREA_RECT[4][3])
				}
				needRfreshView = true
			}
			if (needRfreshView) {
				viewDataManager.update()
				drawManager.update()
				cacheProfile.prevRefreshViewTimeStamp = nowStamp
				cacheProfile.rICIntervalCount = cacheProfile.rAFIntervalCount = 0
			}
			cacheProfile.prevRAFExecuteTimeStamp = nowStamp
			globalScope.requestAnimationFrame(samplingCallbackManager.requestAnimationFrameHandler)
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		fillRAFPolylineBlockData(size, polylineBottomY) {
			cacheProfile.rAFRatioCycleAverageYPositions = [].concat(cacheProfile.rAFRatioCycleAverageYPositions, new Array(size).fill(polylineBottomY))
		},
		fillRIdlePolylineBlockData(size, polylineTopY) {
			cacheProfile.rIdleRatioCycleAverageYPositions = [].concat(cacheProfile.rIdleRatioCycleAverageYPositions, new Array(size).fill(polylineTopY))
		},
		calcRAFCommonData() {
			cacheProfile.rAFRatioCycleAverage = cacheProfile.rAFIntervalCount / (cacheProfile.refreshViewDiffTime / 1000)
			if (cacheProfile.maxRAFRatioCycleAverage <= cacheProfile.rAFRatioCycleAverage) {
				cacheProfile.maxRAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage
			}
		},
		calcRAFPolylineData(polylineTopY, polylineHeight) {
			cacheProfile.rAFRatioCycleAverageYPositions.push(
				polylineTopY + ((cacheProfile.maxRAFRatioCycleAverage - cacheProfile.rAFRatioCycleAverage) / cacheProfile.maxRAFRatioCycleAverage) * polylineHeight
			)
			if (cacheProfile.rAFRatioCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rAFRatioCycleAverageYPositions = cacheProfile.rAFRatioCycleAverageYPositions.slice(
					cacheProfile.rAFRatioCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.rAFRatioCycleAverageYPositions.length
				)
			}
		},
		calcRIdleCommonData() {
			cacheProfile.rIdleRatioCycleAverage = cacheProfile.rICIntervalCount / (cacheProfile.maxRAFRatioCycleAverage * (cacheProfile.refreshViewDiffTime / 1000))
		},
		calcRIdlePolylineData(polylineTopY, polylineHeight) {
			cacheProfile.rIdleRatioCycleAverageYPositions.push(polylineTopY + cacheProfile.rIdleRatioCycleAverage * polylineHeight)
			if (cacheProfile.rIdleRatioCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rIdleRatioCycleAverageYPositions = cacheProfile.rIdleRatioCycleAverageYPositions.slice(
					cacheProfile.rIdleRatioCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.rIdleRatioCycleAverageYPositions.length
				)
			}
		},
	}

	const viewDataManager = {
		data: {},
		update() {
			if (_V_MODE === MODES[1]) {
				viewDataManager.memoryDataSubmit()
				viewDataManager.rAfCommonDataSubmit()
				viewDataManager.rAfPolylineDataSubmit()
				viewDataManager.rIdleCommonDataSubmit()
				viewDataManager.refreshTextDataSubmit()
				viewDataManager.rIdlePolylineDataSubmit()
			}
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		memoryDataSubmit() {
			const memoryInfo = performance.memory || {}
			viewDataManager.data.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit || 0
			viewDataManager.data.totalJSHeapSize = memoryInfo.totalJSHeapSize || 0
			viewDataManager.data.usedJSHeapSize = memoryInfo.usedJSHeapSize || 0
		},
		rAfCommonDataSubmit() {
			viewDataManager.data.rAFRatioInstant = cacheProfile.rAFRatioInstant.toFixed(2)
			viewDataManager.data.rAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage.toFixed(2)
			viewDataManager.data.rAFIntervalCount = cacheProfile.rAFIntervalCount
		},
		rAfPolylineDataSubmit() {
			viewDataManager.data.rAFRatioCycleAverageYPositions = [...cacheProfile.rAFRatioCycleAverageYPositions]
		},
		rIdleCommonDataSubmit() {
			viewDataManager.data.rIdleRatioCycleAverage = cacheProfile.rIdleRatioCycleAverage.toFixed(4)
			viewDataManager.data.rICIntervalCount = cacheProfile.rICIntervalCount
		},
		refreshTextDataSubmit() {
			viewDataManager.data.refreshViewDiffTime = cacheProfile.refreshViewDiffTime >> 0
		},
		rIdlePolylineDataSubmit() {
			viewDataManager.data.rIdleRatioCycleAverageYPositions = [...cacheProfile.rIdleRatioCycleAverageYPositions]
		},
	}

	const drawManager = {
		update() {
			cacheProfile.ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
			cacheProfile.ctx.lineWidth = 1
			cacheProfile.ctx.font = `${FONT_SIZE}px arial, sans-serif`
			cacheProfile.ctx.textBaseline = 'top'
			if (_V_MODE === MODES[1]) {
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				drawManager.drawRAFText(AREA_RECT[0][0], AREA_RECT[0][1] + (AREA_RECT[0][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rAFRatioCycleAverageYPositions, AREA_RECT[1][1] + AREA_RECT[1][3])
				drawManager.drawRICText(AREA_RECT[2][0], AREA_RECT[2][1] + (AREA_RECT[2][3] - FONT_SIZE) / 2)
				drawManager.drawRAFRefreshText(AREA_RECT[3][0], AREA_RECT[3][1] + (AREA_RECT[3][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rIdleRatioCycleAverageYPositions, AREA_RECT[4][1] + AREA_RECT[4][3])
				drawManager.drawMemoryText(AREA_RECT[5][0], AREA_RECT[5][1] + (AREA_RECT[5][3] - FONT_SIZE) / 2)
				return
			}
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		drawMemoryText(fillStartX, fillStartY) {
			const textContent = `${(viewDataManager.data.usedJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)}/${(viewDataManager.data.totalJSHeapSize / Math.pow(1024.0, 2)).toFixed(2)}`
			cacheProfile.ctx.fillStyle =
				viewDataManager.data.usedJSHeapSize >= viewDataManager.data.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
					? TEXT_COLOR[0]
					: viewDataManager.data.usedJSHeapSize >= viewDataManager.data.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[0] &&
					  viewDataManager.data.usedJSHeapSize < viewDataManager.data.jsHeapSizeLimit * MEMO_RATIO_THRESHOLD[1]
					? TEXT_COLOR[1]
					: TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRAFRefreshText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.refreshViewDiffTime}`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRAFText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.rAFRatioCycleAverage}/${viewDataManager.data.rAFRatioInstant}`
			const refValue = viewDataManager.data.rAFRatioInstant >> 0
			cacheProfile.ctx.fillStyle = refValue < FPS_THRESHOLD[0] ? TEXT_COLOR[0] : refValue >= FPS_THRESHOLD[0] && refValue < FPS_THRESHOLD[1] ? TEXT_COLOR[1] : TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRICText(fillStartX, fillStartY) {
			const textContent = `${(Math.max(0, 1 - +viewDataManager.data.rIdleRatioCycleAverage) * 100).toFixed(2)}%`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[2]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawPolyline(positions, polylineBottomY) {
			cacheProfile.ctx.beginPath()
			const sx = (RECORD_CONFIG[0] - positions.length) * RECORD_CONFIG[1]
			cacheProfile.ctx.moveTo(sx, positions[0])
			let i = 0
			for (i = 1; i < positions.length; i++) {
				cacheProfile.ctx.lineTo(sx + i * RECORD_CONFIG[1], positions[i])
			}
			cacheProfile.ctx.stroke()
			cacheProfile.ctx.strokeStyle = POLYLINE_STROKE_COLOR
			if (positions.length >= 2) {
				cacheProfile.ctx.lineTo(sx + (i - 1) * RECORD_CONFIG[1], polylineBottomY)
				cacheProfile.ctx.lineTo(sx, polylineBottomY)
				cacheProfile.ctx.stroke()
			}
			cacheProfile.ctx.fillStyle = POLYLINE_FILL_COLOR
			cacheProfile.ctx.fill()
		},
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const refresh = () => {
		initManager.handleStorage()
		profileManager.update()
		operaManager.updateCanvasRect()
		operaManager.updateContainerVisible()
	}

	const main = () => {
		initManager.initViewStyle()
		initManager.initViewElement()
		initManager.initDomElementHandler()
		bindEvent()
		refresh()
		globalScope.requestAnimationFrame(samplingCallbackManager.requestAnimationFrameHandler)
		globalScope.requestAnimationFrame(samplingCallbackManager.requestIdleCallbackHandler)
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main)
	})
})(window)
