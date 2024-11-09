;(globalScope => {
	const CANVAS_RECT = [125, 100]
	const STYLE_CLASSNAME_PREFIEX = '_performance-userview-container'
	const CONTAINER_STYLE = `
		display: block;
		position: fixed; 
		top: 30px;
		right: 30px;
		padding: 2px 4px 4px 4px;
		opacity: 1;
		border: 1px solid rgba(50, 50, 50, 1);
        border-radius: 5px;
		background-color: rgba(25, 25, 25, 0.95);
		box-shadow: rgba(75, 75, 75, 1) 0 0 10px;
		z-index: 999999999;
		-webkit-transform: translate3d(200px, 0, 1px) scale(1.0);
		-moz-transform: translate3d(200px, 0, 1px) scale(1.0);
		transform: translate3d(200px, 0, 1px) scale(1.0);
        -webkit-transition: all 0.25s ease-in;
        -moz-transition: all 0.25s ease-in;
        transition: all 0.25s ease-in;
	`
	const CONTAINER_SHOW_STYLE = `
        -webkit-transform: translate3d(0, 0, 1px) scale(1.0);
        -moz-transform: translate3d(0, 0, 1px) scale(1.0);
        transform: translate3d(0, 0, 1px) scale(1.0);
	`
	const styleProfile = {
		cssText: `
            .${STYLE_CLASSNAME_PREFIEX} {
                ${CONTAINER_STYLE}
            }
			.${STYLE_CLASSNAME_PREFIEX}-show {
                ${CONTAINER_SHOW_STYLE}
            }
        `,
	}

	const cacheProfile = {}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const createHtmlString = () => {
		return `<div class="${STYLE_CLASSNAME_PREFIEX}"><canvas width="${CANVAS_RECT[0]}" height="${CANVAS_RECT[1]}"></canvas></div>`
	}

	const initViewStyle = () => {
		const styleElement = globalScope.document.createElement('style')
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = styleProfile.cssText
		} else {
			styleElement.appendChild(globalScope.document.createTextNode(styleProfile.cssText))
		}
		;(globalScope.document.head || globalScope.document.getElementsByTagName('head')[0]).appendChild(styleElement)
	}

	const initViewElement = () => {
		;(globalScope.document.body || globalScope.document.getElementsByTagName('body')[0]).appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initDomElementHandler = () => {
		cacheProfile.containerElement = globalScope.document.querySelector(`.${STYLE_CLASSNAME_PREFIEX}`)
		cacheProfile.mainCanvasElement = cacheProfile.containerElement.getElementsByTagName('canvas')[0]
	}

	/****************************************************************************************************/

	const bindEvent = () => {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'PAGE_LOADED') {
				cacheProfile.mode = +globalScope.localStorage.getItem('_performance_mode')
				cacheProfile.tabId = message.data.tabId
				setup()
			}
			if (message.action === 'PLUGIN_ICON_CLICKED') {
				togglePanelShow(((cacheProfile.isShowUserViewPanel = !cacheProfile.isShowUserViewPanel), cacheProfile.isShowUserViewPanel))
				if (cacheProfile.isShowUserViewPanel) {
					document.addEventListener('click', documentClickHandler, true)
				} else {
					document.removeEventListener('click', documentClickHandler)
				}
			}
		})
		const documentClickHandler = evte => {
			if (cacheProfile.containerElement.contains(evte.target)) {
				const hoverIndex = getSelectedIndex(getRelativeClient(evte.clientX, evte.clientY))
				if (hoverIndex >= 0) {
					setRectListSelectStatus(hoverIndex)
					drawViewCanvas()
					chrome.runtime.sendMessage({
						action: 'USER_CHANGE_MODE',
						data: { modeValue: cacheProfile.radioList[hoverIndex].value },
					})
				}
				return
			}
			if (cacheProfile.isShowUserViewPanel) {
				togglePanelShow(((cacheProfile.isShowUserViewPanel = !cacheProfile.isShowUserViewPanel), cacheProfile.isShowUserViewPanel))
			}
		}
		const containerMouseMoveHandler = evte => {
			const hoverIndex = getSelectedIndex(getRelativeClient(evte.clientX, evte.clientY))
			setRectListHoverStatus(hoverIndex)
			drawViewCanvas()
			cacheProfile.containerElement.style.cursor = hoverIndex >= 0 ? 'pointer' : 'default'
		}
		cacheProfile.containerElement.addEventListener('mousemove', containerMouseMoveHandler)
	}

	const setProfile = () => {
		cacheProfile.isShowUserViewPanel = false
		cacheProfile.ctx = null
		if (cacheProfile.mainCanvasElement) {
			cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
		}
		cacheProfile.radioList = [
			{ id: String(Math.random()), label: 'Hidden', value: 0, isSelected: cacheProfile.mode <= 0, isHover: false },
			{ id: String(Math.random()), label: 'Full Info', value: 1, isSelected: cacheProfile.mode === 1, isHover: false },
			{ id: String(Math.random()), label: 'RAF & Memo', value: 2, isSelected: cacheProfile.mode === 2, isHover: false },
		]
		cacheProfile.radioRectList = []
	}

	const resetCanvasStatus = () => {
		const ctx = cacheProfile.ctx
		ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
		ctx.lineWidth = 1
		ctx.textBaseline = 'top'
	}

	const togglePanelShow = isShow => {
		if (isShow) {
			cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-show`)
			return
		}
		cacheProfile.containerElement.classList.remove(`${STYLE_CLASSNAME_PREFIEX}-show`)
	}

	const getRelativeClient = (clientX, clientY) => {
		const containerClientRect = cacheProfile.containerElement.getBoundingClientRect()
		return [clientX - containerClientRect.left, clientY - containerClientRect.top]
	}

	const getSelectedIndex = ([iClientX, iClientY]) => {
		let [findIndex, findId] = [0, null]
		while (findIndex <= cacheProfile.radioRectList.length - 1) {
			const rectItem = cacheProfile.radioRectList[findIndex]
			if (iClientX >= rectItem.sx && iClientX <= rectItem.sx + rectItem.w && iClientY >= rectItem.sy && iClientY <= rectItem.sy + rectItem.h) {
				findId = rectItem.id
				break
			}
			findIndex++
		}
		return findId ? findIndex : -1
	}

	const setRectListHoverStatus = index => {
		for (let i = 0; i < cacheProfile.radioList.length; i++) {
			cacheProfile.radioList[i].isHover = false
			if (i === index) {
				cacheProfile.radioList[i].isHover = true
			}
		}
	}

	const setRectListSelectStatus = index => {
		for (let i = 0; i < cacheProfile.radioList.length; i++) {
			cacheProfile.radioList[i].isSelected = false
			if (i === index) {
				cacheProfile.radioList[i].isSelected = true
			}
		}
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const drawRadioElement = optional => {
		const ctx = cacheProfile.ctx
		const { x = 0, y = 0, label = '', isHover = false, isSelected = false } = optional
		const fontSize = 12
		const [outerCircleRadius, centerCircleRadius] = [6, 2]
		const outerCircle = [x + outerCircleRadius, y + outerCircleRadius, outerCircleRadius]
		const centerCircle = [x + outerCircleRadius, y + outerCircleRadius, centerCircleRadius]
		ctx.font = `${fontSize}px arial, sans-serif`
		ctx.strokeStyle = ctx.fillStyle = isHover ? `#efefef` : isSelected ? `#dfdfdf` : `#cfcfcf`
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.arc(outerCircle[0], outerCircle[1], outerCircle[2], 0, 2 * Math.PI)
		ctx.stroke()
		if (isSelected) {
			ctx.beginPath()
			ctx.arc(centerCircle[0], centerCircle[1], centerCircle[2], 0, 2 * Math.PI)
			ctx.stroke()
			ctx.fill()
		}
		const labelDistRadio = 4
		ctx.fillText(label, x + outerCircle[2] * 2 + labelDistRadio, y + 1)
		return { sx: x, sy: y, w: outerCircleRadius * 2 + labelDistRadio + ctx.measureText(label).width, h: Math.max(outerCircleRadius * 2, fontSize) }
	}
	const drawRadioGroupElement = (title, optional) => {
		const ctx = cacheProfile.ctx
		const { x = 0, y = 0, radioList = [] } = optional
		ctx.font = `14px arial, sans-serif`
		ctx.fillStyle = '#ffffff'
		ctx.fillText(title, x, y)
		const radioLeftPadding = 15
		const radioRectList = []
		for (let i = 0; i < radioList.length; i++) {
			radioRectList.push({
				...drawRadioElement({ ...radioList[i], x: x + radioLeftPadding, y: y + 22 + 24 * i }),
				id: radioList[i].id,
			})
		}
		return radioRectList
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const drawViewCanvas = () => {
		resetCanvasStatus()
		const rect1 = drawRadioGroupElement('Mode', {
			x: 5,
			y: 10,
			radioList: [cacheProfile.radioList[0], cacheProfile.radioList[1], cacheProfile.radioList[2]],
		})
		cacheProfile.radioRectList = [].concat(rect1)
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const setup = () => {
		setProfile()
		drawViewCanvas()
	}

	const main = () => {
		initViewStyle()
		initViewElement()
		initDomElementHandler()
		bindEvent()
		setup()
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main, 100)
	})
})(window)
