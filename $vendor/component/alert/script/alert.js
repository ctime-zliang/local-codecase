function __AlertFindTargetByClassName(nowElement, className) {
	if (!nowElement || (nowElement.nodeType !== 1 && nowElement.nodeType !== 3)) {
		return null
	}
	if (nowElement.classList.contains(className)) {
		return nowElement
	}
	return __AlertFindTargetByClassName(nowElement.parentElement, className)
}

class Ven$AlertManager {
	static defaultConfirmBtn = { type: 'confirm', tag: 'confirm', text: '确认' }
	static defaultCancelBtn = { type: 'cancel', tag: 'cancel', text: '取消' }
	static defaultCloseBtn = { type: 'close', tag: 'close', text: '关闭' }
	/****************************** ******************************/
	/****************************** ******************************/
	static _containerElemeent = null
	static _contentElement = null
	static _wrapperElement = null
	static _btnsWrapperElement = null
	static _lockElement = null
	static _callback = null
	static _pointerdownX = 0
	static _pointerdownY = 0
	static _btns = []
	static _isPointerdown = false
	static _isFlushCallback = false

	static init() {
		if (document.querySelector('.alertmgr-container')) {
			return
		}
		this._btns = [this.defaultConfirmBtn, this.defaultCancelBtn]
		/* ... */
		this._btnsWrapperTouchstartHandler = this._btnsWrapperTouchstartHandler.bind(this)
		this._btnsWrapperTouchendHandler = this._btnsWrapperTouchendHandler.bind(this)
		this._btnsWrapperMousedownHandler = this._btnsWrapperMousedownHandler.bind(this)
		this._btnsWrapperMouseupHandler = this._btnsWrapperMouseupHandler.bind(this)
		this._containerContextmenuHandler = this._containerContextmenuHandler.bind(this)
		this._transitionsTransitionstartHandler = this._transitionsTransitionstartHandler.bind(this)
		this._transitionsTransitionendHandler = this._transitionsTransitionendHandler.bind(this)
		this._updateContainerClientRect = this._updateContainerClientRect.bind(this)
		/* ... */
		document.body.appendChild(document.createRange().createContextualFragment(this._template()))
		this._containerElemeent = document.querySelector('.alertmgr-container')
		this._lockElement = this._containerElemeent.querySelector('.alertmgr-lock')
		this._wrapperElement = this._containerElemeent.querySelector('.alertmgr-wrapper')
		this._contentElement = this._containerElemeent.querySelector('.alertmgr-message-content')
		this._btnsWrapperElement = this._containerElemeent.querySelector('.alertmgr-btns-wrapper')
		/* ... */
		this._updateContainerClientRect()
		this._updateBtnsView()
		this._bindEvent()
	}

	static open(message, options = {}) {
		if (options instanceof Function) {
			this._callback = options
		} else {
			if (options.callback) {
				this._callback = options.callback
			}
			if (options.btns) {
				this._btns = options.btns
				this._updateBtnsView()
			}
		}
		this._isFlushCallback = false
		this._contentElement.innerHTML = message
		this._wrapperElement.classList.add('alertmgr-wrapper-entrystart', 'alertmgr-transition-duringshort')
		this._lockElement.classList.add('alertmgr-lock-entrystart', 'alertmgr-transition-duringshort')
		this._containerElemeent.classList.add('alertmgr-container-show')
		/* ... */
		window.requestAnimationFrame(() => {
			window.setTimeout(() => {
				this._wrapperElement.classList.remove('alertmgr-wrapper-entrystart')
				this._lockElement.classList.remove('alertmgr-lock-entrystart')
			}, 1 / 60)
		})
	}

	static close() {
		this._containerElemeent.classList.remove('alertmgr-container-show')
	}

	static bindCallback(callback) {
		this._callback = callback
		return this
	}

	static setBtns(_btns) {
		this._btns = _btns
		this._updateBtnsView()
		return this
	}

	/****************************** ******************************/
	/****************************** ******************************/

	static _template() {
		return `
            <section class="alertmgr-container">
                <div class="alertmgr-position-wrapper">
                    <div class="alertmgr-lock alertmgr-lock-visibility"></div>
                    <div class="alertmgr-wrapper">
                        <div class="alertmgr-message-wrapper">
                            <div class="alertmgr-message-content"></div>
                        </div>
                        <div class="alertmgr-btns-wrapper"></div>
                    </div>
                </div>
            </section>
        `
	}

	static _updateBtnsView() {
		let htmlString = ``
		this._btns.forEach((item, index) => {
			htmlString += `
                <button data-btn-index=${index} class="alertmgr-btn alertmgr-btn-eventsno alertmgr-${item.type}-btn" data-tagitem="${item.tag}">
                    <span class="alertmgr-btntext">${item.text}</span>
                </button>
            `
		})
		this._btnsWrapperElement.innerHTML = htmlString
	}

	static _bindEvent() {
		this._btnsWrapperElement.addEventListener('touchstart', this._btnsWrapperTouchstartHandler)
		this._btnsWrapperElement.addEventListener('touchend', this._btnsWrapperTouchendHandler)
		this._btnsWrapperElement.addEventListener('mousedown', this._btnsWrapperMousedownHandler)
		this._btnsWrapperElement.addEventListener('mouseup', this._btnsWrapperMouseupHandler)
		this._containerElemeent.addEventListener('contextmenu', this._containerContextmenuHandler)
		this._wrapperElement.addEventListener('transitionstart', this._transitionsTransitionstartHandler)
		this._wrapperElement.addEventListener('transitionend', this._transitionsTransitionendHandler)
		this._lockElement.addEventListener('transitionstart', this._transitionsTransitionstartHandler)
		this._lockElement.addEventListener('transitionend', this._transitionsTransitionendHandler)
		window.addEventListener('resize', this._updateContainerClientRect)
	}

	static _doCallback(targetElement) {
		if (this._callback && !this._isFlushCallback) {
			window.setTimeout(() => {
				this._isFlushCallback = true
				this._callback.call(this, targetElement.getAttribute('data-tagitem'))
			}, 100)
		}
	}

	static _btnsWrapperTouchstartHandler(e) {
		e.preventDefault()
		const targetElement = __AlertFindTargetByClassName(e.target, 'alertmgr-btn')
		if (targetElement) {
			targetElement.classList.add('alertmgr-btn-active')
		}
		const toucher0 = e.changedTouches[0]
		this._pointerdownX = toucher0.clientX
		this._pointerdownY = toucher0.clientY
		this._isPointerdown = true
	}

	static _btnsWrapperTouchendHandler(e) {
		e.preventDefault()
		if (!this._isPointerdown) {
			return
		}
		const targetElement = __AlertFindTargetByClassName(e.target, 'alertmgr-btn')
		const toucher0 = e.changedTouches[0]
		if (Math.abs(toucher0.clientX - this._pointerdownX) < 8 && Math.abs(toucher0.clientY - this._pointerdownY) < 8) {
			targetElement && this._doCallback(targetElement)
		}
		this._isPointerdown = false
		window.setTimeout(() => {
			targetElement.classList.remove('alertmgr-btn-active')
		}, 100)
	}

	static _btnsWrapperMousedownHandler(e) {
		e.preventDefault()
		if (e.button !== 0) {
			return
		}
		const targetElement = __AlertFindTargetByClassName(e.target, 'alertmgr-btn')
		if (targetElement) {
			targetElement.classList.add('alertmgr-btn-active')
		}
		this._pointerdownX = e.clientX
		this._pointerdownY = e.clientY
		this._isPointerdown = true
	}

	static _btnsWrapperMouseupHandler(e) {
		e.preventDefault()
		if (e.button !== 0 || !this._isPointerdown) {
			return
		}
		const targetElement = __AlertFindTargetByClassName(e.target, 'alertmgr-btn')
		if (Math.abs(e.clientX - this._pointerdownX) < 8 && Math.abs(e.clientY - this._pointerdownY) < 8) {
			targetElement && this._doCallback(targetElement)
		}
		this._isPointerdown = false
		window.setTimeout(() => {
			targetElement.classList.remove('alertmgr-btn-active')
		}, 100)
	}

	static _containerContextmenuHandler(e) {
		e.preventDefault()
	}

	static _transitionsTransitionstartHandler(e) {
		/* ... */
	}

	static _transitionsTransitionendHandler(e) {
		if (e.target === this._lockElement) {
			this._lockElement.classList.remove('alertmgr-transition-duringshort')
		}
		if (e.target === this._wrapperElement) {
			this._wrapperElement.classList.remove('alertmgr-transition-duringshort')
			Array.from(this._btnsWrapperElement.querySelectorAll('button')).forEach(item => {
				item.classList.remove('alertmgr-btn-eventsno')
			})
		}
	}

	static _updateContainerClientRect() {
		this._containerElemeent.style.width = `${window.innerWidth}px`
		this._containerElemeent.style.height = `${window.innerHeight}px`
	}
}
