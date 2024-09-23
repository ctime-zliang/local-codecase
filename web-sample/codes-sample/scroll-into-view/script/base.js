const MAX_LENGTH = 300

function createItems() {
	let html = ``
	for (let i = 0; i < MAX_LENGTH; i++) {
		html += `<li data-tagitem="item" class="ulist-item">${i} - ${Math.random()}</li>`
	}
	return html
}

function updateElementAttr(hostElement, key, value) {
	hostElement.setAttribute(key, value)
}

function setItemSelectedByIndex(idx) {
	const ulElement = document.querySelector('ul')
	Array.from(ulElement.children).forEach((item, index) => {
		if (index === idx) {
			item.classList.add('ulist-item-active')
			return
		}
		item.classList.remove('ulist-item-active')
	})
}

function main() {
	const containerElement = document.getElementById('container')
	const rangeElement = document.getElementById('range')
	const ulElement = document.querySelector('ul')
	ulElement.innerHTML = createItems()
	/* ... */
	updateElementAttr(rangeElement, 'max', MAX_LENGTH - 1)
	/* ... */
	ven$bindEvent(containerElement, 'change', '[data-tagitem="index-range"]', function (e) {
		const itemIndex = +this.value
		setItemSelectedByIndex(itemIndex)
		ven$scrollIntoViewByIndexVertical(itemIndex, ulElement)
	})
	ven$bindEvent(containerElement.querySelector('.ulist'), 'scroll', function (e) {
		console.log(ven$getItemPostionByTarget(ulElement.querySelector('.ulist-item-active'), ulElement))
	})
}

document.addEventListener('DOMContentLoaded', function () {
	main()
})
