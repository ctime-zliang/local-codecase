;(() => {
	/**
	 * 模式
	 * 		0 - 不显示
	 * 		1 - 画布图示模式
	 */
	const MODES = [0, 1]
	const CANVAS_TEXT_SEC_HEIGHT = 20
	const CANVAS_X_STEP_SIZE = 4
	/**
	 * 画布尺寸
	 * 		画布宽度(CANVAS_RECT[0])必须为 CANVAS_X_STEP_SIZE 的整数倍
	 */
	const CANVAS_RECT = [104, 50]
	/**
	 * 帧率告警阈值边界及文本提示颜色
	 */
	const SERIOUS = [0, 19]
	const WARNING = [20, 29]
	const NORMAL_TEXT_COLOR = 'rgba(0, 255, 0, 1)'
	const WARNING_TEXT_COLOR = 'rgba(255, 126, 82, 1)'
	const SERIOUS_TEXT_COLOR = 'rgba(255, 0, 0, 1)'
	const TEXT_FONT = `12px arial, sans-serif`
	const variableConfig = {
		mode: MODES[1],
		pathSize: CANVAS_RECT[0] / CANVAS_X_STEP_SIZE,
		/**
		 * 帧率刷新间隔(ms)
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
		line-height: 14px;
		padding: 2px 4px 4px 4px;
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
            ._fps-monitor-container {
                ${CONTAINER_STYLE}
            }
			._fps-monitor-container-hover {
                ${CONTAINER_HOVER_STYLE}
            }
        `,
	}

	const createHtmlString = () => {
		let htmlString = ``
		if (variableConfig.mode === MODES[1]) {
			htmlString = `
				<div class="_fps-monitor-container" style="${CONTAINER_STYLE}">
					<div style="width: ${CANVAS_RECT[0]}px !important; height: ${CANVAS_RECT[1]}px !important;">
						<canvas 
							width="${CANVAS_RECT[0]}" 
							height="${CANVAS_RECT[1]}" 
							style="width: ${CANVAS_RECT[0]}px; height: ${CANVAS_RECT[1]}px;" 
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
				window.localStorage.setItem('_fps_mode', variableConfig.mode)
			} else {
				variableConfig.mode = +_fps_mode
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
		runtimeProfile.containerElement = document.querySelector('._fps-monitor-container')
		runtimeProfile.wrapperElement = runtimeProfile.containerElement.firstElementChild
	}

	const initElementHandler = () => {
		if (variableConfig.mode === MODES[1]) {
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
		variableConfig.interval = variableConfig.interval >= 1000 ? 1000 : variableConfig.interval
		/* ... */
		runtimeProfile._prevRAFCountTimeStamp = performance.now()
		runtimeProfile._prevRAFRefreshTimeStamp = performance.now()
		runtimeProfile.ctx = null
		if (runtimeProfile.rAFCanvasElement) {
			runtimeProfile.ctx = runtimeProfile.rAFCanvasElement.getContext('2d')
			/**
			 * 创建一个曲线显示范围内的渐变色对象
			 */
			runtimeProfile.linearGradient = runtimeProfile.ctx.createLinearGradient(0, CANVAS_TEXT_SEC_HEIGHT, 0, CANVAS_RECT[1])
			runtimeProfile.linearGradient.addColorStop(0, 'rgba(47, 224, 212, 0.9)')
			runtimeProfile.linearGradient.addColorStop(0.6, 'rgba(2, 199, 252, 0.9)')
			runtimeProfile.linearGradient.addColorStop(1, 'rgba(19, 135, 251, 0.9)')
		}
		runtimeProfile.rAFCountCalc = 0
		runtimeProfile.rAFCountRatio = 0
		runtimeProfile.rAFIntervalCount = 0
		runtimeProfile.yPositions = []
		runtimeProfile.maxRAFCount = 60
		modifyProfile.updateMaxTopRAFCount()
		/* ... */
		window.fpsRuntimeProfile = runtimeProfile
	}

	const modifyProfile = {
		updateMaxTopRAFCount() {
			runtimeProfile.maxTopRAFCount = parseInt(runtimeProfile.maxRAFCount + runtimeProfile.maxRAFCount * 0.05)
		},
	}

	const countRAF = nowStamp => {
		runtimeProfile.rAFIntervalCount++
		runtimeProfile.rAFCountCalc = 1000 / (nowStamp - runtimeProfile._prevRAFCountTimeStamp)
		const refreshDiffTime = nowStamp - runtimeProfile._prevRAFRefreshTimeStamp
		if (Math.abs(refreshDiffTime - variableConfig.interval) <= 5 || refreshDiffTime >= variableConfig.interval) {
			runtimeProfile.rAFCountRatio = runtimeProfile.rAFIntervalCount / (refreshDiffTime / 1000)
			if (runtimeProfile.maxRAFCount <= runtimeProfile.rAFCountRatio) {
				runtimeProfile.maxRAFCount = runtimeProfile.rAFCountRatio
				modifyProfile.updateMaxTopRAFCount()
			}
			runtimeProfile.yPositions.push(
				CANVAS_TEXT_SEC_HEIGHT +
					((runtimeProfile.maxTopRAFCount - runtimeProfile.rAFCountRatio) / runtimeProfile.maxTopRAFCount) *
						(CANVAS_RECT[1] - CANVAS_TEXT_SEC_HEIGHT)
			)
			if (runtimeProfile.yPositions.length > variableConfig.pathSize + 1) {
				runtimeProfile.yPositions.shift()
			}
			runtimeProfile.rAFCountCalc = runtimeProfile.rAFCountCalc.toFixed(2)
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
		drawCanvas()
		resetRAF()
	}

	const drawCanvas = () => {
		const refValue = runtimeProfile.rAFCountCalc >> 0
		const textContent = `${runtimeProfile.rAFCountRatio}/${runtimeProfile.rAFCountCalc}/${runtimeProfile.rAFIntervalCount}`
		const ctx = runtimeProfile.ctx
		const yPositions = runtimeProfile.yPositions
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		/**
		 * 绘制分割线
		 */
		ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
		ctx.setLineDash([1, 5])
		ctx.beginPath()
		ctx.moveTo(0, CANVAS_TEXT_SEC_HEIGHT)
		ctx.lineTo(CANVAS_RECT[0], CANVAS_TEXT_SEC_HEIGHT)
		ctx.stroke()
		/**
		 * 绘制文本
		 */
		ctx.fillStyle =
			refValue <= SERIOUS[1] ? SERIOUS_TEXT_COLOR : refValue >= WARNING[0] && refValue <= WARNING[1] ? WARNING_TEXT_COLOR : NORMAL_TEXT_COLOR
		ctx.font = TEXT_FONT
		ctx.textBaseline = 'middle'
		ctx.fillText(textContent, 0, CANVAS_TEXT_SEC_HEIGHT / 2)
		/**
		 * 绘制曲线
		 */
		ctx.beginPath()
		ctx.setLineDash([])
		const sx = (variableConfig.pathSize - yPositions.length + 1) * CANVAS_X_STEP_SIZE
		ctx.moveTo(sx, yPositions[0])
		let i = 0
		for (i = 1; i < yPositions.length; i++) {
			ctx.lineTo(sx + i * CANVAS_X_STEP_SIZE, yPositions[i])
		}
		ctx.stroke()
		/**
		 * 绘制曲线填充色
		 */
		ctx.strokeStyle = 'rgba(19, 98, 251, 1.0)'
		if (yPositions.length >= 2) {
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
	}

	window.addEventListener('DOMContentLoaded', () => {
		window.setTimeout(main)
	})
})()
