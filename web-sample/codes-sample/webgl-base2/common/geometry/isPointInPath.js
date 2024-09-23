/**
 * 结合
 *      ./$doc/点与三角形的包含关系判定.jpg
 *      ./$doc/点与三角形任意边a的向量关系.jpg
 * 查看
 */
function inTriangle(p1, p2, p3, point) {
	/**
	 * 三角形轮廓边 a/b/c
	 *      由对应的两个点所构成的 两个向量相减 得出
	 */
	const a = p2.copy().sub(p1)
	const b = p3.copy().sub(p2)
	const c = p1.copy().sub(p3)

	/**
	 * 平面内任意一点到三角形三个顶点的向量 u1/u2/u3
	 *      由对应的两个点所构成的 两个向量相减 得出
	 */
	const u1 = point.copy().sub(p1)
	const u2 = point.copy().sub(p2)
	const u3 = point.copy().sub(p3)

	let p

	/**
	 * 任意点 u 存在于三角形任意一边 a, 需同时满足:
	 *      1. a.cross(u1) === 0
	 *      2. 0 <= a.dot(u1) / a.length ** 2 <= 1
	 */

	const s1 = Math.sign(a.cross(u1))
	p = a.dot(u1) / a.length ** 2
	if (s1 === 0 && p >= 0 && p <= 1) {
		return true
	}

	const s2 = Math.sign(b.cross(u2))
	p = b.dot(u1) / b.length ** 2
	if (s2 === 0 && p >= 0 && p <= 1) {
		return true
	}

	const s3 = Math.sign(c.cross(u3))
	p = c.dot(u1) / c.length ** 2
	if (s3 === 0 && p >= 0 && p <= 1) {
		return true
	}

	return s1 === s2 && s2 === s3
}

function isPointInPath({ vertices, cells }, point) {
	let ret = false
	for (let i = 0; i < cells.length; i += 3) {
		const p1 = new Vector2(vertices[cells[i]].x, vertices[cells[i]].y)
		const p2 = new Vector2(vertices[cells[i + 1]].x, vertices[cells[i + 1]].y)
		const p3 = new Vector2(vertices[cells[i + 2]].x, vertices[cells[i + 2]].y)
		if (inTriangle(p1, p2, p3, point)) {
			ret = true
			break
		}
	}
	return ret
}
