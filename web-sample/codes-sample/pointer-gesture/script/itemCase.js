/****************************** ******************************/
/****************************** ******************************/
/** Pointer Down ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

	let eventCount = 0
	let styleUpdateTimer = null
	xGesture.attach(gestureElement, {
		onPointerdown(evte, { clientX, clientY }, gesture) {
			console.log(evte, { clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			countElement.textContent = ++eventCount
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 200)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="pointerdown"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Pointer Up ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

	let eventCount = 0
	let styleUpdateTimer = null
	xGesture.attach(gestureElement, {
		onPointerup(evte, { clientX, clientY }, gesture) {
			console.log(evte, { clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			countElement.textContent = ++eventCount
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 200)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="pointerup"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Pointer Move ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-y"]')
	const xRelativeElement = sectionElement.querySelector('[data-tagitem="relative-x"]')
	const yRelativeElement = sectionElement.querySelector('[data-tagitem="relative-y"]')

	let styleUpdateTimer = null
	let gestureElementRect = null
	xGesture.attach(gestureElement, {
		onPointermove(evte, { clientX, clientY }, gesture) {
			evte.preventDefault()
			console.log({ clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			gestureElementRect = gestureElement.getBoundingClientRect()
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			xRelativeElement.textContent = clientX - gestureElementRect.left
			yRelativeElement.textContent = clientY - gestureElementRect.top
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 150)
		},
		onPpointercancel(evte, { clientX, clientY }, gesture) {
			console.log({ clientX, clientY })
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="pointermove"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

	const rippleAnimationEndHandler = e => {
		e.currentTarget.removeEventListener('animationend', rippleAnimation)
		e.currentTarget.parentNode.removeChild(e.currentTarget)
	}
	const rippleAnimation = e => {
		let evte = e
		if (typeof e.changedTouches !== 'undefined') {
			evte = e.changedTouches[0]
		}
		const target = ven$findTargetByClassName2(e.target, 'gesture-interactive')
		if (!target) {
			return
		}
		const btnClientWidth = target.offsetWidth
		const spanElement = document.createElement('span')
		const targetClientRect = target.getBoundingClientRect()
		const x = evte.pageX - targetClientRect.left - btnClientWidth / 2
		const y = evte.pageY - targetClientRect.top - btnClientWidth / 2
		if (target.firstChild) {
			target.insertBefore(spanElement, target.firstChild)
		} else {
			target.appendChild(spanElement)
		}
		spanElement.classList.add('common-ripple')
		spanElement.addEventListener('animationend', rippleAnimationEndHandler)
		spanElement.style.cssText = `width: ${btnClientWidth}px; height: ${btnClientWidth}px; top: ${y}px; left: ${x}px`
		spanElement.classList.add('common-ripple-animation')
	}

	let eventCount = 0
	xGesture.attach(gestureElement, {
		onTap(evte, { clientX, clientY }, gesture) {
			console.log({ clientX, clientY })
			countElement.textContent = ++eventCount
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			rippleAnimation(evte)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="tap"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Long Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

	let eventCount = 0
	let styleUpdateTimer = null
	xGesture.attach(gestureElement, {
		onLongTap(evte, { clientX, clientY }, gesture) {
			evte.preventDefault()
			console.log({ clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			countElement.textContent = ++eventCount
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			Ven$AlertManager.open(`触发了 longTap 事件`, {
				btns: [Ven$AlertManager.defaultConfirmBtn, Ven$AlertManager.defaultCancelBtn],
				callback(tag) {
					console.log(tag)
					this.close()
				},
			})
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 200)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="longtap"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Double Tap ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const countElement = sectionElement.querySelector('[data-tagitem="event-count"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="event-absolute-y"]')

	let eventCount = 0
	let styleUpdateTimer = null
	xGesture.attach(gestureElement, {
		preventDefaultOnPointerdown: true,
		onDoubleTap(evte, { clientX, clientY }, gesture) {
			evte.preventDefault()
			console.log({ clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			countElement.textContent = ++eventCount
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 200)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="doubletap"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Drag Move ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const xAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-x"]')
	const yAbsoluteElement = sectionElement.querySelector('[data-tagitem="absolute-y"]')
	const xRelativeElement = sectionElement.querySelector('[data-tagitem="relative-x"]')
	const yRelativeElement = sectionElement.querySelector('[data-tagitem="relative-y"]')
	const xSpeedElement = sectionElement.querySelector('[data-tagitem="speed-x"]')
	const ySpeedElement = sectionElement.querySelector('[data-tagitem="speed-y"]')
	const positionMoveElement = sectionElement.querySelector('[data-tagitem="move-position"]')
	const directionMoveElement = sectionElement.querySelector('[data-tagitem="move-direction"]')
	const xDistElement = sectionElement.querySelector('[data-tagitem="dist-x"]')
	const yDistElement = sectionElement.querySelector('[data-tagitem="dist-y"]')

	let styleUpdateTimer = null
	let gestureElementRect = null
	xGesture.attach(gestureElement, {
		onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
			evte.preventDefault()
			console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			gestureElementRect = gestureElement.getBoundingClientRect()
			xAbsoluteElement.textContent = clientX
			yAbsoluteElement.textContent = clientY
			xRelativeElement.textContent = clientX - gestureElementRect.left
			yRelativeElement.textContent = clientY - gestureElementRect.top
			xSpeedElement.textContent = diffX
			ySpeedElement.textContent = diffY
			positionMoveElement.textContent = movePosition
			directionMoveElement.textContent = moveDirection
			xDistElement.textContent = distX
			yDistElement.textContent = distY
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 150)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="dragmove"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Swipe ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	class SwipeManager {
		static translateX = 0
		static swipeContainerElement = null
		static swipeItemElements = []
		static swipeItemTranlsteXMap = {}
		static STATUS_OPEN = 'open'
		static STATUS_CLOSE = 'close'
		static leftEndPoint = -150
		static moveDirection = undefined

		static init(swipeContainerElement) {
			this.swipeContainerElement = swipeContainerElement
			this.swipeItemElements = this.swipeContainerElement.querySelectorAll('.swiper-item')
			Array.from(this.swipeItemElements).forEach(itemElement => {
				this.initItemElement(itemElement)
			})
		}

		static initItemElement(itemElement) {
			const id = `list${Math.random()}`
			itemElement.setAttribute('id', id)
			itemElement.id = id
			this.swipeItemTranlsteXMap[id] = {
				setting: 0,
				rightEndPoint: 0,
				leftEndPoint: this.leftEndPoint,
				status: this.STATUS_CLOSE,
			}
			this.applyTransfromStyle(itemElement)
			this.bindEvent(itemElement)
		}

		static updateStyle(itemElement, attr, value) {
			itemElement.style[attr] = value
		}

		static setTransitionStyle(itemElement, use = false) {
			if (!use) {
				itemElement.style.transition = 'none'
				return
			}
			itemElement.style.transition = 'transform .2s ease'
		}

		static applyTransfromStyle(itemElement) {
			const tranlsteXItemData = this.swipeItemTranlsteXMap[itemElement.id]
			if (!tranlsteXItemData) {
				return
			}
			itemElement.style.transform = `translate3d(${tranlsteXItemData.setting}px, 0, 5px)`
		}

		static bindEvent(itemElement) {
			const self = this
			xGesture.attach(itemElement, {
				onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
					console.log({ movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY })
					if (!self.moveDirection) {
						self.moveDirection = moveDirection
					}
					if (self.moveDirection === xGesture.defined.DIRECTION_UP || self.moveDirection === xGesture.defined.DIRECTION_DOWN) {
						return
					}
					if (evte.cancelable) {
						evte.preventDefault()
					}
					const currentTarget = itemElement
					const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
					tranlsteXItemData.setting += diffX
					if (tranlsteXItemData.setting > tranlsteXItemData.rightEndPoint) {
						tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
					} else if (tranlsteXItemData.setting < tranlsteXItemData.leftEndPoint) {
						tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
					}
					self.setTransitionStyle(currentTarget, false)
					self.applyTransfromStyle(currentTarget)
				},
				onSwipe(evte, { direction, distX, distY, releaseX, releaseY }, gesture) {
					console.log({ direction, distX, distY, releaseX, releaseY })
					if (self.moveDirection === xGesture.defined.DIRECTION_UP || self.moveDirection === xGesture.defined.DIRECTION_DOWN) {
						self.moveDirection = undefined
						return
					}
					if (evte.cancelable) {
						evte.preventDefault()
					}
					const currentTarget = itemElement
					const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
					if (direction === xGesture.defined.DIRECTION_RIGHT) {
						tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
						tranlsteXItemData.status = self.STATUS_CLOSE
					} else if (direction === xGesture.defined.DIRECTION_LEFT) {
						tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
						tranlsteXItemData.status = self.STATUS_OPEN
					}
					self.moveDirection = undefined
					self.setTransitionStyle(currentTarget, true)
					self.applyTransfromStyle(currentTarget)
				},
				onPointerup(evte, { clientX, clientY }, gesture) {
					console.log({ clientX, clientY })
					const currentTarget = itemElement
					const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
					if (
						tranlsteXItemData.setting === tranlsteXItemData.rightEndPoint ||
						tranlsteXItemData.setting === tranlsteXItemData.leftEndPoint
					) {
						return
					}
					if (tranlsteXItemData.status === self.STATUS_OPEN) {
						if (tranlsteXItemData.setting < tranlsteXItemData.rightEndPoint - 40) {
							tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
						} else {
							tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
						}
					} else if (tranlsteXItemData.status === self.STATUS_CLOSE) {
						if (tranlsteXItemData.setting > tranlsteXItemData.leftEndPoint + 40) {
							tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
						} else {
							tranlsteXItemData.setting = tranlsteXItemData.leftEndPoint
						}
					} else {
						tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
						tranlsteXItemData.status = self.STATUS_CLOSE
					}
					self.moveDirection = undefined
					self.setTransitionStyle(currentTarget, true)
					self.applyTransfromStyle(currentTarget)
				},
				onPpointercancel(evte, { clientX, clientY }, gesture) {
					console.log({ clientX, clientY })
					const currentTarget = itemElement
					const tranlsteXItemData = self.swipeItemTranlsteXMap[currentTarget.id]
					tranlsteXItemData.setting = tranlsteXItemData.rightEndPoint
					self.moveDirection = undefined
					self.setTransitionStyle(currentTarget, true)
					self.applyTransfromStyle(currentTarget)
				},
			})
		}
	}

	SwipeManager.init(sectionElement.querySelector('.swiper-container'))
})(globalContainerElement.querySelector('[data-tagitem="swipe"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Wheel ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
	const scaleValueElement = sectionElement.querySelector('[data-tagitem="scale-value"]')

	class TransfromManager {
		static _scale = 1

		static set scale(value) {
			this._scale = value
		}
		static get scale() {
			return this._scale
		}

		static setTransitionStyle(targetElement, use = false) {
			if (!use) {
				targetElement.style.transition = 'none'
				return
			}
			targetElement.style.transition = 'transform .15s ease'
		}

		static applyTransfromStyle(targetElement) {
			const transform = `scale(${this._scale})`
			targetElement.style.transform = transform
		}

		static updateTextContent(targetElement) {
			targetElement.textContent = this._scale
		}
	}

	TransfromManager.setTransitionStyle(targetImageElement, true)

	let styleUpdateTimer = null
	let maxScale = 10
	let minScale = 0.1
	xGesture.attach(gestureElement, {
		onWheel(evte, { scale, clientX, clientY }, gesture) {
			console.log({ scale, clientX, clientY })
			evte.preventDefault()
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			TransfromManager.scale *= scale
			if (TransfromManager.scale > maxScale) {
				TransfromManager.scale = maxScale
			} else if (TransfromManager.scale < minScale) {
				TransfromManager.scale = minScale
			}
			TransfromManager.applyTransfromStyle(targetImageElement)
			TransfromManager.updateTextContent(scaleValueElement)
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 150)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="wheel"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Pinch ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
	const pinchValueElement = sectionElement.querySelector('[data-tagitem="pinch-value"]')
	const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
	const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
	const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
	const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
	const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
	const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

	class TransfromManager {
		static _scale = 1

		static set scale(value) {
			this._scale = value
		}
		static get scale() {
			return this._scale
		}

		static setTransitionStyle(targetElement, use = false) {
			if (!use) {
				targetElement.style.transition = 'none'
				return
			}
			targetElement.style.transition = 'transform .15s ease'
		}

		static applyTransfromStyle(targetElement) {
			const transform = `scale(${this._scale})`
			targetElement.style.transform = transform
		}

		static updateTextContent(targetElement) {
			targetElement.textContent = this._scale
		}
	}

	TransfromManager.setTransitionStyle(targetImageElement, false)

	let styleUpdateTimer = null
	let maxWScale = 10
	let minScale = 0.1
	xGesture.attach(gestureElement, {
		preventDefaultOnDoublePointersdown: true,
		onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
			console.log({ scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			xCenterElement.textContent = centerX
			yCenterElement.textContent = centerY
			xPoiner1Element.textContent = pointA.x
			yPoiner1Element.textContent = pointA.y
			xPoiner2Element.textContent = pointB.x
			yPoiner2Element.textContent = pointB.y
			TransfromManager.scale *= scale
			if (TransfromManager.scale > maxWScale) {
				TransfromManager.scale = maxWScale
			} else if (TransfromManager.scale < minScale) {
				TransfromManager.scale = minScale
			}
			TransfromManager.applyTransfromStyle(targetImageElement)
			TransfromManager.updateTextContent(pinchValueElement)
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 150)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="pinch"]'))

/****************************** ******************************/
/****************************** ******************************/
/** Rotate ***/
/****************************** ******************************/
/****************************** ******************************/
;(function (sectionElement) {
	const gestureElement = sectionElement.querySelector('[data-tagitem="gesture"]')
	const targetImageElement = sectionElement.querySelector('[data-tagitem="target-image"]')
	const rotateValueElement = sectionElement.querySelector('[data-tagitem="rotate-value"]')
	const xCenterElement = sectionElement.querySelector('[data-tagitem="center-x"]')
	const yCenterElement = sectionElement.querySelector('[data-tagitem="center-y"]')
	const xPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-x"]')
	const yPoiner1Element = sectionElement.querySelector('[data-tagitem="pointer1-y"]')
	const xPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-x"]')
	const yPoiner2Element = sectionElement.querySelector('[data-tagitem="pointer2-y"]')

	class TransfromManager {
		static _rotate = 1

		static set rotate(value) {
			this._rotate = value
		}
		static get rotate() {
			return this._rotate
		}

		static setTransitionStyle(targetElement, use = false) {
			if (!use) {
				targetElement.style.transition = 'none'
				return
			}
			targetElement.style.transition = 'transform .15s ease'
		}

		static applyTransfromStyle(targetElement) {
			const transform = `rotate(${this._rotate}deg)`
			targetElement.style.transform = transform
		}

		static updateTextContent(targetElement) {
			targetElement.textContent = this._rotate
		}
	}

	TransfromManager.setTransitionStyle(targetImageElement, false)

	let styleUpdateTimer = null
	xGesture.attach(gestureElement, {
		preventDefaultOnDoublePointersdown: true,
		onRotate(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
			console.log({ rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
			window.clearTimeout(styleUpdateTimer)
			gestureElement.classList.add(interactiveSelectedClassname)
			xCenterElement.textContent = centerX
			yCenterElement.textContent = centerY
			xPoiner1Element.textContent = pointA.x
			yPoiner1Element.textContent = pointA.y
			xPoiner2Element.textContent = pointB.x
			yPoiner2Element.textContent = pointB.y
			TransfromManager.rotate = (TransfromManager.rotate + rotate) % 360
			TransfromManager.applyTransfromStyle(evte.currentTarget)
			TransfromManager.updateTextContent(rotateValueElement)
			styleUpdateTimer = window.setTimeout(() => {
				gestureElement.classList.remove(interactiveSelectedClassname)
			}, 150)
		},
	})
})(globalContainerElement.querySelector('[data-tagitem="rotate"]'))
