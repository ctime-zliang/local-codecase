const DRAWTYPE_SIMPLE_RECT_DOT = 'SimpleRectDotDraw'
const DRAWTYPE_SIMPLE_RECT = 'SimpleRectDraw'
const DRAWTYPE_SIMPLE_TRIANGLE = 'SimpleTriangleDraw'
const DRAWTYPE_SIMPLE_CUBE = 'SimpleCubeDraw'
const DRAWTYPE_SIMPLE_CUBE2 = 'SimpleCube2Draw'
const DRAWTYPE_SIMPLE_GRADIENT_LINE = 'SimpleGradientLineDraw'
const DRAWTYPE_SIMPLE_GRADIENT_TRIANGLE = 'SimpleGradientTriangleDraw'
const DRAWTYPE_SIMPLE_COLOURFUL_CUBE = 'SimpleColourfulCubeDraw'
const DRAWTYPE_SIMPLE_LIGHT_CUBE = 'SimpleLightCubeDraw'
const DRAWTYPE_SIMPLE_ROTATIONAL_LIGHT_CUBE = 'SimpleRotationalLightCubeDraw'
const DRAWTYPE_SIMPLE_TRANSLATION_ROTATIONAL_LIGHT_CUBE = 'SimpleTranslationRotationalLightCubeDraw'
const DRAWTYPE_SIMPLE_TEXTURE_IMAGE = 'SimpleTextureImageDraw'
const DRAWTYPE_SIMPLE_GRAY_TEXTURE_IMAGE = 'SimpleGrayTextureImageDraw'
const DRAWTYPE_SIMPLE_CHARTLET_LIGHT_CUBE = 'SimpleChartletLightCubeDraw'

function drawGraphicsModifiedHandler(selectedValue) {
	if (gVars.controllerInstance) {
		gVars.controllerInstance.destory()
	}
	switch (selectedValue) {
		case DRAWTYPE_SIMPLE_COLOURFUL_CUBE: {
			gVars.canvasElement.style.backgroundColor = '#000000'
			break
		}
		case DRAWTYPE_SIMPLE_LIGHT_CUBE: {
			gVars.canvasElement.style.backgroundColor = '#000000'
			break
		}
		default: {
			gVars.canvasElement.style.backgroundColor = 'transparent'
		}
	}
}

function init() {
	const canvasElement = document.getElementById('webglCanvas')
	gVars.initCanvasHandler(canvasElement)

	const drawGraphicTypeSelectorDataList = [
		{ text: 'Simple Rect Dot', value: DRAWTYPE_SIMPLE_RECT_DOT },
		{ text: 'Simple Rect', value: DRAWTYPE_SIMPLE_RECT },
		{ text: 'Simple Triangle', value: DRAWTYPE_SIMPLE_TRIANGLE },
		{ text: 'Simple Cube', value: DRAWTYPE_SIMPLE_CUBE },
		{ text: 'Simple Cube 2', value: DRAWTYPE_SIMPLE_CUBE2 },
		{ text: 'Simple Gradient Line', value: DRAWTYPE_SIMPLE_GRADIENT_LINE },
		{ text: 'Simple Gradient Triangle', value: DRAWTYPE_SIMPLE_GRADIENT_TRIANGLE },
		{ text: 'Simple Colourful Cube', value: DRAWTYPE_SIMPLE_COLOURFUL_CUBE },
		{ text: 'Simple Light Cube', value: DRAWTYPE_SIMPLE_LIGHT_CUBE },
		{ text: 'Simple Rotational Light Cube', value: DRAWTYPE_SIMPLE_ROTATIONAL_LIGHT_CUBE },
		{ text: 'Simple Translation Rotational Light Cube', value: DRAWTYPE_SIMPLE_TRANSLATION_ROTATIONAL_LIGHT_CUBE },
		{ text: 'Simple Texture Image', value: DRAWTYPE_SIMPLE_TEXTURE_IMAGE },
		{ text: 'Simple Gray Texture Image', value: DRAWTYPE_SIMPLE_GRAY_TEXTURE_IMAGE },
		{ text: 'Simple Chartlet Light Cude', value: DRAWTYPE_SIMPLE_CHARTLET_LIGHT_CUBE },
	]
	const selectedValue = drawGraphicTypeSelectorDataList[drawGraphicTypeSelectorDataList.length - 1].value
	handlerDrawGraphicTypeSelector(
		document.getElementById('drawGraphicTypeSelector'),
		drawGraphicTypeSelectorDataList,
		selectedValue,
		controllerName => {
			if (!window[controllerName]) {
				console.warn(`${controllerName} is not found on window.`)
				return
			}
			drawGraphicsModifiedHandler(controllerName)
			gVars.controllerInstance = new window[controllerName]()
			gVars.controllerInstance.init(gVars.gl)
			gVars.controllerInstance.render()
		}
	)
}

function main() {
	console.log(gVars)
}

init()
main()
