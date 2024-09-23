let count = 0

chrome.runtime.onMessage.addListener(message => {
	count++
})
