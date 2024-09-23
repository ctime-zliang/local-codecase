/*
    methods.js
 */
window.$methods = {
	/**
	 * @method getPointsOfPath
	 * @desc 获取path的所有坐标
	 * @param {Element} el path元素
	 * @return {Array}
	 */
	getPointsOfPath(el) {
		const dValueReg = /([MLQTCSAZVH])([^MLQTCSAZVH]*)/gi
		const numReg = /([+]\d+[.]\d+|[-]\d+[.]\d+|\d+[.]\d+|[+]\d+|[-]\d+|\d+)/gi

		let dValueArr = []
		let numArr = []
		let points = []
		let dValue = el.getAttribute('d') || ''

		if (dValue) {
			dValueArr = dValue.match(dValueReg) || []
			dValueArr.forEach((item, index) => {
				numArr = item.match(numReg) || []
				if (numArr && numArr.length === 2) {
					points.push({
						x: +numArr[0] || 0,
						y: +numArr[1] || 0,
					})
				}
			})
		}

		return points
	},
	/**
	 * @method createCircleControlDots
	 * @desc 为path添加<circle />型控制点
	 * @param {Element} container path的父元素
	 * @param {Array} points path坐标组
	 * @return {Array}
	 */
	createCircleControlDots(container, points = []) {
		const SVG_NS = 'http://www.w3.org/2000/svg'
		const cFragment = document.createDocumentFragment()
		const gEl = document.createElementNS(SVG_NS, 'g')
		const circles = []

		points = points.slice(0, points.length - 1)
		points.forEach((item, index) => {
			let c = document.createElementNS(SVG_NS, 'circle')
			c.setAttribute('stroke', '#6600ff')
			c.setAttribute('stroke-width', '1')
			c.setAttribute('fill', '#00FF00')
			c.setAttribute('data-clickHandler', 'move')
			c.setAttribute('cx', item.x)
			c.setAttribute('cy', item.y)
			c.setAttribute('r', '4')
			circles.push(c)
			gEl.appendChild(c)
		})
		cFragment.appendChild(gEl)
		container.appendChild(cFragment)
		return circles
	},
	/**
	 * @method setPointsOfPath
	 * @desc 为path设置坐标组
	 * @param {Element} el path元素
	 * @param {Array} points path坐标组
	 * @return {Array}
	 */
	setPointsOfPath(el, points = []) {
		let string = ''
		if (!points) {
			return
		}
		points.forEach((item, index) => {
			if (index === 0) {
				string += `M${item.x} ${item.y} `
			} else {
				string += `L${item.x} ${item.y} `
			}
		})
		el.setAttribute('d', string)
	},
	/**
	 * @method setCenterOfCirclesToAllCircles
	 * @desc 为circle设置坐标(基于DOM数组遍历)
	 * @param {Elements} el circle元素数组
	 * @param {Array} points path坐标组
	 * @return {Undefined}
	 */
	setCenterOfCirclesToAllCircles(circles, points = []) {
		circles.forEach((item, index) => {
			if (points[index] && typeof points[index].x !== 'undefined') {
				item.setAttribute('cx', points[index].x)
			}
			if (points[index] && typeof points[index].y !== 'undefined') {
				item.setAttribute('cy', points[index].y)
			}
		})
	},
	/**
	 * @method setCenterOfCirclesToPartCircles
	 * @desc 为circle设置坐标(基于pointObj对象遍历)
	 * @param {Elements} el circle元素数组
	 * @param {Object} points path坐标组
	 * @return {Undefined}
	 */
	setCenterOfCirclesToPartCircles(circles, pointObj = {}) {
		Object.keys(pointObj).forEach((item, index) => {
			if (pointObj[item] && typeof pointObj[item].x !== 'undefined') {
				circles[String(item)].setAttribute('cx', pointObj[item].x)
			}
			if (pointObj[item] && typeof pointObj[item].y !== 'undefined') {
				circles[String(item)].setAttribute('cy', pointObj[item].y)
			}
		})
	},
}
