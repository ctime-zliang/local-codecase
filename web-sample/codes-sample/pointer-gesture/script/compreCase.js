;(function (sectionElement) {
	const imageViewContainerElement = sectionElement.querySelector('[data-tagitem="imageViewContainer"]')
	const pointerListElement = sectionElement.querySelector('[data-tagitem="pointer-list"]')
	const transformValueElement = sectionElement.querySelector('[data-tagitem="transform-value"]')
	const viewportRectElement = sectionElement.querySelector('[data-tagitem="viewport-rect"]')
	const imageNaturalRectElement = sectionElement.querySelector('[data-tagitem="image-natural-rect"]')
	const imageScaleRectElement = sectionElement.querySelector('[data-tagitem="image-scale-rect"]')

	class TransfromManager {
		static _scale = 1
		static _rotate = 0
		static _translateX = 0
		static _translateY = 0
		static _translateZ = 5

		static set scale(value) {
			this._scale = value
		}
		static get scale() {
			return this._scale
		}

		static set rotate(value) {
			this._rotate = value
		}
		static get rotate() {
			return this._rotate
		}

		static set translateX(value) {
			this._translateX = value
		}
		static get translateX() {
			return this._translateX
		}

		static set translateY(value) {
			this._translateY = value
		}
		static get translateY() {
			return this._translateY
		}

		static set translateZ(value) {
			this._translateZ = value
		}
		static get translateZ() {
			return this._translateZ
		}

		static setTransitionStyle(targetElement, use = false) {
			if (!use) {
				targetElement.style.transition = 'none'
				return
			}
			targetElement.style.transition = 'transform .3s ease'
		}

		static applyTransfromStyle(targetElement) {
			const transform = `translate3d(${this.translateX}px, ${this._translateY}px, ${this._translateZ}px) scale(${this._scale}) rotate(${this._rotate}deg)`
			targetElement.style.transform = transform
		}

		static updateTransformTextContent(targetElement) {
			const transform = `translate3d(${this.translateX}px, ${this._translateY}px, ${this._translateZ}px) scale(${this._scale}) rotate(${this._rotate}deg)`
			targetElement.textContent = transform
		}
	}

	const profile = {
		maxScale: 3,
		minScale: 1,
		maxWheelScale: 16,
		minWheelScale: 0.1,
		pointerdownTarget: null,
		imageSrc: document.getElementById(`fullcaseImageAnchor`).getAttribute('data-src'),
	}
	const initImageDOM = async () => {
		return new Promise(_ => {
			const imageElement = new Image()
			imageElement.onload = function (e) {
				_({ width: this.width, height: this.height, image: this })
			}
			imageElement.style.opacity = '0'
			imageElement.src = profile.imageSrc
			imageViewContainerElement.appendChild(imageElement)
		})
	}
	const initImageSize = imageElement => {
		const sizeResult = ven$zoomImageByContainer(imageElement.width, imageElement.height, profile.viewportWidth, profile.viewportHeight)
		imageElement.style.height = `${sizeResult.height}px`
		imageElement.style.width = `${sizeResult.width}px`
		imageElement.style.opacity = '1'
		TransfromManager.setTransitionStyle(imageElement, false)
		TransfromManager.applyTransfromStyle(imageElement)
		TransfromManager.updateTransformTextContent(transformValueElement)
		return sizeResult
	}
	const updateTextContent = () => {
		viewportRectElement.textContent = `${profile.viewportWidth} x ${profile.viewportHeight}`
		imageNaturalRectElement.textContent = `${profile.naturalWidth} x ${profile.naturalHeight}`
		imageScaleRectElement.textContent = `${profile.width} x ${profile.height}`
	}
	const init = async () => {
		profile.viewportWidth = document.documentElement.clientWidth
		profile.viewportHeight = document.documentElement.clientHeight
		const imageLoadRes = await initImageDOM()
		const sizeResult = initImageSize(imageLoadRes.image)
		Object.keys(sizeResult).forEach(item => {
			profile[item] = sizeResult[item]
		})
		profile.maxScale = 1 / profile.containerScale

		updateTextContent()
		bindEvent(imageLoadRes.image)

		console.log(profile)
	}
	const bindEvent = imageElement => {
		xGesture.attach(imageElement.parentElement, {
			preventDefaultOnPointerdown: true,
			onWheel(evte, { scale, clientX, clientY }, gesture) {
				evte.preventDefault()
				const offsetX = clientX - profile.containerWidth / 2
				const offsetY = clientY - profile.containerHeight / 2
				const translateOffsetX = offsetX / TransfromManager.scale - TransfromManager.translateX / TransfromManager.scale
				const translateOffsetY = offsetY / TransfromManager.scale - TransfromManager.translateY / TransfromManager.scale
				TransfromManager.scale *= scale
				if (TransfromManager.scale > profile.maxWheelScale) {
					TransfromManager.scale = profile.maxWheelScale
				} else if (TransfromManager.scale < profile.minWheelScale) {
					TransfromManager.scale = profile.minWheelScale
				}
				TransfromManager.translateX = -1 * (translateOffsetX * TransfromManager.scale - offsetX)
				TransfromManager.translateY = -1 * (translateOffsetY * TransfromManager.scale - offsetY)
				TransfromManager.setTransitionStyle(imageElement, true)
				TransfromManager.applyTransfromStyle(imageElement)
				TransfromManager.updateTransformTextContent(transformValueElement)
			},
			onContextmenu(evte, { clientX, clientY }, gesture) {
				evte.preventDefault()
			},
			onPointerdown(evte, { clientX, clientY }, gesture) {
				profile.pointerdownTarget = evte.target
				updatePointersPositionShow(gesture.getAllPointers())
			},
			onPointermove(evte, { clientX, clientY }, gesture) {
				updatePointersPositionShow(gesture.getAllPointers())
			},
			onPointerup(evte, { clientX, clientY }, gesture) {
				profile.pointerdownTarget = null
				updatePointersPositionShow(gesture.getAllPointers())
			},
			onDragMove(evte, { movePosition, moveDirection, distX, distY, diffX, diffY, clientX, clientY }, gesture) {
				if (profile.pointerdownTarget !== imageElement) {
					return
				}
				TransfromManager.translateX += diffX
				TransfromManager.translateY += diffY
				TransfromManager.setTransitionStyle(imageElement, false)
				TransfromManager.applyTransfromStyle(imageElement)
				TransfromManager.updateTransformTextContent(transformValueElement)
			},
			onLongTap(evte, { clientX, clientY }, gesture) {
				if (profile.pointerdownTarget !== imageElement) {
					return
				}
				Ven$AlertManager.setBtns([Ven$AlertManager.defaultConfirmBtn, Ven$AlertManager.defaultCancelBtn]).open(
					'还原图片状态?',
					function (tag) {
						if (tag === 'confirm') {
							TransfromManager.rotate = 0
							TransfromManager.scale = 1
							TransfromManager.translateX = 0
							TransfromManager.translateY = 0
							TransfromManager.setTransitionStyle(imageElement, true)
							TransfromManager.applyTransfromStyle(imageElement)
							TransfromManager.updateTransformTextContent(transformValueElement)
						}
						this.close()
					}
				)
			},
			onDoubleTap(evte, { clientX, clientY }, gesture) {
				if (profile.pointerdownTarget !== imageElement) {
					return
				}
				const offsetX = clientX - profile.containerWidth / 2
				const offsetY = clientY - profile.containerHeight / 2
				const translateOffsetX = offsetX / TransfromManager.scale - TransfromManager.translateX / TransfromManager.scale
				const translateOffsetY = offsetY / TransfromManager.scale - TransfromManager.translateY / TransfromManager.scale
				if (TransfromManager.scale <= 1) {
					TransfromManager.scale = profile.maxScale
					if (profile.benchmark === 'width') {
						TransfromManager.translateX = -1 * (translateOffsetX * TransfromManager.scale)
						const movePositiveMax = (profile.containerWidth / 2) * TransfromManager.scale - profile.containerWidth / 2
						const moveNegativeMax = -1 * movePositiveMax
						if (TransfromManager.translateX >= movePositiveMax) {
							TransfromManager.translateX = movePositiveMax
						}
						if (TransfromManager.translateX <= moveNegativeMax) {
							TransfromManager.translateX = moveNegativeMax
						}
						TransfromManager.translateY = 0
					} else if (profile.benchmark === 'height') {
						TransfromManager.translateY = -1 * (translateOffsetY * TransfromManager.scale)
						const movePositiveMax = (profile.containerHeight / 2) * TransfromManager.scale - profile.containerHeight / 2
						const moveNegativeMax = -1 * movePositiveMax
						if (TransfromManager.translateY >= movePositiveMax) {
							TransfromManager.translateY = movePositiveMax
						}
						if (TransfromManager.translateY <= moveNegativeMax) {
							TransfromManager.translateY = moveNegativeMax
						}
						TransfromManager.translateX = 0
					}
				} else {
					TransfromManager.scale = 1
					TransfromManager.translateX = 0
					TransfromManager.translateY = 0
				}
				TransfromManager.setTransitionStyle(imageElement, true)
				TransfromManager.applyTransfromStyle(imageElement)
				TransfromManager.updateTransformTextContent(transformValueElement)
			},
			onRotate(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
				console.log({ rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
				TransfromManager.rotate = (TransfromManager.rotate + rotate) % 360
				TransfromManager.setTransitionStyle(imageElement, false)
				TransfromManager.applyTransfromStyle(imageElement)
				TransfromManager.updateTransformTextContent(transformValueElement)
			},
			onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
				console.log({ scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
				TransfromManager.scale *= scale
				if (TransfromManager.scale > profile.maxWheelScale) {
					TransfromManager.scale = profile.maxWheelScale
				} else if (TransfromManager.scale < profile.minWheelScale) {
					TransfromManager.scale = profile.minWheelScale
				}
				TransfromManager.setTransitionStyle(imageElement, false)
				TransfromManager.applyTransfromStyle(imageElement)
				TransfromManager.updateTransformTextContent(transformValueElement)
			},
		})
	}
	const updatePointersPositionShow = allPointers => {
		let htmlStringArray = []
		allPointers.forEach(item => {
			htmlStringArray.push(`<span>[${item.clientX}, ${item.clientY}]</span>`)
		})
		if (!htmlStringArray.length) {
			pointerListElement.innerHTML = `-`
			return
		}
		pointerListElement.innerHTML = htmlStringArray.join(', ')
	}

	init()
})(globalContainerElement.querySelector('[data-tagitem="fullcaseContainer"]'))
