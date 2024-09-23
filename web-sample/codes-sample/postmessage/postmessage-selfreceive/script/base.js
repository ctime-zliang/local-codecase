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
	gVars.startTimer = performance.now()
	let sendBuffer = gVars.buffer
	window.postMessage(gVars, '*')
	// if (gVars.buffer) {
	//     const int32 = new Int32Array(gVars.buffer)
	//     int32[0] = 1
	// }
	if (gVars.json) {
		gVars.json.c = 3
	}
}

function messageHandler(e) {
	const { data } = e
	const now = performance.now()
	console.log(now - data.startTimer)
	// if (data.buffer) {
	//     const int32 = new Int32Array(data.buffer)
	//     int32[0] = 1
	//     int32[1] = 1
	// }
	// if (data) {
	//     const int32 = new Int32Array(data)
	//     int32[0] = 1
	//     int32[1] = 1
	// }
	console.log(`message.recevier`, e.data)
	console.log(`main.gVars`, gVars)
	console.log(`\n`)
}

function bindEvent() {
	const prefixBtnElement = document.getElementById('prefixBtn')
	const mainBtnElement = document.getElementById('mainBtn')
	prefixBtnElement.addEventListener('click', prefixClickedAction)
	mainBtnElement.addEventListener('click', mainClickedAction)

	window.addEventListener('message', messageHandler)
}

function main() {
	bindEvent()
}

window.addEventListener('DOMContentLoaded', main)
