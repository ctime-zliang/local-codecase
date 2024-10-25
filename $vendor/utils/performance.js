;(globalScope => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 画布图示模式
	 */
	const MODES = [0, 1]
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
	const RECORD_CONFIG = [35, 3]
	/**
	 * 画布尺寸
	 * 		[WIDTH, HEIGHT]
	 */
	const CANVAS_RECT = [(RECORD_CONFIG[0] - 1) * RECORD_CONFIG[1], 95]
	/**
	 * 分割区域尺寸
	 * 		[START_X, START_Y, WIDTH, HEIGHT]
	 */
	const MEMOTEXT_RECT = [0, 0, 102, 15]
	const RAFTEXT_RECT = [0, 15, 102, 15]
	const RAFPOLY_RECT = [0, 30, 102, 25]
	const RICTEXT_RECT = [0, 55, 102, 15]
	const RICPOLY_RECT = [0, 70, 102, 25]
	const FPS_THRESHOLD = [20, 30]
	const TEXT_COLOR = ['rgba(255, 0, 0, 1)', 'rgba(255, 126, 82, 1)', 'rgba(0, 255, 0, 1)']
	const TEXT_FONT = `11px arial, sans-serif`
	const runtimeProfile = {}
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
		const headElement = document.head || document.getElementsByTagName('head')[0]
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssText
		} else {
			styleElement.appendChild(document.createTextNode(cssText))
		}
		headElement.appendChild(styleElement)
	}

	const initViewElement = () => {
		const rootElement = document.body || document.getElementsByTagName('body')[0]
		if (!rootElement) {
			throw new Error('document.body element not found.')
		}
		rootElement.appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initDomElementHandler = () => {
		runtimeProfile.containerElement = document.querySelector('._performance-monitor-container')
		runtimeProfile.wrapperElement = runtimeProfile.containerElement.firstElementChild
		runtimeProfile.mainCanvasElement = runtimeProfile.containerElement.getElementsByTagName('canvas')[0]
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
			runtimeProfile.containerElement.classList.add('_performance-monitor-container-hover')
		}
		const mouseleaveHandler = evte => {
			runtimeProfile.containerElement.classList.remove('_performance-monitor-container-hover')
		}
		const visiblitychangeHandler = evte => {
			if (document.visibilityState === 'hidden') {
				globalScope.clearTimeout(runtimeProfile.visiblityChangeTimer)
				runtimeProfile.visibilityState = document.visibilityState
				return
			}
			runtimeProfile.visiblityChangeTimer = globalScope.setTimeout(() => {
				runtimeProfile.visibilityState = document.visibilityState
			}, 300)
		}
		hostElement.addEventListener('mousedown', mousedownHandler)
		hostElement.addEventListener('mouseover', mouseoverHandler)
		hostElement.addEventListener('mouseleave', mouseleaveHandler)
		document.addEventListener('visibilitychange', visiblitychangeHandler)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const initProfile = () => {
		const nowStamp = performance.now()
		_V_INTERVAL = _V_INTERVAL >= 1000 ? 1000 : _V_INTERVAL
		/* ... */
		runtimeProfile.ctx = null
		if (runtimeProfile.mainCanvasElement) {
			runtimeProfile.ctx = runtimeProfile.mainCanvasElement.getContext('2d')
			runtimeProfile.rAFLinearGradient = createLinearGradient(RAFPOLY_RECT[0], RAFPOLY_RECT[1], RAFPOLY_RECT[0], RAFPOLY_RECT[1] + RAFPOLY_RECT[3])
			runtimeProfile.rICLinearGradient = createLinearGradient(RICPOLY_RECT[0], RICPOLY_RECT[1], RICPOLY_RECT[0], RICPOLY_RECT[1] + RICPOLY_RECT[3])
		}
		/* ... */
		const maxBlockIntervalThreshold = _V_INTERVAL * 1.5
		runtimeProfile.maxBlockInterval = maxBlockIntervalThreshold >= 1000 ? 1000 : maxBlockIntervalThreshold
		runtimeProfile._prevRAFRefreshTimeStamp = runtimeProfile._prevRAFCountTimeStamp = nowStamp
		runtimeProfile.rAFIntervalCount = runtimeProfile.rAFCountRatio = runtimeProfile.rAFCountCalc = 0
		runtimeProfile.rAFYPositions = []
		runtimeProfile.maxRAFCount = 60
		runtimeProfile.maxTopRAFCount = parseInt(runtimeProfile.maxRAFCount + runtimeProfile.maxRAFCount * 0.05) >> 0
		/* ... */
		runtimeProfile._prevRICRefreshTimeStamp = runtimeProfile._prevRICCountTimeStamp = nowStamp
		runtimeProfile.rICIntervalCount = runtimeProfile.rICCountRatio = 0
		runtimeProfile.rICYPositions = []
	}

	const createLinearGradient = (startX, startY, endX, endY) => {
		const linearGradient = runtimeProfile.ctx.createLinearGradient(startX, startY, endX, endY)
		linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
		linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
		linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
		return linearGradient
	}

	const transMemoryUnit = byteSize => {
		return (byteSize / Math.pow(1024.0, 2)).toFixed(2)
	}

	const countRIC = deadline => {
		runtimeProfile.rICIntervalCount++
		globalScope.requestIdleCallback(countRIC)
	}

	const countRAF = nowStamp => {
		runtimeProfile.rAFIntervalCount++
		runtimeProfile.rAFCountCalc = 1000 / (nowStamp - runtimeProfile._prevRAFCountTimeStamp)
		const refreshDiffTime = nowStamp - runtimeProfile._prevRAFRefreshTimeStamp
		let needRfreshView = false
		if (runtimeProfile.visibilityState === 'visible' && refreshDiffTime >= runtimeProfile.maxBlockInterval) {
			const si = (refreshDiffTime / _V_INTERVAL) >> 0
			runtimeProfile.rAFYPositions = [].concat(runtimeProfile.rAFYPositions, new Array(si).fill(RAFPOLY_RECT[1] + RAFPOLY_RECT[3]))
			runtimeProfile.rICYPositions = [].concat(runtimeProfile.rICYPositions, new Array(si).fill(RICPOLY_RECT[1] + RICPOLY_RECT[3]))
			needRfreshView = true
		}
		if (Math.abs(refreshDiffTime - _V_INTERVAL) <= 5 || refreshDiffTime >= _V_INTERVAL) {
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFIntervalCount / (refreshDiffTime / 1000)
			if (runtimeProfile.maxRAFCount <= runtimeProfile.rAFCountRatio) {
				runtimeProfile.maxRAFCount = runtimeProfile.rAFCountRatio
				runtimeProfile.maxTopRAFCount = (runtimeProfile.maxRAFCount + runtimeProfile.maxRAFCount * 0.05) >> 0
			}
			runtimeProfile.rICCountRatio = runtimeProfile.rICIntervalCount / (runtimeProfile.maxRAFCount * (refreshDiffTime / 1000))
			runtimeProfile.rAFYPositions.push(RAFPOLY_RECT[1] + ((runtimeProfile.maxTopRAFCount - runtimeProfile.rAFCountRatio) / runtimeProfile.maxTopRAFCount) * RAFPOLY_RECT[3])
			runtimeProfile.rICYPositions.push(RICPOLY_RECT[1] + runtimeProfile.rICCountRatio * RICPOLY_RECT[3])
			if (runtimeProfile.rAFYPositions.length >= RECORD_CONFIG[0] + 1) {
				runtimeProfile.rAFYPositions.shift()
			}
			if (runtimeProfile.rICYPositions.length >= RECORD_CONFIG[0] + 1) {
				runtimeProfile.rICYPositions.shift()
			}
			runtimeProfile.rAFCountCalc = runtimeProfile.rAFCountCalc.toFixed(2)
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFCountRatio.toFixed(2)
			runtimeProfile.rICCountRatio = runtimeProfile.rICCountRatio.toFixed(4)
			runtimeProfile._prevRAFRefreshTimeStamp = nowStamp
			needRfreshView = true
		}
		runtimeProfile._prevRAFCountTimeStamp = nowStamp
		if (needRfreshView) {
			renderView()
		}
		globalScope.requestAnimationFrame(countRAF)
	}

	const resetCount = () => {
		runtimeProfile.rICIntervalCount = runtimeProfile.rAFIntervalCount = 0
	}

	const renderView = () => {
		drawCanvas()
		resetCount()
	}

	const resetCanvasStatus = () => {
		const ctx = runtimeProfile.ctx
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		ctx.font = TEXT_FONT
		ctx.textBaseline = 'middle'
	}

	const drawMemoryText = () => {
		const ctx = runtimeProfile.ctx
		const memoryInfo = performance.memory || {}
		const totalTextContent = `${transMemoryUnit(memoryInfo.totalJSHeapSize || 0)}`
		const usedTextContent = `${transMemoryUnit(memoryInfo.usedJSHeapSize || 0)}`
		const textContent = usedTextContent + '/' + totalTextContent + ' M'
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, 0, MEMOTEXT_RECT[1] + MEMOTEXT_RECT[3] / 2)
	}

	const drawRAFText = () => {
		const textContent = `${runtimeProfile.rAFCountRatio}/${runtimeProfile.rAFCountCalc}/${runtimeProfile.rAFIntervalCount}`
		const refValue = runtimeProfile.rAFCountCalc >> 0
		const ctx = runtimeProfile.ctx
		ctx.fillStyle = refValue < FPS_THRESHOLD[0] ? TEXT_COLOR[0] : refValue >= FPS_THRESHOLD[0] && refValue < FPS_THRESHOLD[1] ? TEXT_COLOR[1] : TEXT_COLOR[2]
		ctx.fillText(textContent, 0, RAFTEXT_RECT[1] + RAFTEXT_RECT[3] / 2)
	}

	const drawRICText = () => {
		const rationPercent = (Math.max(0, 1 - +runtimeProfile.rICCountRatio) * 100).toFixed(2)
		const textContent = `${runtimeProfile.rICIntervalCount}/${rationPercent}%`
		const ctx = runtimeProfile.ctx
		ctx.fillStyle = TEXT_COLOR[2]
		ctx.fillText(textContent, 0, RICTEXT_RECT[1] + RICTEXT_RECT[3] / 2)
	}

	const drawPolyline = (positions, polylineBottomY, linearGradient) => {
		const ctx = runtimeProfile.ctx
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

	const drawCanvas = () => {
		resetCanvasStatus()
		drawMemoryText()
		drawRAFText()
		drawPolyline(runtimeProfile.rAFYPositions, RAFPOLY_RECT[1] + RAFPOLY_RECT[3], runtimeProfile.rAFLinearGradient)
		drawRICText()
		drawPolyline(runtimeProfile.rICYPositions, RICPOLY_RECT[1] + RICPOLY_RECT[3], runtimeProfile.rICLinearGradient)
	}

	const main = () => {
		initStorage()
		if (isNaN(+_V_MODE) || !MODES.includes(+_V_MODE)) {
			return
		}
		initViewStyle(styleProfile.cssText)
		initViewElement()
		initDomElementHandler()
		initProfile()
		bindEvent(runtimeProfile.containerElement)
		globalScope.requestAnimationFrame(countRAF)
		globalScope.requestAnimationFrame(countRIC)
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main)
	})
})(window)
