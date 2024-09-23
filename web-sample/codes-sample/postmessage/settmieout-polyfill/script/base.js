/**
 * window.postMessage 同一个线程内将以引用方式发送数据
 */

const gVars = {}
window.gVars = gVars

function prefixClickedAction(e) {}

function mainClickedAction(e) {
	setTimeoutTest()
	setMessageTimeoutTest()
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
