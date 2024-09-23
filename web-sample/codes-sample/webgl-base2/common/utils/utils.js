function rad2deg(radians) {
	return radians * (180 / Math.PI)
}

function deg2rad(degrees) {
	return degrees * (Math.PI / 180)
}

function parametric(xFunc, yFunc, rFunc) {
	return function (start, end, seg = 100, ...args) {
		const points = []
		for (let i = 0; i <= seg; i++) {
			const p = i / seg
			/**
			 * 此处使用折现来模拟绘制曲线
			 * 也即将曲线拆分成指定段数的直线线段
			 *      cita 即为该段线段所对应的弧度
			 */
			const cita = start * (1 - p) + end * p
			const x = xFunc(cita, ...args)
			const y = yFunc(cita, ...args)
			const v = new Vector2(x, y)
			if (rFunc) {
				const _rp = rFunc(x, y)
				points.push(_rp)
			} else {
				points.push(v)
			}
		}
		return {
			render(draw, ctx, optional) {
				draw(points, ctx, optional)
			},
			points,
		}
	}
}
