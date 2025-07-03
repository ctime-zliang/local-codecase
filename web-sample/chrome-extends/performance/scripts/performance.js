;(globalScope => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 显示原生 JS 全量指标
	 * 		2 - 显示包含 Chrome 插件能力的扩展指标
	 */
	const MODES = [0, 1, 2]
	/**
	 * 画布尺寸
	 */
	const CANVAS_RECTS = [
		[0, 0],
		[70, 78],
		[141, 78],
	]
	/**
	 * 区域尺寸
	 * 		[START_X, START_Y, WIDTH, HEIGHT]
	 */
	const ELEMENTS_RECT = [
		[[0, 0, null, 0]],
		[
			[0, 0, null, 14], // RAF 数值文本
			[0, 14, null, 18], // RAF 折线图示
			[0, 32, null, 14], // RIC 数值文本
			[42, 32, null, 14], // 刷新间隔数值文本
			[0, 46, null, 18], // RIC 折线图示
			[0, 64 + 1, null, 14], // 统计内存数值文本
		],
		[
			[0, 0, null, 14], // RAF 数值文本
			[0, 14, null, 18], // RAF 折线图示
			[0, 32, null, 14], // RIC 数值文本
			[42, 32, null, 14], // 刷新间隔数值文本
			[0, 46, null, 18], // RIC 折线图示
			[0, 64 + 1, null, 14], // 统计内存数值文本
			[71, 0, null, 14], // CPU USAGE 数值文本
			[71, 14, null, 18], // CPU USAGE 折线图示
			[71, 32, null, 14], // MEMORY 数值文本
			[71, 46, null, 18], // MEMORY 折线图示
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
	const RECORD_CONFIG = [24, 3]
	/**
	 * 阶段告警阈值(数值)
	 */
	const FPS_THRESHOLD = [20, 30] // 数值
	const SYS_CPUUSAGE_THRESHOLD = [0.8, 0.9] // 比率
	const SYS_MEMORYUSAGE_THRESHOLD = [0.8, 0.9] // 比率
	/**
	 * 文本颜色
	 * 		[正常 - 告警 - 严重]
	 */
	const TEXT_COLOR = ['rgba(0, 255, 0, 1.0)', 'rgba(255, 126, 82, 1.0)', 'rgba(255, 0, 0, 1.0)']
	/**
	 * 折线图颜色
	 * 		[描边 - 填充]
	 */
	const POLYLINE_COLOR = ['rgba(17, 125, 187, 1.0)', 'rgba(120, 233, 232, 0.85)']
	/**
	 * 文本显示字体大小
	 */
	const FONT_SIZE = 10
	/**
	 * 显示运行模式
	 */
	let _V_MODE = MODES[1]
	/**
	 * 刷新间隔
	 */
	let _V_STARDARD_INTERVAL = 200
	let _V_EXTEND_INTERVAL = _V_STARDARD_INTERVAL * 3
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
			cacheProfile.mainCanvasElement.width = CANVAS_RECTS[_V_MODE][0]
			cacheProfile.mainCanvasElement.height = CANVAS_RECTS[_V_MODE][1]
			cacheProfile.mainCanvasElement.style.width = `${CANVAS_RECTS[_V_MODE][0]}px`
			cacheProfile.mainCanvasElement.style.height = `${CANVAS_RECTS[_V_MODE][1]}px`
		},
		calcMatchColor(nowValue, steps, isRatio, refValue, isPositive) {
			const [s0, s1] = [isRatio ? refValue * steps[0] : steps[0], isRatio ? refValue * steps[1] : steps[1]]
			if (isPositive) {
				return nowValue >= s1 ? TEXT_COLOR[2] : nowValue >= s0 && nowValue < s1 ? TEXT_COLOR[1] : TEXT_COLOR[0]
			}
			return nowValue < s0 ? TEXT_COLOR[2] : nowValue >= s0 && nowValue < s1 ? TEXT_COLOR[1] : TEXT_COLOR[0]
		},
	}

	const bindEvent = () => {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'USR_CHANGE_MODE') {
				if (MODES.includes(+message.data.modeValue)) {
					try {
						globalScope.localStorage.setItem('_performance_mode', ((_V_MODE = +message.data.modeValue), _V_MODE))
					} catch (e) {}
					refresh()
				}
				return
			}
			if (message.action === 'USR_GET_SYSINFO') {
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				samplingCallbackManager.calcSystemInfoCommonData(message.data)
				samplingCallbackManager.calcSystemCpuUsagePolylineData(AREA_RECT[7][1], AREA_RECT[7][3])
				samplingCallbackManager.calcSystemMemoryUsagePolylineData(AREA_RECT[9][1], AREA_RECT[9][3])
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
			const { panelRect } = cacheProfile
			if (evte.clientX >= panelRect.left && evte.clientX <= panelRect.right && evte.clientY >= panelRect.top && evte.clientY <= panelRect.bottom) {
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
			profileManager.setRAFCommonProfile()
			profileManager.setRICCommonProfile()
			profileManager.setSystemInfoCommonProfile()
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
			cacheProfile.prevRefreshViewTimeStampExtend = cacheProfile.prevRefreshViewTimeStamp = cacheProfile.prevRAFExecuteTimeStamp = nowStamp
			cacheProfile.refreshViewDiffTimeExtend = cacheProfile.refreshViewDiffTime = cacheProfile.rafExecuteDiffTime = 0
		},
		setRAFCommonProfile() {
			cacheProfile.rAFIntervalCount = cacheProfile.rAFRatioCycleAverage = cacheProfile.rAFRatioInstant = 0
			cacheProfile.rAFRatioCycleAverageYPositions = []
			cacheProfile.maxRAFRatioCycleAverage = 60
		},
		setRICCommonProfile() {
			cacheProfile.rICIntervalCount = cacheProfile.rIdleRatioCycleAverage = 0
			cacheProfile.rIdleRatioCycleAverageYPositions = []
		},
		setSystemInfoCommonProfile() {
			cacheProfile.cpuUsageCycleAverage = 0
			cacheProfile.cpuUsageCycleAverageYPositions = []
			/* ... */
			cacheProfile.memoryUsageCycleAverage = cacheProfile.memoryTotalSize = cacheProfile.memoryUsageSize = 0
			cacheProfile.memoryUsageCycleAverageYPositions = []
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
			cacheProfile.refreshViewDiffTimeExtend = nowStamp - cacheProfile.prevRefreshViewTimeStampExtend
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
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				samplingCallbackManager.fillRAFPolylineBlockData(si, AREA_RECT[1][1] + AREA_RECT[1][3])
				samplingCallbackManager.fillRIdlePolylineBlockData(si, AREA_RECT[4][1])
				needRfreshView = true
			}
			if (Math.abs(cacheProfile.refreshViewDiffTime - _V_STARDARD_INTERVAL) <= 5 || cacheProfile.refreshViewDiffTime >= _V_STARDARD_INTERVAL) {
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				samplingCallbackManager.calcRAFCommonData()
				samplingCallbackManager.calcRAFPolylineData(AREA_RECT[1][1], AREA_RECT[1][3])
				samplingCallbackManager.calcRIdleCommonData()
				samplingCallbackManager.calcRIdlePolylineData(AREA_RECT[4][1], AREA_RECT[4][3])
				needRfreshView = true
			}
			if (needRfreshView) {
				if (_V_MODE === MODES[2] && cacheProfile.refreshViewDiffTimeExtend >= _V_EXTEND_INTERVAL) {
					chrome.runtime.sendMessage({ action: 'USR_GET_SYSINFO' })
					cacheProfile.prevRefreshViewTimeStampExtend = nowStamp
				}
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
		calcRAFCommonData() {
			cacheProfile.rAFRatioCycleAverage = cacheProfile.rAFIntervalCount / (cacheProfile.refreshViewDiffTime / 1000)
			if (cacheProfile.maxRAFRatioCycleAverage <= cacheProfile.rAFRatioCycleAverage) {
				cacheProfile.maxRAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage
			}
		},
		fillRAFPolylineBlockData(size, polylineRectAreaBottomY) {
			cacheProfile.rAFRatioCycleAverageYPositions = [].concat(cacheProfile.rAFRatioCycleAverageYPositions, new Array(size).fill(polylineRectAreaBottomY))
		},
		calcRAFPolylineData(polylineRectAreaTop, polylineRectAreaHeight) {
			cacheProfile.rAFRatioCycleAverageYPositions.push(
				polylineRectAreaTop + ((cacheProfile.maxRAFRatioCycleAverage - cacheProfile.rAFRatioCycleAverage) / cacheProfile.maxRAFRatioCycleAverage) * polylineRectAreaHeight
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
		fillRIdlePolylineBlockData(size, polylineRectAreaTop) {
			cacheProfile.rIdleRatioCycleAverageYPositions = [].concat(cacheProfile.rIdleRatioCycleAverageYPositions, new Array(size).fill(polylineRectAreaTop))
		},
		calcRIdlePolylineData(polylineRectAreaTop, polylineRectAreaHeight) {
			cacheProfile.rIdleRatioCycleAverageYPositions.push(polylineRectAreaTop + cacheProfile.rIdleRatioCycleAverage * polylineRectAreaHeight)
			if (cacheProfile.rIdleRatioCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.rIdleRatioCycleAverageYPositions = cacheProfile.rIdleRatioCycleAverageYPositions.slice(
					cacheProfile.rIdleRatioCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.rIdleRatioCycleAverageYPositions.length
				)
			}
		},
		calcSystemInfoCommonData(messageData) {
			cacheProfile.cpuUsageCycleAverage = messageData.cpuUsage
			cacheProfile.memoryTotalSize = messageData.capacity
			cacheProfile.memoryUsageSize = cacheProfile.memoryTotalSize - messageData.availableCapacity
			cacheProfile.memoryUsageCycleAverage = cacheProfile.memoryUsageSize / cacheProfile.memoryTotalSize
		},
		calcSystemCpuUsagePolylineData(polylineRectAreaTop, polylineRectAreaHeight) {
			cacheProfile.cpuUsageCycleAverageYPositions.push(polylineRectAreaTop + (1 - cacheProfile.cpuUsageCycleAverage) * polylineRectAreaHeight)
			if (cacheProfile.cpuUsageCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.cpuUsageCycleAverageYPositions = cacheProfile.cpuUsageCycleAverageYPositions.slice(
					cacheProfile.cpuUsageCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.cpuUsageCycleAverageYPositions.length
				)
			}
		},
		calcSystemMemoryUsagePolylineData(polylineRectAreaTop, polylineRectAreaHeight) {
			cacheProfile.memoryUsageCycleAverageYPositions.push(polylineRectAreaTop + (1 - cacheProfile.memoryUsageCycleAverage) * polylineRectAreaHeight)
			if (cacheProfile.memoryUsageCycleAverageYPositions.length >= RECORD_CONFIG[0] + 1) {
				cacheProfile.memoryUsageCycleAverageYPositions = cacheProfile.memoryUsageCycleAverageYPositions.slice(
					cacheProfile.memoryUsageCycleAverageYPositions.length - RECORD_CONFIG[0],
					cacheProfile.memoryUsageCycleAverageYPositions.length
				)
			}
		},
	}

	const viewDataManager = {
		data: {},
		update() {
			if (_V_MODE === MODES[1]) {
				viewDataManager.rAfCommonDataSubmit()
				viewDataManager.rAfPolylineDataSubmit()
				viewDataManager.rIdleCommonDataSubmit()
				viewDataManager.refreshTextDataSubmit()
				viewDataManager.rIdlePolylineDataSubmit()
				viewDataManager.performanceMemoryDataSubmit()
				return
			}
			if (_V_MODE === MODES[2]) {
				viewDataManager.rAfCommonDataSubmit()
				viewDataManager.rAfPolylineDataSubmit()
				viewDataManager.rIdleCommonDataSubmit()
				viewDataManager.refreshTextDataSubmit()
				viewDataManager.rIdlePolylineDataSubmit()
				viewDataManager.performanceMemoryDataSubmit()
				viewDataManager.systemInfoCommonDataSubmit()
				viewDataManager.systemInfoPolylineDataSubmit()
				return
			}
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		rAfCommonDataSubmit() {
			viewDataManager.data.rAFRatioInstant = cacheProfile.rAFRatioInstant >> 0
			viewDataManager.data.rAFRatioCycleAverage = cacheProfile.rAFRatioCycleAverage
			viewDataManager.data.rAFIntervalCount = cacheProfile.rAFIntervalCount
		},
		rAfPolylineDataSubmit() {
			viewDataManager.data.rAFRatioCycleAverageYPositions = [...cacheProfile.rAFRatioCycleAverageYPositions]
		},
		rIdleCommonDataSubmit() {
			viewDataManager.data.rIdleRatioCycleAverage = cacheProfile.rIdleRatioCycleAverage
			viewDataManager.data.rICIntervalCount = cacheProfile.rICIntervalCount
		},
		refreshTextDataSubmit() {
			viewDataManager.data.refreshViewDiffTime = cacheProfile.refreshViewDiffTime >> 0
		},
		rIdlePolylineDataSubmit() {
			viewDataManager.data.rIdleRatioCycleAverageYPositions = [...cacheProfile.rIdleRatioCycleAverageYPositions]
		},
		performanceMemoryDataSubmit() {
			const memoryInfo = performance.memory || {}
			viewDataManager.data.jsHeapSizeLimit = (memoryInfo.jsHeapSizeLimit || 0) / Math.pow(1024, 2)
			viewDataManager.data.totalJSHeapSize = (memoryInfo.totalJSHeapSize || 0) / Math.pow(1024, 2)
			viewDataManager.data.usedJSHeapSize = (memoryInfo.usedJSHeapSize || 0) / Math.pow(1024, 2)
			if (viewDataManager.data.jsHeapSizeLimit >= 1000) {
				viewDataManager.data.jsHeapSizeLimit /= 1024
			}
			if (viewDataManager.data.totalJSHeapSize >= 1000) {
				viewDataManager.data.totalJSHeapSize /= 1024
			}
			if (viewDataManager.data.usedJSHeapSize >= 1000) {
				viewDataManager.data.usedJSHeapSize /= 1024
			}
		},
		systemInfoCommonDataSubmit() {
			viewDataManager.data.cpuUsageCycleAverage = cacheProfile.cpuUsageCycleAverage
			viewDataManager.data.memoryTotalSize = cacheProfile.memoryTotalSize / Math.pow(1024, 3)
			viewDataManager.data.memoryUsageSize = cacheProfile.memoryUsageSize / Math.pow(1024, 3)
		},
		systemInfoPolylineDataSubmit() {
			viewDataManager.data.cpuUsageCycleAverageYPositions = [...cacheProfile.cpuUsageCycleAverageYPositions]
			viewDataManager.data.memoryUsageCycleAverageYPositions = [...cacheProfile.memoryUsageCycleAverageYPositions]
		},
	}

	const drawManager = {
		update() {
			cacheProfile.ctx.clearRect(0, 0, CANVAS_RECTS[_V_MODE][0], CANVAS_RECTS[_V_MODE][1])
			cacheProfile.ctx.lineWidth = 1
			cacheProfile.ctx.font = `${FONT_SIZE}px arial, sans-serif`
			cacheProfile.ctx.textBaseline = 'top'
			if (_V_MODE === MODES[1]) {
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				drawManager.drawRAFText(AREA_RECT[0][0], AREA_RECT[0][1] + (AREA_RECT[0][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rAFRatioCycleAverageYPositions, AREA_RECT[1][1] + AREA_RECT[1][3], AREA_RECT[1][0])
				drawManager.drawRICText(AREA_RECT[2][0], AREA_RECT[2][1] + (AREA_RECT[2][3] - FONT_SIZE) / 2)
				drawManager.drawRAFRefreshText(AREA_RECT[3][0], AREA_RECT[3][1] + (AREA_RECT[3][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rIdleRatioCycleAverageYPositions, AREA_RECT[4][1] + AREA_RECT[4][3], AREA_RECT[4][0])
				drawManager.drawPerformanceMemoryText(AREA_RECT[5][0], AREA_RECT[5][1] + (AREA_RECT[5][3] - FONT_SIZE) / 2)
				return
			}
			if (_V_MODE === MODES[2]) {
				const AREA_RECT = ELEMENTS_RECT[_V_MODE]
				drawManager.drawRAFText(AREA_RECT[0][0], AREA_RECT[0][1] + (AREA_RECT[0][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rAFRatioCycleAverageYPositions, AREA_RECT[1][1] + AREA_RECT[1][3], AREA_RECT[1][0])
				drawManager.drawRICText(AREA_RECT[2][0], AREA_RECT[2][1] + (AREA_RECT[2][3] - FONT_SIZE) / 2)
				drawManager.drawRAFRefreshText(AREA_RECT[3][0], AREA_RECT[3][1] + (AREA_RECT[3][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.rIdleRatioCycleAverageYPositions, AREA_RECT[4][1] + AREA_RECT[4][3], AREA_RECT[4][0])
				drawManager.drawPerformanceMemoryText(AREA_RECT[5][0], AREA_RECT[5][1] + (AREA_RECT[5][3] - FONT_SIZE) / 2)
				drawManager.drawSystemCpuUsageText(AREA_RECT[6][0], AREA_RECT[6][1] + (AREA_RECT[6][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.cpuUsageCycleAverageYPositions, AREA_RECT[7][1] + AREA_RECT[7][3], AREA_RECT[7][0])
				drawManager.drawSystemMemoryUsageText(AREA_RECT[8][0], AREA_RECT[8][1] + (AREA_RECT[8][3] - FONT_SIZE) / 2)
				drawManager.drawPolyline(viewDataManager.data.memoryUsageCycleAverageYPositions, AREA_RECT[9][1] + AREA_RECT[9][3], AREA_RECT[9][0])
				return
			}
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		drawRAFText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.rAFRatioCycleAverage.toFixed(2)}/${viewDataManager.data.rAFRatioInstant}`
			cacheProfile.ctx.fillStyle = operaManager.calcMatchColor(viewDataManager.data.rAFRatioInstant >> 0, FPS_THRESHOLD, false, undefined, false)
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRAFRefreshText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.refreshViewDiffTime}`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[0]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawRICText(fillStartX, fillStartY) {
			const textContent = `${(Math.max(0, 1 - viewDataManager.data.rIdleRatioCycleAverage) * 100).toFixed(2)}%`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[0]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawPerformanceMemoryText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.usedJSHeapSize.toFixed(2)}/${viewDataManager.data.totalJSHeapSize.toFixed(2)}`
			cacheProfile.ctx.fillStyle = TEXT_COLOR[0]
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawSystemCpuUsageText(fillStartX, fillStartY) {
			const textContent = `${(Math.max(0, viewDataManager.data.cpuUsageCycleAverage) * 100).toFixed(2)}%`
			cacheProfile.ctx.fillStyle = operaManager.calcMatchColor(viewDataManager.data.cpuUsageCycleAverage, SYS_CPUUSAGE_THRESHOLD, false, undefined, true)
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawSystemMemoryUsageText(fillStartX, fillStartY) {
			const textContent = `${viewDataManager.data.memoryUsageSize.toFixed(2)}/${viewDataManager.data.memoryTotalSize.toFixed(2)}`
			cacheProfile.ctx.fillStyle = operaManager.calcMatchColor(viewDataManager.data.memoryUsageSize, SYS_MEMORYUSAGE_THRESHOLD, true, viewDataManager.data.memoryTotalSize, true)
			cacheProfile.ctx.fillText(textContent, fillStartX, fillStartY)
		},
		drawPolyline(positions, polylineRectAreaBottomY, polylineRectAreaLeftX) {
			if (!positions.length) {
				return
			}
			cacheProfile.ctx.beginPath()
			const sx = (RECORD_CONFIG[0] - positions.length) * RECORD_CONFIG[1]
			cacheProfile.ctx.moveTo(polylineRectAreaLeftX + sx, positions[0])
			let i = 0
			for (i = 1; i < positions.length; i++) {
				cacheProfile.ctx.lineTo(polylineRectAreaLeftX + sx + i * RECORD_CONFIG[1], positions[i])
			}
			cacheProfile.ctx.stroke()
			cacheProfile.ctx.strokeStyle = POLYLINE_COLOR[0]
			if (positions.length >= 2) {
				cacheProfile.ctx.lineTo(polylineRectAreaLeftX + sx + (i - 1) * RECORD_CONFIG[1], polylineRectAreaBottomY)
				cacheProfile.ctx.lineTo(polylineRectAreaLeftX + sx, polylineRectAreaBottomY)
				cacheProfile.ctx.stroke()
			}
			cacheProfile.ctx.fillStyle = POLYLINE_COLOR[1]
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
