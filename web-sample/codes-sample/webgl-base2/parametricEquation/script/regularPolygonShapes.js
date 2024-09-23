function regularPolygonShapes(edges = 3, x, y, sideLength) {
	const draw = (points, ctx) => {
		ctx.strokeStyle = `black`
		ctx.beginPath()
		ctx.moveTo(points[0].x, points[0].y)
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y)
		}
		ctx.closePath()
		ctx.stroke()
	}

	const points = []
	const delta = Math.PI * (1 - (edges - 2) / edges)
	/**
	 * 创建一个以目标正多边形第一个顶点为终点的向量
	 * 保存第一个顶点的坐标
	 */
	let p = new Vector2(x, y)
	points.push(p)
	/**
	 * 创建用于逐次累加的方向向量
	 * 由于是正多边形(长度固定), 因此在逐次计算下一个顶点时, 只需要旋转即可
	 */
	let directionVec = new Vector2(sideLength, 0)
	for (let i = 1; i <= edges; i++) {
		directionVec = directionVec.rotate(delta)
		p = p.copy().add(directionVec)
		points.push(p)
	}

	return {
		draw: draw.bind(undefined, points),
		points: points.slice(0, points.length - 1),
	}
}
