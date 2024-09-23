const canvasElement = document.getElementById('webglCanvas')

function tranlate2DContext1(ctx, canvasHeight) {
	ctx.translate(0, canvasHeight)
	ctx.scale(1, -1)
	ctx.lineCap = 'round'
}

function drawBranch(ctx, v0, length, thickness, dir) {
	/**
	 * 通过传入的 length 和 dir 构建一个"被加"向量
	 * 从而求出 v0 对应坐标点的下一个坐标点的位置
	 */
	const directionVec = new Vector2(1, 0).rotate(dir).scale(length)
	const v1 = v0.copy().add(directionVec)

	ctx.lineWidth = thickness
	ctx.beginPath()
	ctx.moveTo(v0.x, v0.y)
	ctx.lineTo(v1.x, v1.y)
	ctx.stroke()

	if (thickness > 2) {
		const left = PI / 4 + 0.5 * (dir + deg2rad(45))
		drawBranch(ctx, v1, length * 0.9, thickness * 0.8, left)
		const right = PI / 4 + 0.5 * (dir - deg2rad(45))
		drawBranch(ctx, v1, length * 0.9, thickness * 0.8, right)
	}
}

function vectorTest() {
	const v1 = new Vector2(1, 1)
	const v2 = new Vector2(-1, 1)
	const v3 = v1.copy().add(v2)
	console.log(v3, rad2deg(v3.dir), v3.length)
}

function main() {
	gVars.canvasContext = init2DContext(canvasElement)
	// gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	vectorTest()

	tranlate2DContext1(gVars.canvasContext, canvasElement.height)
	const v0 = new Vector2(gVars.canvasElement.width / 2, 0)
	drawBranch(gVars.canvasContext, v0, 50, 10, PI / 2)
}

window.addEventListener('DOMContentLoaded', main)
