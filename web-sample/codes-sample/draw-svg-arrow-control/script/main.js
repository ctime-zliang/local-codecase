/* 
    main.js
 */
const ArrowPath = document.getElementById('arrowPath')
const SourcePointsOfPath = window.$methods.getPointsOfPath(ArrowPath)

// 添加控制点
const CirclesArr = window.$methods.createCircleControlDots(ArrowPath.parentNode, SourcePointsOfPath)

// 事件委托绑定
// 绑定mousedown
window.$util.entrustEventBinding(ArrowPath.parentNode, 'mousedown', 'data-clickHandler', handlerMouseDown)
// 绑定mouseup
document.addEventListener('mouseup', handlerMouseUp, false)

let Circles = CirclesArr
let CanvasRect = ArrowPath.parentNode.getBoundingClientRect()
// 唯一的数据命名空间
let POSRECT = {}

// mousedown
function handlerMouseDown(evte) {
	// 获取鼠标按下时的尺寸&坐标参数
	let mouseDownRect = window.$handler.getMouseDownRect.bind(this)(evte, CanvasRect)
	// 获取点击时的坐标组
	let initControlPoints = window.$methods.getPointsOfPath(ArrowPath)
	// 获取点击时的鼠标坐标
	let initCursorPosition = window.$handler.getMousePositionOfRealTime(evte, POSRECT, CanvasRect)
	// 获取点击时的旋转参数
	let initRotateParams = window.$handler.getRotateCenterRect(mouseDownRect.index, initControlPoints)
	// 获取点击时的图形的旋转角度
	let initAngle = window.$handler.getAngleOfXAxial(
		{ x: initRotateParams.rotateControlPoint.x, y: initRotateParams.rotateControlPoint.y },
		{ x: initRotateParams.rotateCenterPoint.x, y: initRotateParams.rotateCenterPoint.y },
		initRotateParams.isReverseDirection
	)

	// 合并数据
	POSRECT = {
		...initRotateParams,
		...mouseDownRect,
		initControlPoints: initControlPoints,
		initAngle: initAngle || 0,
		newX: initCursorPosition.newX,
		newY: initCursorPosition.newY,
	}

	// 绑定mousemove
	document.addEventListener('mousemove', handlerMouseMove, false)
}
// mousemove
function handlerMouseMove(evte) {
	let realTimeControlPoints

	// 获取鼠标实时坐标
	let realTimeCursorPosition = window.$handler.getMousePositionOfRealTime(evte, POSRECT, CanvasRect)
	POSRECT.newX = realTimeCursorPosition.newX
	POSRECT.newY = realTimeCursorPosition.newY

	if (POSRECT.isCanRotate) {
		// 获取鼠标的实时旋转角度
		POSRECT.newAngle = window.$handler.getAngleOfXAxial(
			{ x: POSRECT.newX, y: POSRECT.newY },
			{ x: POSRECT.rotateCenterPoint.x, y: POSRECT.rotateCenterPoint.y },
			POSRECT.isReverseDirection
		)
		// 实时旋转所有坐标点
		realTimeControlPoints = window.$math.getDotsAfterRotate(POSRECT.newAngle - POSRECT.initAngle || 0, POSRECT.initControlPoints, {
			x: POSRECT.rotateCenterPoint.x,
			y: POSRECT.rotateCenterPoint.y,
		})
	} else {
		realTimeControlPoints = POSRECT.initControlPoints
	}
	POSRECT.rotateAngle = POSRECT.isCanRotate ? POSRECT.newAngle : POSRECT.initAngle

	window.setTimeout(() => {
		// 计算复位后的鼠标坐标
		let reductionMousePoints = window.$math.getDotsAfterRotate(-POSRECT.rotateAngle, [{ x: POSRECT.newX, y: POSRECT.newY }], {
			x: POSRECT.rotateCenterPoint.x,
			y: POSRECT.rotateCenterPoint.y,
		})
		POSRECT.newTranslateX = reductionMousePoints[0].x
		POSRECT.newTranslateY = reductionMousePoints[0].y

		// 计复位后的path路径(控点)坐标
		let resetControlPoint = window.$math.getDotsAfterRotate(-POSRECT.rotateAngle, realTimeControlPoints, {
			x: POSRECT.rotateCenterPoint.x,
			y: POSRECT.rotateCenterPoint.y,
		})
		// 计算鼠标移动过程中的计算坐标以及阈值(边界限制)
		let calcControlPoint = window.$handler.getPathPointsWhenMove(POSRECT, resetControlPoint)
		// 还原坐标点
		let reductionControlPoint = window.$math.getDotsAfterRotate(POSRECT.rotateAngle, calcControlPoint, {
			x: POSRECT.rotateCenterPoint.x,
			y: POSRECT.rotateCenterPoint.y,
		})

		// 设置path&circle坐标
		window.$methods.setPointsOfPath(ArrowPath, reductionControlPoint)
		window.$methods.setCenterOfCirclesToAllCircles(Circles, reductionControlPoint)
	})
}
// mouseup
function handlerMouseUp(evte) {
	// 移除mousemove
	document.removeEventListener('mousemove', handlerMouseMove)
	console.log(POSRECT)
}
