window.$handler = {
	lastEndPathPointsArr: [],
	/**
	 * @method getMouseDownRect
	 * @desc 鼠标按下时 获取各类尺寸/坐标信息((需要设置)内部this指向当前的事件对象)
	 * @param {Event} evte 事件对象
	 * @param {Object} canvasRect SVG画布的坐标&尺寸数据
	 * @return {Object}
	 */
	getMouseDownRect(evte, canvasRect = {}) {
		const _PosRect = {}
		_PosRect.canvasRectLeft = canvasRect.left || 0
		_PosRect.canvasRectTop = canvasRect.top || 0
		/**
		 * 鼠标点击时的坐标(相对于 SVG 画布)
		 */
		_PosRect.downX = +evte.clientX - _PosRect.canvasRectLeft
		_PosRect.downY = +evte.clientY - _PosRect.canvasRectTop
		/**
		 * 获取鼠标点击的 <circle /> 节点的圆心坐标
		 *
		 * 需要在此获取被点击元素的 DOM 属性
		 * 因此调用本函数前需要将此函数的 this 修改为目标 DOM
		 */
		_PosRect.circleCenterX = +this.getAttribute('cx') || 0
		_PosRect.circleCenterY = +this.getAttribute('cy') || 0
		/**
		 * 计算鼠标点击时的坐标(相对于SVG画布) 到 当前点击的<circle />节点的圆心坐标 的差值
		 */
		_PosRect.distX = _PosRect.downX - _PosRect.circleCenterX
		_PosRect.distY = _PosRect.downY - _PosRect.circleCenterY
		/**
		 * 获取当前点击的<circle />节点的索引
		 */
		_PosRect.index = String(window.$util.nodeIndexOf(this))
		return _PosRect
	},
	/**
	 * @method getMousePositionOfRealTime
	 * @desc 获取鼠标移动时的实时坐标(相对于SVG画布)
	 * @param {Event} evte 事件对象
	 * @param {Object} posRect 鼠标按下时获取的各类尺寸/坐标信息
	 * @return {Object}
	 */
	getMousePositionOfRealTime(evte, posRect = {}, canvasRect = {}) {
		const _PosRect = {}
		/**
		 * 鼠标移动时的实时坐标(相对于SVG画布)
		 */
		_PosRect.moveX = +evte.clientX - canvasRect.left || 0
		_PosRect.moveY = +evte.clientY - canvasRect.top || 0
		/**
		 * 计算鼠标移动时的相对于当前点击的<circle />节点的圆心的实时坐标
		 */
		_PosRect.newX = _PosRect.moveX - posRect.distX
		_PosRect.newY = _PosRect.moveY - posRect.distY
		return _PosRect
	},
	/**
	 * @method getAngleOfXAxial
	 * @desc 获取鼠标移动时鼠标与旋转中心点的连线相对于X轴的夹角
	 * @param {Object} movePoint 动点坐标
	 * @param {Object} fixedPoint 定点坐标
	 * @param {Boolen} reverseDirection 是否需要反向
	 * @return {Number}
	 */
	getAngleOfXAxial(movePoint = { x: 0, y: 0 }, fixedPoint = { x: 0, y: 0 }, reverseDirection = false) {
		let rotateAngle = 0
		rotateAngle = window.$math.getAngleOfXAxial({ x: movePoint.x, y: movePoint.y }, { x: fixedPoint.x, y: fixedPoint.y })
		rotateAngle = rotateAngle <= 0 ? 180 - Math.abs(rotateAngle) : 180 + Math.abs(rotateAngle)
		if (reverseDirection) {
			rotateAngle = -(180 - rotateAngle)
		}
		return rotateAngle
	},
	/**
	 * @method getRotateCenterRect
	 * @desc 获取旋转中心点坐标&旋转控制点坐标&旋转控制参数
	 * @param {Number} index 点击点的索引
	 * @param {Array} pathPoints path的路径坐标组
	 * @return {Object}
	 */
	getRotateCenterRect(index = 0, pathPoints = []) {
		const _PosRect = {}
		/**
		 * 默认的旋转中心点/控制点
		 */
		_PosRect.rotateCenterPoint = {
			x: pathPoints[4] ? pathPoints[4].x || 0 : 0,
			y: pathPoints[4] ? pathPoints[4].y || 0 : 0,
		}
		_PosRect.rotateControlPoint = {
			x: pathPoints[0] ? pathPoints[0].x || 0 : 0,
			y: pathPoints[0] ? pathPoints[0].y || 0 : 0,
		}
		/**
		 * 点击[顶点]
		 */
		if (+index === 0) {
			_PosRect.isCanRotate = true
			_PosRect.isReverseDirection = false
			return _PosRect
		}
		/**
		 * 点击[底部中点]
		 */
		if (+index === 4) {
			_PosRect.isCanRotate = true
			_PosRect.isReverseDirection = true
			/**
			 * 设置新的旋转中心点/控制点
			 */
			_PosRect.rotateCenterPoint = {
				x: pathPoints[0] ? pathPoints[0].x || 0 : 0,
				y: pathPoints[0] ? pathPoints[0].y || 0 : 0,
			}
			_PosRect.rotateControlPoint = {
				x: pathPoints[4] ? pathPoints[4].x || 0 : 0,
				y: pathPoints[4] ? pathPoints[4].y || 0 : 0,
			}
			return _PosRect
		}
		_PosRect.isCanRotate = false
		return _PosRect
	},
	/**
	 * @method getPathPointsWhenMove
	 * @desc 获取鼠标移动时的基于条件限制计算后的path坐标组(相对于SVG画布)
	 * @param {Object} posRect 鼠标按下时获取的各类尺寸/坐标信息
	 * @param {Object} pathPoints 鼠标按下时获取的path坐标组
	 * @return {Object}
	 */
	getPathPointsWhenMove(posRect = {}, pathPoints = []) {
		/**
		 * 点击的目标的索引
		 */
		let index = +posRect.index
		/**
		 * 坐标点副本
		 */
		let PathPointsArr = pathPoints.slice(0)
		/**
		 * 箭头三角部分内部折角
		 */
		let angleInner = 0
		/**
		 * 箭头两侧翼点到对称线的距离
		 */
		let distSymLine = 0

		if (!this.lastEndPathPointsArr || !this.lastEndPathPointsArr.length) {
			this.lastEndPathPointsArr = pathPoints
		}
		switch (String(index)) {
			case '0': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[2].x - pathPoints[1].x, y: pathPoints[2].y - pathPoints[1].y },
					{ x: posRect.newTranslateX - pathPoints[1].x, y: posRect.newTranslateY - pathPoints[1].y }
				)
				if (angleInner > 0 && angleInner <= 90) {
					PathPointsArr[8].x = posRect.newTranslateX
					PathPointsArr[index].x = posRect.newTranslateX
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '1': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[2].x - posRect.newTranslateX, y: pathPoints[2].y - posRect.newTranslateY },
					{ x: pathPoints[0].x - posRect.newTranslateX, y: pathPoints[0].y - posRect.newTranslateY }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)
				if (angleInner > 0 && angleInner <= 90 && posRect.newTranslateX <= pathPoints[2].x) {
					PathPointsArr[7].x = posRect.newTranslateX
					PathPointsArr[7].y = posRect.newTranslateY - 2 * distSymLine
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '2': {
				angleInner = window.$math.getAngle(
					{ x: posRect.newTranslateX - pathPoints[1].x, y: posRect.newTranslateY - pathPoints[1].y },
					{ x: pathPoints[0].x - pathPoints[1].x, y: pathPoints[0].y - pathPoints[1].y }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)
				if (
					angleInner > 0 &&
					angleInner <= 90 &&
					posRect.newTranslateX <= pathPoints[0].x &&
					posRect.newTranslateX >= pathPoints[1].x &&
					posRect.newTranslateY >= pathPoints[0].y
				) {
					PathPointsArr[3].y = posRect.newTranslateY
					PathPointsArr[5].y = posRect.newTranslateY - 2 * distSymLine
					PathPointsArr[6].x = posRect.newTranslateX
					PathPointsArr[6].y = posRect.newTranslateY - 2 * distSymLine
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '3': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[2].x - pathPoints[1].x, y: posRect.newTranslateY - pathPoints[1].y },
					{ x: pathPoints[0].x - pathPoints[1].x, y: pathPoints[0].y - pathPoints[1].y }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)
				if (angleInner > 0 && angleInner <= 90 && posRect.newTranslateX <= pathPoints[2].x && posRect.newTranslateY >= pathPoints[0].y) {
					PathPointsArr[2].y = posRect.newTranslateY
					PathPointsArr[4].x = posRect.newTranslateX
					PathPointsArr[5].x = posRect.newTranslateX
					PathPointsArr[5].y = posRect.newTranslateY - 2 * distSymLine
					PathPointsArr[6].y = posRect.newTranslateY - 2 * distSymLine
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '4': {
				if (posRect.newTranslateX < pathPoints[2].x) {
					PathPointsArr[3].x = posRect.newTranslateX
					PathPointsArr[5].x = posRect.newTranslateX
					PathPointsArr[index].x = posRect.newTranslateX
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '5': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[0].x - pathPoints[7].x, y: pathPoints[0].y - pathPoints[7].y },
					{ x: pathPoints[6].x - pathPoints[7].x, y: posRect.newTranslateY - pathPoints[7].y }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)
				if (angleInner > 0 && angleInner <= 90 && posRect.newTranslateX < pathPoints[2].x && posRect.newTranslateY <= pathPoints[0].y) {
					PathPointsArr[2].y = posRect.newTranslateY + 2 * distSymLine
					PathPointsArr[3].x = posRect.newTranslateX
					PathPointsArr[3].y = posRect.newTranslateY + 2 * distSymLine
					PathPointsArr[4].x = posRect.newTranslateX
					PathPointsArr[6].y = posRect.newTranslateY
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			case '6': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[0].x - pathPoints[7].x, y: pathPoints[0].y - pathPoints[7].y },
					{ x: posRect.newTranslateX - pathPoints[7].x, y: posRect.newTranslateY - pathPoints[7].y }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)

				if (angleInner > 0 && angleInner <= 90 && posRect.newTranslateY <= pathPoints[0].y && posRect.newTranslateX >= pathPoints[7].x) {
					PathPointsArr[2].x = posRect.newTranslateX
					PathPointsArr[2].y = posRect.newTranslateY + 2 * distSymLine
					PathPointsArr[3].y = posRect.newTranslateY + 2 * distSymLine
					PathPointsArr[5].y = posRect.newTranslateY
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}

			case '7': {
				angleInner = window.$math.getAngle(
					{ x: pathPoints[0].x - posRect.newTranslateX, y: pathPoints[0].y - posRect.newTranslateY },
					{ x: pathPoints[6].x - posRect.newTranslateX, y: pathPoints[6].y - posRect.newTranslateY }
				)
				distSymLine = Math.abs(posRect.newTranslateY - pathPoints[0].y)

				if (angleInner > 0 && angleInner <= 90 && posRect.newTranslateX <= pathPoints[6].x) {
					PathPointsArr[1].x = posRect.newTranslateX
					PathPointsArr[1].y = posRect.newTranslateY + 2 * distSymLine
					PathPointsArr[index].x = posRect.newTranslateX
					PathPointsArr[index].y = posRect.newTranslateY
				} else {
					PathPointsArr = this.lastEndPathPointsArr
				}
				break
			}
			default:
		}
		/**
		 * 记录最后一次事件时的坐标组
		 */
		this.lastEndPathPointsArr = PathPointsArr
		return PathPointsArr
	},
}
