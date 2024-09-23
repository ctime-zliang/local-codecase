console.log(xGesture)

Ven$AlertManager.init()

var globalContainerElement = document.getElementById('appContainer')
var interactiveSelectedClassname = 'gesture-interactive-selected'

;(function (containerElement) {
	const fullcaseContainerElement = containerElement.querySelector('[data-tagitem="fullcaseContainer"]')
	const fullcaseBtnElement = containerElement.querySelector('[data-tagitem="fullcase-btn"]')
	const exitFullcaseBtnElement = containerElement.querySelector('[data-tagitem="exit-fullcase-btn"]')

	xGesture(fullcaseBtnElement).onTap((evte, { clientX, clientY }, gesture) => {
		console.log(evte, gesture)
		fullcaseContainerElement.style.display = 'block'
	})

	xGesture(exitFullcaseBtnElement)
		.onTap((evte, { clientX, clientY }, gesture) => {
			Ven$AlertManager.setBtns([Ven$AlertManager.defaultConfirmBtn, Ven$AlertManager.defaultCancelBtn]).open(
				'确定要退出综合案例么?',
				function (tag) {
					if (tag === 'confirm') {
						fullcaseContainerElement.style.display = 'none'
					}
					this.close()
				}
			)
		})
		.onLongTap((evte, { clientX, clientY }, gesture) => {
			Ven$AlertManager.setBtns([Ven$AlertManager.defaultConfirmBtn]).open('长按无效哦~', function (tag) {
				this.close()
			})
		})

	const pageHeaderElement = containerElement.querySelector('.page-header')
	const pageContentElement = containerElement.querySelector('.page-content')
	const pageFooterElement = containerElement.querySelector('.page-footer')
	xGesture(pageHeaderElement).onDoubleTap((evte, { clientX, clientY }, gesture) => {
		pageContentElement.scrollTop = 0
	})
	xGesture(pageFooterElement).onDoubleTap((evte, { clientX, clientY }, gesture) => {
		pageContentElement.scrollTop = pageContentElement.scrollHeight
	})

	// fullcaseContainerElement.style.display = 'block'
})(globalContainerElement)
