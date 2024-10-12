function memoryLeaks_loadIframe(container, iframeId, src) {
	const iframe = document.createElement('iframe')
	iframe.src = src
	iframe.id = iframeId
	iframe.setAttribute('id', iframeId)
	container.appendChild(iframe)
	return iframe
}

window.GGGGGGG = []

class IframeMemoryLeaks {
	static profile = {
		iframeId: 'iframeId',
		loadIframeBtnId: 'loadIframe',
		removeIframeBtnId: 'removeIframe',
	}

	static init() {
		const appContainer = document.getElementById('appContainer')
		const iframeContainer = document.getElementById('iframeContainer')
		appContainer.append(document.createRange().createContextualFragment(`<button id="${this.profile.loadIframeBtnId}">Load Iframe</button>`))
		appContainer.append(document.createRange().createContextualFragment(`<button id="${this.profile.removeIframeBtnId}">Remove Iframe</button>`))
		const loadIframeBtn = document.getElementById(this.profile.loadIframeBtnId)
		const removeIframeBtn = document.getElementById(this.profile.removeIframeBtnId)
		loadIframeBtn.addEventListener('click', e => {
			if (document.getElementById(this.profile.iframeId)) {
				return
			}
			const iframe = memoryLeaks_loadIframe(iframeContainer, this.profile.iframeId, 'https://www.baidu.com/')
			const newWindow = iframe.contentWindow
			function fn1() {}
			function fn2() {
				newWindow
			}
			window.GGGGGGG.push(fn1)
		})
		removeIframeBtn.addEventListener('click', e => {
			const iframe = document.getElementById(this.profile.iframeId)
			if (iframe) {
				iframe.remove()
			}
			// window.GGGGGGG.length = 0
		})
	}
}
