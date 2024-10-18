;(() => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 画布图示模式
	 */
	const MODES = [0, 1]
	const CANVAS_RICRTEXT_SECHEIGHT = (CANVAS_FPSTEXT_SECHEIGHT = 15)
	const CANVAS_RICRPOLYLINE_SECHEIGHT = (CANVAS_FPSPOLYLINE_SECHEIGHT = 25)
	const CANVAS_X_STEP_SIZE = 3
	/**
	 * 画布尺寸
	 * 		画布宽度(CANVAS_RECT[0])必须为 CANVAS_X_STEP_SIZE 的整数倍
	 */
	const CANVAS_RECT = [102, CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT + CANVAS_RICRPOLYLINE_SECHEIGHT]
	/**
	 * 帧率告警阈值边界及文本提示颜色
	 */
	const FPS_SERIOUS = [0, 19]
	const FPS_WARNING = [20, 29]
	const FPS_NORMAL_TEXT_COLOR = 'rgba(0, 255, 0, 1)'
	const FPS_WARNING_TEXT_COLOR = 'rgba(255, 126, 82, 1)'
	const FPS_SERIOUS_TEXT_COLOR = 'rgba(255, 0, 0, 1)'
	const TEXT_FONT = `11px arial, sans-serif`
	const variableConfig = {
		mode: MODES[1],
		pathSize: CANVAS_RECT[0] / CANVAS_X_STEP_SIZE,
		/**
		 * 刷新间隔(ms)
		 */
		interval: 200,
	}
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
		let htmlString = ``
		if (variableConfig.mode === MODES[1]) {
			htmlString = `
				<div class="_performance-monitor-container" style="${CONTAINER_STYLE}">
					<div style="width: ${CANVAS_RECT[0]}px !important; height: ${CANVAS_RECT[1]}px !important;">
						<canvas 
							width="${CANVAS_RECT[0]}" 
							height="${CANVAS_RECT[1]}" 
							style="width: ${CANVAS_RECT[0]}px; height: ${CANVAS_RECT[1]}px;" 
							data-tagitem="_performance-raf-canvas-view">
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
			const _performance_mode = window.localStorage.getItem('_performance_mode')
			if (
				typeof _performance_mode === 'undefined' ||
				_performance_mode === null ||
				isNaN(+_performance_mode) ||
				!MODES.includes(+_performance_mode)
			) {
				window.localStorage.setItem('_performance_mode', variableConfig.mode)
			} else {
				variableConfig.mode = +_performance_mode
			}
		} catch (e) {
			console.warn(e)
			variableConfig.mode = MODES[1]
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
		runtimeProfile.containerElement = document.querySelector('._performance-monitor-container')
		runtimeProfile.wrapperElement = runtimeProfile.containerElement.firstElementChild
	}

	const initElementHandler = () => {
		if (variableConfig.mode === MODES[1]) {
			runtimeProfile.rAFCanvasElement = runtimeProfile.containerElement.querySelector('[data-tagitem="_performance-raf-canvas-view"]')
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
			hostElement.style.left = ((moveX = moveX <= 0 ? 0 : moveX), (moveX = moveX >= xa ? xa : moveX), moveX) + 'px'
			hostElement.style.top = ((moveY = moveY <= 0 ? 0 : moveY), (moveY = moveY >= ya ? ya : moveY), moveY) + 'px'
		}
		const mouseupHandler = evte => {
			dot.isMoudeDown = false
			document.removeEventListener('mousemove', mousemoveHandler)
			document.removeEventListener('mousemove', mousemoveHandler)
		}
		const mouseoverHandler = evte => {
			runtimeProfile.containerElement.classList.add('_performance-monitor-container-hover')
		}
		const mouseleaveHandler = evte => {
			runtimeProfile.containerElement.classList.remove('_performance-monitor-container-hover')
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
		variableConfig.interval = variableConfig.interval >= 1000 ? 1000 : variableConfig.interval
		/* ... */
		runtimeProfile.ctx = null
		if (runtimeProfile.rAFCanvasElement) {
			runtimeProfile.ctx = runtimeProfile.rAFCanvasElement.getContext('2d')
			runtimeProfile.rAFLinearGradient = createLinearGradient(
				runtimeProfile.ctx,
				0,
				CANVAS_FPSTEXT_SECHEIGHT,
				0,
				CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT
			)
			runtimeProfile.rICLinearGradient = createLinearGradient(
				runtimeProfile.ctx,
				0,
				CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT,
				0,
				CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT + CANVAS_RICRPOLYLINE_SECHEIGHT
			)
		}
		/* ... */
		const maxBlockIntervalThreshold = variableConfig.interval * 1.5
		runtimeProfile.maxBlockInterval = maxBlockIntervalThreshold >= 1000 ? 1000 : maxBlockIntervalThreshold
		runtimeProfile._prevRAFRefreshTimeStamp = runtimeProfile._prevRAFCountTimeStamp = performance.now()
		runtimeProfile.rAFIntervalCount = runtimeProfile.rAFCountRatio = runtimeProfile.rAFCountCalc = 0
		runtimeProfile.rAFYPositions = []
		runtimeProfile.maxRAFCount = 60
		modifyProfile.updateMaxTopRAFCount()
		/* ... */
		runtimeProfile._prevRICRefreshTimeStamp = runtimeProfile._prevRICCountTimeStamp = performance.now()
		runtimeProfile.rICIntervalCount = runtimeProfile.rICCountRatio = 0
		runtimeProfile.rICYPositions = []
		/* ... */
		window.performanceRuntimeProfile = runtimeProfile
	}

	const modifyProfile = {
		updateMaxTopRAFCount() {
			runtimeProfile.maxTopRAFCount = parseInt(runtimeProfile.maxRAFCount + runtimeProfile.maxRAFCount * 0.05)
		},
	}

	const createLinearGradient = (ctx, startX, startY, endX, endY) => {
		const linearGradient = ctx.createLinearGradient(startX, startY, endX, endY)
		linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
		linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
		linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
		return linearGradient
	}

	const countRIC = deadline => {
		runtimeProfile.rICIntervalCount++
		window.requestIdleCallback(countRIC)
	}

	const countRAF = nowStamp => {
		runtimeProfile.rAFIntervalCount++
		runtimeProfile.rAFCountCalc = 1000 / (nowStamp - runtimeProfile._prevRAFCountTimeStamp)
		const refreshDiffTime = nowStamp - runtimeProfile._prevRAFRefreshTimeStamp
		let needRfreshView = false
		if (refreshDiffTime >= runtimeProfile.maxBlockInterval) {
			const si = refreshDiffTime / variableConfig.interval
			runtimeProfile.rAFYPositions = [].concat(
				runtimeProfile.rAFYPositions,
				new Array(si >> 0).fill(CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT)
			)
			runtimeProfile.rICYPositions = [].concat(
				runtimeProfile.rICYPositions,
				new Array(si >> 0).fill(CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT)
			)
			needRfreshView = true
		}
		if (Math.abs(refreshDiffTime - variableConfig.interval) <= 5 || refreshDiffTime >= variableConfig.interval) {
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFIntervalCount / (refreshDiffTime / 1000)
			runtimeProfile.rICCountRatio = (runtimeProfile.rAFIntervalCount - runtimeProfile.rICIntervalCount) / runtimeProfile.rAFIntervalCount
			if (runtimeProfile.maxRAFCount <= runtimeProfile.rAFCountRatio) {
				runtimeProfile.maxRAFCount = runtimeProfile.rAFCountRatio
				modifyProfile.updateMaxTopRAFCount()
			}
			runtimeProfile.rAFYPositions.push(
				CANVAS_FPSTEXT_SECHEIGHT +
					((runtimeProfile.maxTopRAFCount - runtimeProfile.rAFCountRatio) / runtimeProfile.maxTopRAFCount) * CANVAS_FPSPOLYLINE_SECHEIGHT
			)
			runtimeProfile.rICYPositions.push(
				CANVAS_FPSTEXT_SECHEIGHT +
					CANVAS_FPSPOLYLINE_SECHEIGHT +
					CANVAS_RICRTEXT_SECHEIGHT +
					(1 - runtimeProfile.rICCountRatio) * CANVAS_RICRPOLYLINE_SECHEIGHT
			)
			if (runtimeProfile.rAFYPositions.length > variableConfig.pathSize + 1) {
				runtimeProfile.rAFYPositions.shift()
			}
			if (runtimeProfile.rICYPositions.length > variableConfig.pathSize + 1) {
				runtimeProfile.rICYPositions.shift()
			}
			runtimeProfile.rAFCountCalc = runtimeProfile.rAFCountCalc.toFixed(2)
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFCountRatio.toFixed(2)
			runtimeProfile.rICCountRatio = runtimeProfile.rICCountRatio.toFixed(2)
			runtimeProfile._prevRAFRefreshTimeStamp = nowStamp
			needRfreshView = true
		}
		runtimeProfile._prevRAFCountTimeStamp = nowStamp
		if (needRfreshView) {
			renderView()
		}
		window.requestAnimationFrame(countRAF)
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
	}

	const drawFPSText = () => {
		const textContent = `${runtimeProfile.rAFCountRatio}/${runtimeProfile.rAFCountCalc}/${runtimeProfile.rAFIntervalCount}`
		const refValue = runtimeProfile.rAFCountCalc >> 0
		const ctx = runtimeProfile.ctx
		ctx.fillStyle =
			refValue <= FPS_SERIOUS[1]
				? FPS_SERIOUS_TEXT_COLOR
				: refValue >= FPS_WARNING[0] && refValue <= FPS_WARNING[1]
				? FPS_WARNING_TEXT_COLOR
				: FPS_NORMAL_TEXT_COLOR
		ctx.font = TEXT_FONT
		ctx.textBaseline = 'middle'
		ctx.fillText(textContent, 0, CANVAS_FPSTEXT_SECHEIGHT / 2)
	}

	const drawIRCRatioText = () => {
		const rationPercent = ((runtimeProfile.rAFIntervalCount - runtimeProfile.rICIntervalCount) / runtimeProfile.rAFIntervalCount).toFixed(4) * 100
		const ratioText = String(rationPercent).length >= 6 ? String(rationPercent).substring(0, 4) : rationPercent
		const textContent = `${ratioText}%`
		const ctx = runtimeProfile.ctx
		ctx.fillStyle = FPS_NORMAL_TEXT_COLOR
		ctx.font = TEXT_FONT
		ctx.textBaseline = 'middle'
		ctx.fillText(textContent, 0, CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT / 2)
	}

	const drawPolyline = (positions, polylineBottomY, linearGradient) => {
		const ctx = runtimeProfile.ctx
		ctx.beginPath()
		const sx = (variableConfig.pathSize - positions.length + 1) * CANVAS_X_STEP_SIZE
		ctx.moveTo(sx, positions[0])
		let i = 0
		for (i = 1; i < positions.length; i++) {
			ctx.lineTo(sx + i * CANVAS_X_STEP_SIZE, positions[i])
		}
		ctx.stroke()
		ctx.strokeStyle = 'rgba(19, 98, 251, 1.0)'
		if (positions.length >= 2) {
			ctx.lineTo(sx + (i - 1) * CANVAS_X_STEP_SIZE, polylineBottomY)
			ctx.lineTo(sx, polylineBottomY)
			ctx.stroke()
		}
		ctx.fillStyle = linearGradient
		ctx.fill()
	}

	const drawCanvas = () => {
		resetCanvasStatus()
		drawFPSText()
		drawPolyline(runtimeProfile.rAFYPositions, CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT, runtimeProfile.rAFLinearGradient)
		drawIRCRatioText()
		drawPolyline(
			runtimeProfile.rICYPositions,
			CANVAS_FPSTEXT_SECHEIGHT + CANVAS_FPSPOLYLINE_SECHEIGHT + CANVAS_RICRTEXT_SECHEIGHT + CANVAS_RICRPOLYLINE_SECHEIGHT,
			runtimeProfile.rICLinearGradient
		)
	}

	const main = () => {
		if (typeof window.requestAnimationFrame !== 'function') {
			throw new Error('window.requestAnimationFrame no surppot.')
		}
		initStorage()
		if (
			typeof variableConfig.mode === 'undefined' ||
			variableConfig.mode === null ||
			isNaN(+variableConfig.mode) ||
			!MODES.includes(+variableConfig.mode)
		) {
			return
		}
		initViewStyle(styleProfile.cssText)
		initViewElement()
		initContainerElementHandler()
		initElementHandler()
		initProfile()
		bindEvent(runtimeProfile.containerElement)
		window.requestAnimationFrame(countRAF)
		window.requestAnimationFrame(countRIC)
	}

	window.addEventListener('DOMContentLoaded', () => {
		window.setTimeout(main)
	})
})()
