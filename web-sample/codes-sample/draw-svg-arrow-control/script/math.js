/*
    math.js
 */
window.$math = {
	/**
	 * @method getAngle
	 * @desc 求不在同一直线上的三点所构成的线段的夹角
	 * @param {Object} pA A点坐标
	 * @param {Object} pB B点坐标
	 * @return {Number}
	 */
	getAngle(pA = { x: 0, y: 0 }, pB = { x: 0, y: 0 }) {
		let dot = pA.x * pB.x + pA.y * pB.y
		let det = pA.x * pB.y - pA.y * pB.x

		return ((Math.atan2(det, dot) / Math.PI) * 180 + 360) % 360
	},
	/**
	 * @method getAngleOfXAxial
	 * @desc 求A-B线段所在直线与X轴的夹角
	 * @param {Object} pA A点坐标
	 * @param {Object} pB B点坐标
	 * @return {Number}
	 */
	getAngleOfXAxial(pA = { x: 0, y: 0 }, pB = { x: 0, y: 0 }) {
		return Math.atan2(pB.y - pA.y, pB.x - pA.x) * (180 / Math.PI)
	},
	/**
	 * @method getDotsAfterRotate
	 * @desc 求一组坐标围绕指定定点旋转指定角度之后的坐标组
	 * @param {Array} dots 需要转换的坐标组
	 * @param {Array} dots 需要转换的坐标组
	 * @param {Object} center 旋转中心点坐标
	 * @return {Array}
	 */
	getDotsAfterRotate(angle = 0, dots = [{ x: 0, y: 0 }], center = { x: 0, y: 0 }) {
		const Sin = {}
		const Cos = {}
		let deg = 0
		let points = dots.slice(0)
		let len = points.length
		let sin = 0
		let cos = 0

		// angle阈值修正
		if (angle < 0) {
			deg = (360 + (angle % 360)) % 360
		}
		if (angle >= 360) {
			deg = angle % 360
		}
		deg = angle

		// 计算
		sin = Sin[deg] = Math.sin((deg * Math.PI) / 180)
		cos = Cos[deg] = Math.cos((deg * Math.PI) / 180)

		// 遍历转换
		for (let i = 0; i < len; i++) {
			let x = +points[i].x
			let y = +points[i].y
			let dx = x - +center.x
			let dy = y - +center.y
			points[i] = {
				x: +center.x + cos * dx - sin * dy,
				y: +center.y + cos * dy + sin * dx,
			}
		}

		return points
	},
}
