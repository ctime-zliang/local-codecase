const canvasElement = document.getElementById('webglCanvas')

function tranlate2DContext1(ctx, canvasWidth, canvasHeight) {
	ctx.translate(canvasWidth / 2, canvasHeight / 2)
	ctx.scale(1, -1)
	ctx.lineCap = 'round'
}

function main() {
	gVars.canvasContext = init2DContext(canvasElement)
	// gVars.webglContext = initWebGLContext(canvasElement)
	console.log(gVars)

	tranlate2DContext1(gVars.canvasContext, canvasElement.width, canvasElement.height)

	// const regularPolygonController = regularPolygonShapes(4, 10, 10, 100)
	// regularPolygonController.draw(gVars.canvasContext)
	// console.log(regularPolygonController.points)

	drawArc(0, 0, 100, 0, PI).render(gVars.canvasContext)
	// drawArc(0, 0, 100, PI * 1 / 4, PI * 5 / 4).render(gVars.canvasContext)
	drawEllipse(0, 0, 200, 100).render(gVars.canvasContext, { strokeStyle: 'red' })
	drawPara(50).render(gVars.canvasContext)
}

window.addEventListener('DOMContentLoaded', main)
