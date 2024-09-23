const canvasElement = document.getElementById('webglCanvas')

const vertices = [
	[-0.7, 0.5],
	[-0.4, 0.3],
	[-0.25, 0.71],
	[-0.1, 0.56],
	[-0.1, 0.13],
	[0.4, 0.21],
	[0, -0.6],
	[-0.3, -0.3],
	[-0.6, -0.3],
	[-0.45, 0.0],
]
const points = vertices.map(item => {
	return new Vector2(item[0] * 256, item[1] * 256)
})

function tranlate2DContext1(ctx, canvasWidth, canvasHeight) {
	ctx.translate(canvasWidth / 2, canvasHeight / 2)
	ctx.scale(1, -1)
	ctx.lineCap = 'round'
}

function canvasMousemoveHandler1(e) {
	const canvasRect = this.getBoundingClientRect().toJSON()
	const offsetX = e.clientX - canvasRect.left
	const offsetY = e.clientY - canvasRect.top

	gVars.canvasContext.clearRect(0, 0, gVars.canvasElement.width, gVars.canvasElement.height)

	if (gVars.canvasContext.isPointInPath(offsetX, offsetY)) {
		baseCanvasDraw(points, gVars.canvasContext, {
			isClosePath: true,
			fillStyle: 'red',
		})
	} else {
		baseCanvasDraw(points, gVars.canvasContext, {
			isClosePath: true,
			fillStyle: 'blue',
		})
	}
}

function bindEvent() {
	gVars.canvasElement.addEventListener('mousemove', canvasMousemoveHandler1, false)
}

function main() {
	gVars.canvasContext = init2DContext(canvasElement)
	console.log(gVars)

	bindEvent()

	tranlate2DContext1(gVars.canvasContext, canvasElement.width, canvasElement.height)

	baseCanvasDraw(points, gVars.canvasContext, {
		isClosePath: true,
	})
}

window.addEventListener('DOMContentLoaded', main)
