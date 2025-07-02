;(globalScope => {
	/**
	 * 画布尺寸
	 */
	const CANVAS_RECT = [125, 75]
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

	const initManager = {
		createHtmlString() {
			return `<div class="${STYLE_CLASSNAME_PREFIEX}"><canvas width="${CANVAS_RECT[0]}" height="${CANVAS_RECT[1]}"></canvas></div>`
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
		setData() {
			cacheProfile.radioList = [
				{ id: String(Math.random()), label: 'Hidden', value: 0, isSelected: cacheProfile.mode <= 0, isHover: false },
				{ id: String(Math.random()), label: 'Standard Info', value: 1, isSelected: cacheProfile.mode === 1, isHover: false },
			]
			cacheProfile.radioRectList = []
		},
		setProfile() {
			if (typeof cacheProfile.isShowUserViewPanel === 'undefined') {
				cacheProfile.isShowUserViewPanel = false
			}
			cacheProfile.mode = +globalScope.localStorage.getItem('_performance_mode')
			cacheProfile.ctx = null
			if (cacheProfile.mainCanvasElement) {
				cacheProfile.ctx = cacheProfile.mainCanvasElement.getContext('2d')
			}
		},
		togglePanelShow(isShow) {
			if (isShow) {
				cacheProfile.containerElement.classList.add(`${STYLE_CLASSNAME_PREFIEX}-show`)
				return
			}
			cacheProfile.containerElement.classList.remove(`${STYLE_CLASSNAME_PREFIEX}-show`)
		},
		getRelativeClient(clientX, clientY) {
			const containerClientRect = cacheProfile.containerElement.getBoundingClientRect()
			return [clientX - containerClientRect.left, clientY - containerClientRect.top]
		},
		getSelectedIndex([iClientX, iClientY]) {
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
		},
		setRectListHoverStatus(index) {
			for (let i = 0; i < cacheProfile.radioList.length; i++) {
				cacheProfile.radioList[i].isHover = false
				if (i === index) {
					cacheProfile.radioList[i].isHover = true
				}
			}
		},
		setRectListSelectStatus(index) {
			for (let i = 0; i < cacheProfile.radioList.length; i++) {
				cacheProfile.radioList[i].isSelected = false
				if (i === index) {
					cacheProfile.radioList[i].isSelected = true
				}
			}
		},
	}

	const bindEvent = () => {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action === 'SYS_PAGE_LOADED') {
				cacheProfile.tabId = message.data.tabId
				refresh()
			}
			if (message.action === 'SYS_PLUGIN_ICON_CLICKED') {
				cacheProfile.isShowUserViewPanel = !cacheProfile.isShowUserViewPanel
				operaManager.togglePanelShow(cacheProfile.isShowUserViewPanel)
				if (cacheProfile.isShowUserViewPanel) {
					refresh()
					document.addEventListener('click', documentClickHandler, true)
				} else {
					document.removeEventListener('click', documentClickHandler)
				}
			}
		})
		const documentClickHandler = evte => {
			if (cacheProfile.containerElement.contains(evte.target)) {
				const hoverIndex = operaManager.getSelectedIndex(operaManager.getRelativeClient(evte.clientX, evte.clientY))
				if (hoverIndex >= 0) {
					const modeValue = cacheProfile.radioList[hoverIndex].value
					globalScope.localStorage.setItem('_performance_mode', modeValue)
					operaManager.setRectListSelectStatus(hoverIndex)
					drawManager.update()
					chrome.runtime.sendMessage({
						action: 'USR_CHANGE_MODE',
						data: { modeValue },
					})
				}
				return
			}
			if (cacheProfile.isShowUserViewPanel) {
				operaManager.togglePanelShow(((cacheProfile.isShowUserViewPanel = !cacheProfile.isShowUserViewPanel), cacheProfile.isShowUserViewPanel))
			}
		}
		const containerMouseMoveHandler = evte => {
			const hoverIndex = operaManager.getSelectedIndex(operaManager.getRelativeClient(evte.clientX, evte.clientY))
			operaManager.setRectListHoverStatus(hoverIndex)
			drawManager.update()
			cacheProfile.containerElement.style.cursor = hoverIndex >= 0 ? 'pointer' : 'default'
		}
		cacheProfile.containerElement.addEventListener('mousemove', containerMouseMoveHandler)
	}

	const drawManager = {
		update() {
			cacheProfile.ctx.clearRect(0, 0, CANVAS_RECT[0], CANVAS_RECT[1])
			cacheProfile.ctx.lineWidth = 1
			cacheProfile.ctx.textBaseline = 'top'
			const rect1 = drawManager.drawRadioGroupElement('Mode', {
				x: 5,
				y: 10,
				radioList: [...cacheProfile.radioList],
			})
			cacheProfile.radioRectList = [].concat(rect1)
		},
		/****************************************************************************************************/
		/****************************************************************************************************/
		drawRadioElement(optional) {
			const { x = 0, y = 0, label = '', isHover = false, isSelected = false } = optional
			const fontSize = 12
			const [outerCircleRadius, centerCircleRadius] = [6, 2]
			const outerCircle = [x + outerCircleRadius, y + outerCircleRadius, outerCircleRadius]
			const centerCircle = [x + outerCircleRadius, y + outerCircleRadius, centerCircleRadius]
			cacheProfile.ctx.font = `${fontSize}px arial, sans-serif`
			cacheProfile.ctx.strokeStyle = cacheProfile.ctx.fillStyle = isHover ? `#efefef` : isSelected ? `#dfdfdf` : `#cfcfcf`
			cacheProfile.ctx.lineWidth = 2
			cacheProfile.ctx.beginPath()
			cacheProfile.ctx.arc(outerCircle[0], outerCircle[1], outerCircle[2], 0, 2 * Math.PI)
			cacheProfile.ctx.stroke()
			if (isSelected) {
				cacheProfile.ctx.beginPath()
				cacheProfile.ctx.arc(centerCircle[0], centerCircle[1], centerCircle[2], 0, 2 * Math.PI)
				cacheProfile.ctx.stroke()
				cacheProfile.ctx.fill()
			}
			const labelDistRadio = 4
			cacheProfile.ctx.fillText(label, x + outerCircle[2] * 2 + labelDistRadio, y + 1)
			return { sx: x, sy: y, w: outerCircleRadius * 2 + labelDistRadio + cacheProfile.ctx.measureText(label).width, h: Math.max(outerCircleRadius * 2, fontSize) }
		},
		drawRadioGroupElement(title, optional) {
			const { x = 0, y = 0, radioList = [] } = optional
			cacheProfile.ctx.font = `14px arial, sans-serif`
			cacheProfile.ctx.fillStyle = '#ffffff'
			cacheProfile.ctx.fillText(title, x, y)
			const radioLineLeftPadding = 15
			const radioRectList = []
			for (let i = 0; i < radioList.length; i++) {
				radioRectList.push({
					...drawManager.drawRadioElement({ ...radioList[i], x: x + radioLineLeftPadding, y: y + 22 + 24 * i }),
					id: radioList[i].id,
				})
			}
			return radioRectList
		},
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	const refresh = () => {
		operaManager.setProfile()
		operaManager.setData()
		drawManager.update()
	}

	const main = () => {
		initManager.initViewStyle()
		initManager.initViewElement()
		initManager.initDomElementHandler()
		bindEvent()
	}

	globalScope.addEventListener('DOMContentLoaded', () => {
		globalScope.setTimeout(main, 100)
	})
})(window.top)
