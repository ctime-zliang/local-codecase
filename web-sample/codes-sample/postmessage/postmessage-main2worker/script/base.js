const worker = new Worker('./script/worker.js')

const gVars = {}
window.gVars = gVars

function createData() {
	const buffer = new ArrayBuffer(1 * 1024 * 1024 * 1024)
	return buffer
}

function prefixClickedAction(e) {
	gVars.buffer = createData()
	gVars.json = { a: 1, b: 2 }
	console.log(gVars)
}

function mainClickedAction(e) {
	gVars.startTimer = new Date().getTime()
	let sendBuffer = gVars.buffer
	// worker.postMessage(sendBuffer)
	worker.postMessage(gVars)
	// if (gVars.buffer) {
	//     const int32 = new Int32Array(gVars.buffer)
	//     int32[0] = 1
	// }
	if (gVars.json) {
		gVars.json.c = 3
	}
}

function bindEvent() {
	const prefixBtnElement = document.getElementById('prefixBtn')
	const mainBtnElement = document.getElementById('mainBtn')
	prefixBtnElement.addEventListener('click', prefixClickedAction)
	mainBtnElement.addEventListener('click', mainClickedAction)
}

function main() {
	bindEvent()
}

window.addEventListener('DOMContentLoaded', main)
