/* 参考引用 Github 源码 */

;(function () {
	'use strict'

	const DIRECTION_UP = 'UP'
	const DIRECTION_DOWN = 'DOWN'
	const DIRECTION_LEFT = 'LEFT'
	const DIRECTION_RIGHT = 'RIGHT'

	const POINTER_ITEM_ADD = 'POINTER_ITEM_ADD'
	const POINTER_ITEM_UPDATE = 'POINTER_ITEM_UPDATE'
	const POINTER_ITEM_DELETE = 'POINTER_ITEM_DELETE'

	const TOUCH_EVENT = 'TOUCH_EVENT'
	const MOUSE_EVENT = 'MOUSE_EVENT'

	const DEFAULT_GUEST_OPTIONS = {
		/**
		 * wheel 放大倍率
		 */
		zoomInWheelRatio: 1.1,
		/**
		 * wheel 缩小倍率
		 */
		zoomOutWheelRatio: 1 / 1.1,
		/**
		 * onLongTap 触发的延迟时间设置
		 */
		delayOfLongTapDispatch: 500,
		/**
		 * 当存在至少一个指针按下时设置阻止默认事件
		 */
		preventDefaultOnPointerdown: false,
		/**
		 * 当存在两个指针按下时设置阻止默认事件
		 */
		preventDefaultOnDoublePointersdown: false,
	}

	function createProfile() {
		return {
			longTapTimeout: null,
			isPointerdown: false,
			/**
			 * 单指情形下
			 *      指针按下次数的计数器
			 */
			tapCount: 0,
			tapCountRestTimer: null,
			/**
			 * 指针数组
			 *      指针事件存储队列
			 *      会在指针移动过程中更新指定序列的指针事件对象
			 */
			pointers: [],
			/**
			 * 指针按下时记录的坐标列表
			 *      增量记录每一次 pointer-down 触发时时的指针采样坐标
			 *      在 pointer-move 触发时将实时更新列表内指定 pointerId 对应的坐标值
			 *      在 pointer-up 触发时将删除对应的坐标项
			 */
			dotsRecordInPointerdown: [],
			lastDotsRecordInPointerdown: [],
			/**
			 * 单指情形下
			 *      增量记录每一次 pointer-move 触发时的指针采样坐标
			 *      达到阈值时将触发 swipe 封装手势回调
			 */
			dotsRecordInPointermove: [],
			/**
			 * 单指情形下
			 *      dotsRecordInPointermove 保存记录的最大长度
			 */
			maxLengthDotsRecordInPointermove: 30,
			/**
			 * 单指情形下
			 *      单次记录 pointer-down/pointer-move/pointer-up 触发时的指针采样坐标
			 *      在每一次 pointer-move 触发时, 与之前记录的指针坐标做对比计算, 即可计算出指针移动的距离和方向
			 */
			pointerPositionCache: { x: 0, y: 0 },
			/**
			 * 单指情形下
			 *      pointer 移动方位
			 *      在任意时刻, 指针坐标相对于 pointer-down 按下时的坐标的方位
			 */
			movePositionRange: '',
			/**
			 * 单指情形下
			 *      pointer 移动方向
			 */
			moveDirection: '',
			/**
			 * 多指情形下
			 *      单次记录 pointer-down/pointer-move 触发时多指的几何中心坐标
			 *      在 pointer-up 触发时, 如果当前 pointer 个数不足 2, 直接重置该标记值
			 */
			centerPositionCacheOfMultiPointers: { x: 0, y: 0 },
			/**
			 * 单指情形下
			 *      当前指针的采样坐标与指针按下时记录的坐标的位置偏移量
			 */
			offsetRectAtPointerdown: { x: 0, y: 0 },
			lastOffsetRectAtPointerdown: { x: 0, y: 0 },
			/**
			 * 事件触发类型
			 */
			triggerEventType: undefined,
		}
	}
	function Gesture(host, options) {
		this.containerElements = []
		if (typeof host === 'string') {
			this.containerElements = Array.from(document.querySelectorAll(host))
		} else {
			this.containerElements = Array.from(typeof host.length !== 'undefined' ? host : [host])
		}
		this.options = Object.assign({}, DEFAULT_GUEST_OPTIONS, options)
		this._$profile = createProfile()
		this.init()
	}

	Gesture.prototype.init = function () {
		this._handlePointerdownEvent = this.handlePointerdownEvent.bind(this)
		this._handlePointermoveEvent = this.handlePointermoveEvent.bind(this)
		this._handlePointerupEvent = this.handlePointerupEvent.bind(this)
		this._handlePointercancelEvent = this.handlePointercancelEvent.bind(this)
		this._handleWheelEvent = this.handleWheelEvent.bind(this)
		this._handleContextmenuEvent = this.handleContextmenuEvent.bind(this)
		this.bindEvent()
	}

	Gesture.prototype.destory = function () {
		this.unBindEvent()
	}

	Gesture.prototype.getAllPointers = function () {
		return this._$profile.pointers
	}

	Gesture.prototype.onPointerdown = function (callback) {
		this.options.onPointerdown = callback
		return this
	}

	Gesture.prototype.onPointerup = function (callback) {
		this.options.onPointerup = callback
		return this
	}

	Gesture.prototype.onPointermove = function (callback) {
		this.options.onPointermove = callback
		return this
	}

	Gesture.prototype.onPpointercancel = function (callback) {
		this.options.onPpointercancel = callback
		return this
	}

	Gesture.prototype.onTap = function (callback) {
		this.options.onTap = callback
		return this
	}

	Gesture.prototype.onLongTap = function (callback) {
		this.options.onLongTap = callback
		return this
	}

	Gesture.prototype.onDoubleTap = function (callback) {
		this.options.preventDefaultOnPointerdown = true
		this.options.onDoubleTap = callback
		return this
	}

	Gesture.prototype.onDragMove = function (callback) {
		this.options.onDragMove = callback
		return this
	}

	Gesture.prototype.onWheel = function (callback) {
		this.options.onWheel = callback
		return this
	}

	Gesture.prototype.onSwipe = function (callback) {
		this.options.onSwipe = callback
		return this
	}

	Gesture.prototype.onPinch = function (callback) {
		this.options.onPinch = callback
		return this
	}

	Gesture.prototype.onRotate = function (callback) {
		this.options.onRotate = callback
		return this
	}

	/****************************** ******************************/
	/****************************** ******************************/
	/****************************** ******************************/

	Gesture.prototype.getLastOnePointerEvent = function () {
		const { pointers } = this._$profile
		if (pointers.length) {
			return pointers[pointers.length - 1]
		}
		return {
			clientX: -1,
			clientY: -1,
			pageX: -1,
			pageY: -1,
			radiusX: -1,
			radiusY: -1,
			screenX: -1,
			screenY: -1,
			rotationAngle: 0,
			identifier: -1,
		}
	}

	Gesture.prototype.getCenter = function (pointA, pointB) {
		return { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 }
	}

	Gesture.prototype.getDistance = function (pointA, pointB) {
		return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y)
	}

	Gesture.prototype.getAngle = function (pointA, pointB) {
		return (Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI
	}

	Gesture.prototype.updatePointers = function (evte, type) {
		const _$profile = this._$profile
		const touches = Array.from(evte.touches || [])
		const changedTouches = Array.from(evte.changedTouches || [])
		evte.pointerId = typeof evte.pointerId === 'undefined' && touches.length <= 0 && changedTouches.length <= 0 ? 1 : evte.pointerId
		if (type === POINTER_ITEM_ADD) {
			if (typeof evte.pointerId !== 'undefined') {
				_$profile.pointers.push(evte)
				return
			}
			_$profile.pointers.length = 0
			for (let i = 0; i < touches.length; i++) {
				_$profile.pointers.push(touches[i])
			}
			return
		}
		if (type === POINTER_ITEM_UPDATE) {
			for (let i = 0; i < _$profile.pointers.length; i++) {
				if (typeof evte.pointerId !== 'undefined') {
					if (_$profile.pointers[i].pointerId === evte.pointerId) {
						_$profile.pointers[i] = evte
						break
					}
					continue
				}
				_$profile.pointers[i] = touches[i]
			}
			return
		}
		if (type === POINTER_ITEM_DELETE) {
			for (let i = _$profile.pointers.length - 1; i >= 0; i--) {
				if (typeof evte.pointerId !== 'undefined') {
					if (_$profile.pointers[i].pointerId === evte.pointerId) {
						_$profile.pointers.splice(i, 1)
						break
					}
					continue
				}
				for (let j = 0; j < changedTouches.length; j++) {
					if (_$profile.pointers[i].identifier === changedTouches[j].identifier) {
						_$profile.pointers.splice(i, 1)
					}
				}
			}
			return
		}
	}

	Gesture.prototype.getMovePositionRange = function () {
		const _$profile = this._$profile
		if (Math.abs(_$profile.offsetRectAtPointerdown.x) > Math.abs(_$profile.offsetRectAtPointerdown.y)) {
			return _$profile.offsetRectAtPointerdown.x > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT
		}
		return _$profile.offsetRectAtPointerdown.y > 0 ? DIRECTION_DOWN : DIRECTION_UP
	}

	Gesture.prototype.getMoveDirection = function () {
		const _$profile = this._$profile
		const diffX = _$profile.pointers[0].clientX - _$profile.pointerPositionCache.x
		const diffY = _$profile.pointers[0].clientY - _$profile.pointerPositionCache.y
		if (Math.abs(diffX) > Math.abs(diffY)) {
			return diffX > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT
		}
		return diffY > 0 ? DIRECTION_DOWN : DIRECTION_UP
	}

	Gesture.prototype.handleSwipe = function (evte, lastOnePointerEvent) {
		const _$profile = this._$profile
		const MIN_SWIPE_DISTANCE = 20
		const MAX_TIME_INTERVAL = 200
		let x = 0
		let y = 0
		let swipeDirection = ''
		/**
		 * 指针抬起时, 查找与此刻的时间间隔在 ${MAX_TIME_INTERVAL} 以内的"最早"的坐标记录 PA
		 * 并获取此刻指针坐标与 PA 点的距离
		 */
		let i = 0
		while (
			i <= _$profile.dotsRecordInPointermove.length - 1 &&
			evte.timeStamp - _$profile.dotsRecordInPointermove[i].timeStamp < MAX_TIME_INTERVAL
		) {
			x = lastOnePointerEvent.clientX - _$profile.dotsRecordInPointermove[i].x
			y = lastOnePointerEvent.clientY - _$profile.dotsRecordInPointermove[i].y
			i++
		}
		if (Math.abs(x) > MIN_SWIPE_DISTANCE || Math.abs(y) > MIN_SWIPE_DISTANCE) {
			if (Math.abs(x) > Math.abs(y)) {
				swipeDirection = x > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT
			} else {
				swipeDirection = y > 0 ? DIRECTION_DOWN : DIRECTION_UP
			}
			this.options.onSwipe &&
				this.options.onSwipe.call(
					undefined,
					evte,
					{
						direction: swipeDirection,
						distX: x,
						distY: y,
						releaseX: lastOnePointerEvent.clientX,
						releaseY: lastOnePointerEvent.clientY,
					},
					this
				)
		}
	}

	Gesture.prototype.handlePointerdownEvent = function (evte) {
		if (this.options.preventDefaultOnPointerdown) {
			evte.preventDefault()
		}
		const _$profile = this._$profile
		if (!_$profile.triggerEventType && evte.touches) {
			_$profile.triggerEventType = TOUCH_EVENT
		}
		if ((evte.pointerType === 'mouse' && evte.button !== 0) || (_$profile.triggerEventType && evte.type[0] === 'm')) {
			return
		}
		this.updatePointers(evte, POINTER_ITEM_ADD)
		_$profile.isPointerdown = true
		if (_$profile.pointers.length === 1) {
			document.addEventListener('mousemove', this._handlePointermoveEvent)
			document.addEventListener('mouseup', this._handlePointerupEvent)
			/* ... */
			window.clearTimeout(_$profile.tapCountRestTimer)
			const lastOnePointerEvent = this.getLastOnePointerEvent()
			_$profile.dotsRecordInPointerdown[0] = { x: lastOnePointerEvent.clientX, y: lastOnePointerEvent.clientY }
			_$profile.lastDotsRecordInPointerdown[0] = { x: lastOnePointerEvent.clientX, y: lastOnePointerEvent.clientY }
			/* ... */
			const pointer1 = _$profile.pointers[0]
			const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
			const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
			/* ... */
			_$profile.tapCount++
			_$profile.movePositionRange = ''
			_$profile.moveDirection = ''
			_$profile.dotsRecordInPointermove.length = 0
			_$profile.offsetRectAtPointerdown.x = 0
			_$profile.offsetRectAtPointerdown.y = 0
			_$profile.lastOffsetRectAtPointerdown.x = 0
			_$profile.lastOffsetRectAtPointerdown.y = 0
			_$profile.pointerPositionCache.x = pointer1.clientX
			_$profile.pointerPositionCache.y = pointer1.clientY
			/* ... */
			if (_$profile.tapCount > 1) {
				if (
					Math.abs(dotRecordInPointerdown1.x - lastDotRecordInPointerdown1.x) > 30 ||
					Math.abs(dotRecordInPointerdown1.y - lastDotRecordInPointerdown1.y) > 30
				) {
					_$profile.tapCount = 1
				}
			}
			if (_$profile.tapCount === 1) {
				_$profile.longTapTimeout = window.setTimeout(() => {
					_$profile.tapCount = 0
					this.options.onLongTap &&
						this.options.onLongTap.call(
							undefined,
							evte,
							{
								clientX: dotRecordInPointerdown1.x,
								clientY: dotRecordInPointerdown1.y,
							},
							this
						)
				}, this.options.delayOfLongTapDispatch)
			}
			/* ... */
			_$profile.lastDotsRecordInPointerdown[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
		}
		if (_$profile.pointers.length === 2) {
			if (this.options.preventDefaultOnDoublePointersdown) {
				evte.preventDefault()
			}
			window.clearTimeout(_$profile.longTapTimeout)
			const lastOnePointerEvent = this.getLastOnePointerEvent()
			_$profile.dotsRecordInPointerdown[1] = { x: lastOnePointerEvent.clientX, y: lastOnePointerEvent.clientY }
			_$profile.lastDotsRecordInPointerdown[1] = { x: lastOnePointerEvent.clientX, y: lastOnePointerEvent.clientY }
			/* ... */
			const pointer1 = _$profile.pointers[0]
			const pointer2 = _$profile.pointers[1]
			const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
			const dotRecordInPointerdown2 = _$profile.dotsRecordInPointerdown[1]
			const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
			const lastDotRecordInPointerdown2 = _$profile.lastDotsRecordInPointerdown[1]
			/* ... */
			_$profile.tapCount = 0
			_$profile.lastOffsetRectAtPointerdown.x = _$profile.offsetRectAtPointerdown.x
			_$profile.lastOffsetRectAtPointerdown.y = _$profile.offsetRectAtPointerdown.y
			const center = this.getCenter(dotRecordInPointerdown1, dotRecordInPointerdown2)
			_$profile.centerPositionCacheOfMultiPointers.x = center.x
			_$profile.centerPositionCacheOfMultiPointers.y = center.y
			_$profile.lastDotsRecordInPointerdown[0] = { x: _$profile.pointers[0].clientX, y: _$profile.pointers[0].clientY }
			_$profile.lastDotsRecordInPointerdown[1] = { x: _$profile.pointers[1].clientX, y: _$profile.pointers[1].clientY }
		}
		const lastOnePointerEvent = this.getLastOnePointerEvent()
		this.options.onPointerdown &&
			this.options.onPointerdown.call(
				undefined,
				evte,
				{
					clientX: lastOnePointerEvent.clientX,
					clientY: lastOnePointerEvent.clientY,
				},
				this
			)
	}

	Gesture.prototype.handlePointermoveEvent = function (evte) {
		const _$profile = this._$profile
		if (!_$profile.isPointerdown) {
			return
		}
		this.updatePointers(evte, POINTER_ITEM_UPDATE)
		if (_$profile.pointers.length === 1) {
			const pointer1 = _$profile.pointers[0]
			const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
			const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
			/* ... */
			_$profile.offsetRectAtPointerdown.x = pointer1.clientX - dotRecordInPointerdown1.x + _$profile.lastOffsetRectAtPointerdown.x
			_$profile.offsetRectAtPointerdown.y = pointer1.clientY - dotRecordInPointerdown1.y + _$profile.lastOffsetRectAtPointerdown.y
			_$profile.dotsRecordInPointermove.unshift({
				x: pointer1.clientX,
				y: pointer1.clientY,
				timeStamp: evte.timeStamp,
			})
			if (_$profile.dotsRecordInPointermove.length > _$profile.maxLengthDotsRecordInPointermove) {
				_$profile.dotsRecordInPointermove.pop()
			}
			if (Math.abs(_$profile.offsetRectAtPointerdown.x) >= 3 || Math.abs(_$profile.offsetRectAtPointerdown.y) >= 3) {
				window.clearTimeout(this._$profile.longTapTimeout)
				_$profile.tapCount = 0
				_$profile.movePositionRange = this.getMovePositionRange()
			}
			_$profile.moveDirection = this.getMoveDirection()
			/* ... */
			this.options.onDragMove &&
				this.options.onDragMove.call(
					undefined,
					evte,
					{
						movePosition: _$profile.movePositionRange,
						moveDirection: _$profile.moveDirection,
						distX: _$profile.offsetRectAtPointerdown.x,
						distY: _$profile.offsetRectAtPointerdown.y,
						diffX: pointer1.clientX - _$profile.pointerPositionCache.x,
						diffY: pointer1.clientY - _$profile.pointerPositionCache.y,
						clientX: pointer1.clientX,
						clientY: pointer1.clientY,
					},
					this
				)
			/* ... */
			_$profile.pointerPositionCache.x = pointer1.clientX
			_$profile.pointerPositionCache.y = pointer1.clientY
		}
		if (_$profile.pointers.length === 2) {
			const pointer1 = _$profile.pointers[0]
			const pointer2 = _$profile.pointers[1]
			const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
			const dotRecordInPointerdown2 = _$profile.dotsRecordInPointerdown[1]
			const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
			const lastDotRecordInPointerdown2 = _$profile.lastDotsRecordInPointerdown[1]
			/* ... */
			const center = this.getCenter({ x: pointer1.clientX, y: pointer1.clientY }, { x: pointer2.clientX, y: pointer2.clientY })
			const rotate =
				this.getAngle({ x: pointer1.clientX, y: pointer1.clientY }, { x: pointer2.clientX, y: pointer2.clientY }) -
				this.getAngle(lastDotRecordInPointerdown1, lastDotRecordInPointerdown2)
			this.options.onRotate &&
				this.options.onRotate.call(
					undefined,
					evte,
					{
						rotate,
						centerX: center.x,
						centerY: center.y,
						lastCenterX: _$profile.centerPositionCacheOfMultiPointers.x,
						lastCenterY: _$profile.centerPositionCacheOfMultiPointers.y,
						pointA: { x: pointer1.clientX, y: pointer1.clientY },
						pointB: { x: pointer2.clientX, y: pointer2.clientY },
					},
					this
				)
			const scale =
				this.getDistance({ x: pointer1.clientX, y: pointer1.clientY }, { x: pointer2.clientX, y: pointer2.clientY }) /
				this.getDistance(lastDotRecordInPointerdown1, lastDotRecordInPointerdown2)
			this.options.onPinch &&
				this.options.onPinch.call(
					undefined,
					evte,
					{
						scale,
						centerX: center.x,
						centerY: center.y,
						lastCenterX: _$profile.centerPositionCacheOfMultiPointers.x,
						lastCenterY: _$profile.centerPositionCacheOfMultiPointers.y,
						pointA: { x: pointer1.clientX, y: pointer1.clientY },
						pointB: { x: pointer2.clientX, y: pointer2.clientY },
					},
					this
				)
			_$profile.centerPositionCacheOfMultiPointers.x = center.x
			_$profile.centerPositionCacheOfMultiPointers.y = center.y
			lastDotRecordInPointerdown1.x = pointer1.clientX
			lastDotRecordInPointerdown1.y = pointer1.clientY
			lastDotRecordInPointerdown2.x = pointer2.clientX
			lastDotRecordInPointerdown2.y = pointer2.clientY
		}
		const lastOnePointerEvent = this.getLastOnePointerEvent()
		this.options.onPointermove &&
			this.options.onPointermove.call(
				undefined,
				evte,
				{
					clientX: lastOnePointerEvent.clientX,
					clientY: lastOnePointerEvent.clientY,
				},
				this
			)
	}

	Gesture.prototype.handlePointerupEvent = function (evte) {
		const _$profile = this._$profile
		if (!_$profile.isPointerdown) {
			return
		}
		const lastOnePointerEvent = this.getLastOnePointerEvent()
		this.updatePointers(evte, POINTER_ITEM_DELETE)
		if (_$profile.pointers.length === 0) {
			window.clearTimeout(this._$profile.longTapTimeout)
			_$profile.isPointerdown = false
			_$profile.movePositionRange = ''
			_$profile.moveDirection = ''
			if (_$profile.tapCount === 0) {
				this.handleSwipe(evte, lastOnePointerEvent)
			} else {
				this.options.onTap &&
					this.options.onTap.call(
						undefined,
						evte,
						{
							clientX: lastOnePointerEvent.clientX,
							clientY: lastOnePointerEvent.clientY,
						},
						this
					)
				if (_$profile.tapCount >= 2) {
					_$profile.tapCount = 0
					this.options.onDoubleTap &&
						this.options.onDoubleTap.call(
							undefined,
							evte,
							{
								clientX: lastOnePointerEvent.clientX,
								clientY: lastOnePointerEvent.clientY,
							},
							this
						)
				}
				_$profile.tapCountRestTimer = window.setTimeout(() => {
					_$profile.tapCount = 0
				}, 400)
			}
		} else if (_$profile.pointers.length === 1) {
			const pointer1 = _$profile.pointers[0]
			const dotRecordInPointerdown1 = _$profile.dotsRecordInPointerdown[0]
			const lastDotRecordInPointerdown1 = _$profile.lastDotsRecordInPointerdown[0]
			/* ... */
			dotRecordInPointerdown1.x = pointer1.clientX
			dotRecordInPointerdown1.y = pointer1.clientY
			_$profile.pointerPositionCache.x = pointer1.clientX
			_$profile.pointerPositionCache.y = pointer1.clientY
		}
		if (_$profile.pointers.length <= 1) {
			/**
			 * 少于两指的情形下
			 *      重置多指几何中心坐标
			 */
			_$profile.centerPositionCacheOfMultiPointers.x = 0
			_$profile.centerPositionCacheOfMultiPointers.y = 0
		}
		this.options.onPointerup &&
			this.options.onPointerup.call(
				undefined,
				evte,
				{
					clientX: lastOnePointerEvent.clientX,
					clientY: lastOnePointerEvent.clientY,
				},
				this
			)
		if (_$profile.pointers.length <= 0) {
			document.removeEventListener('mousemove', this._handlePointermoveEvent)
			document.removeEventListener('mouseup', this._handlePointerupEvent)
		}
	}

	Gesture.prototype.handlePointercancelEvent = function (evte) {
		const _$profile = this._$profile
		const lastOnePointerEvent = this.getLastOnePointerEvent()
		window.clearTimeout(_$profile.longTapTimeout)
		_$profile.isPointerdown = false
		_$profile.tapCount = 0
		this.updatePointers(evte, POINTER_ITEM_DELETE)
		this.options.onPpointercancel &&
			this.options.onPpointercancel.call(
				undefined,
				evte,
				{
					clientX: lastOnePointerEvent.clientX,
					clientY: evlastOnePointerEventte.clientY,
				},
				this
			)
		if (_$profile.pointers.length <= 0) {
			document.removeEventListener('mousemove', this._handlePointermoveEvent)
			document.removeEventListener('mouseup', this._handlePointerupEvent)
		}
	}

	Gesture.prototype.handleWheelEvent = function (evte) {
		const _$profile = this._$profile
		const scale = evte.deltaY > 0 ? this.options.zoomOutWheelRatio : this.options.zoomInWheelRatio
		this.options.onWheel &&
			this.options.onWheel.call(
				undefined,
				evte,
				{
					scale,
					clientX: evte.clientX,
					clientY: evte.clientY,
				},
				this
			)
	}

	Gesture.prototype.handleContextmenuEvent = function (evte) {
		this.options.onContextmenu &&
			this.options.onContextmenu.call(
				undefined,
				evte,
				{
					clientX: evte.clientX,
					clientY: evte.clientY,
				},
				this
			)
	}

	Gesture.prototype.bindEvent = function () {
		this.containerElements.forEach(item => {
			item.addEventListener('touchstart', this._handlePointerdownEvent)
			item.addEventListener('touchmove', this._handlePointermoveEvent)
			item.addEventListener('touchend', this._handlePointerupEvent)
			item.addEventListener('touchcancel', this._handlePointercancelEvent)
			item.addEventListener('mousedown', this._handlePointerdownEvent)
			item.addEventListener('wheel', this._handleWheelEvent)
			item.addEventListener('contextmenu', this._handleContextmenuEvent)
		})
	}

	Gesture.prototype.unBindEvent = function () {
		this.containerElements.forEach(item => {
			item.removeEventListener('touchstart', this._handlePointerdownEvent)
			item.removeEventListener('touchmove', this._handlePointermoveEvent)
			item.removeEventListener('touchend', this._handlePointerupEvent)
			item.removeEventListener('touchcancel', this._handlePointercancelEvent)
			item.removeEventListener('mousedown', this._handlePointerdownEvent)
			item.removeEventListener('wheel', this._handleWheelEvent)
			item.removeEventListener('contextmenu', this._handleContextmenuEvent)
		})
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	function xGesture(host, options) {
		return new Gesture(host, options)
	}

	xGesture.attach = function (host, options) {
		return new Gesture(host, options)
	}
	xGesture.defined = {
		DIRECTION_UP,
		DIRECTION_DOWN,
		DIRECTION_LEFT,
		DIRECTION_RIGHT,
	}
	xGesture.version = '1.2.1'

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = xGesture
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return xGesture
		})
	} else {
		;(function () {
			return this || (0, eval)('this')
		})().xGesture = xGesture
	}
})()
