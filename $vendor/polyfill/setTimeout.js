;(function () {
	const timeouts = []
	const MESSAGE_TOKEN = '--@Set-Message-Timeout'

	window.setMessageTimeout = setMessageTimeout

	function setMessageTimeout(fn) {
		timeouts.push(fn)
		window.postMessage(MESSAGE_TOKEN, '*')
	}

	function messageHandler(e) {
		if (e.source == window && e.data == MESSAGE_TOKEN) {
			e.stopPropagation()
			if (timeouts.length > 0) {
				const fn = timeouts.shift()
				fn()
			}
		}
	}

	window.addEventListener('message', messageHandler, true)
})()
