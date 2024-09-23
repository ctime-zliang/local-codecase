function getDraggableRow(nowElement) {
	if (!nowElement) {
		return null
	}
	if (nowElement.nodeName.toUpperCase() === 'TR' && nowElement.getAttribute('draggable') === 'true') {
		return nowElement
	}
	return getDraggableRow(nowElement.parentElement)
}

function createEmptyImage() {
	const image = new Image()
	return image
}

function createSuspensionTable(trElement, rect) {
	const htmlStrArr = []
	htmlStrArr.push(
		`<table class="table suspension-table" style="width: ${rect.width}px; height: ${rect.height}px; left: ${rect.left}px; top: ${rect.top}px;">`
	)
	htmlStrArr.push(`<tbody>`)
	htmlStrArr.push(`</tbody>`)
	htmlStrArr.push(`</table>`)
	const fragmentElement = document.createRange().createContextualFragment(htmlStrArr.join('\n'))
	const tableElement = fragmentElement.querySelector('table')
	tableElement.querySelector('tbody').appendChild(trElement)
	document.body.appendChild(fragmentElement)
	return tableElement
}

const TABLE_OPTIONAL = {
	list: [],
	draggable: false,
	dragEndCallback: null,
}

class Table {
	constructor(container, option = {}) {
		this.optional = { ...TABLE_OPTIONAL, ...option }
		this.dragProfile = {
			mouseMoveY: -1,
			dragContainer: null,
			movingElement: null,
			movingElementInitialIndex: -1,
			movingElementRealTimeIndex: -1,
			nowTargetElement: null,
			nowTargetElementRealTimeIndex: -1,
			suspensionTable: null,
			suspensionTableTranslateY: 0,
		}
		this.container = container
		this.tableElement = null
		this.tbodyElement = null
		this.theadElement = null
		this._rowDragStartHandler = this.rowDragStartHandler.bind(this)
		this._rowDragEndHandler = this.rowDragEndHandler.bind(this)
		this._rowDragDropHandler = this.rowDragDropHandler.bind(this)
		this._rowDragEnterHandler = this.rowDragEnterHandler.bind(this)
		this._rowDragOverHandler = this.rowDragOverHandler.bind(this)
		this.initial()
		this.bindDragEvent()
	}

	initial() {
		if (!this.optional.cols || !Array.isArray(this.optional.cols) || this.optional.cols.length <= 0) {
			throw new Error('init table col error.')
		}
		const { cols } = this.optional
		const defaultRatioPercent = (1 / cols.length) * 100 + '%'
		const htmlStrArr = []
		htmlStrArr.push(`<table class="table main-table">`)
		htmlStrArr.push(`<thead>`)
		htmlStrArr.push(`<tr>`)
		for (let i = 0; i < cols.length; i++) {
			const colItemData = cols[i]
			const width = colItemData.width ? colItemData.width * 100 + '%' : defaultRatioPercent
			htmlStrArr.push(`<th width="${width}" title=${colItemData.title}>${colItemData.title}</th>`)
		}
		htmlStrArr.push(`</tr>`)
		htmlStrArr.push(`</thead>`)
		htmlStrArr.push(`<tbody>`)
		htmlStrArr.push(`</tbody>`)
		htmlStrArr.push(`</table>`)
		const fragmentElement = document.createRange().createContextualFragment(htmlStrArr.join('\n'))
		this.tableElement = fragmentElement.querySelector('table')
		this.tbodyElement = this.tableElement.querySelector('tbody')
		this.theadElement = this.tableElement.querySelector('thead')
		this.container.appendChild(fragmentElement)
	}

	bindDragEvent() {
		if (!this.optional.draggable) {
			return
		}
		this.tbodyElement.addEventListener('dragstart', this._rowDragStartHandler)
		this.tbodyElement.addEventListener('dragend', this._rowDragEndHandler)
		this.tbodyElement.addEventListener('dragdrop', this._rowDragDropHandler)
		this.tbodyElement.addEventListener('dragenter', this._rowDragEnterHandler)
		this.tbodyElement.addEventListener('dragover', this._rowDragOverHandler)
	}

	upadteTableContent(list) {
		this.optional.list = [...list]
		const { cols } = this.optional
		const htmlStrArr = []
		for (let i = 0; i < list.length; i++) {
			const rowItemData = list[i]
			htmlStrArr.push(`<tr id="${rowItemData.$id}" ${rowItemData.$draggable ? 'draggable="true"' : ''}>`)
			for (let j = 0; j < cols.length; j++) {
				const cellItemData = rowItemData[cols[j].key]
				htmlStrArr.push(`<td title=${cellItemData}>${cellItemData}</td>`)
			}
			htmlStrArr.push(`</tr>`)
		}
		this.tbodyElement.innerHTML = htmlStrArr.join('\n')
	}

	updateTableStatus(showText) {
		const { cols } = this.optional
		const htmlStrArr = []
		htmlStrArr.push(`<tr class="status-tr">`)
		htmlStrArr.push(`<td title=${showText} colspan="${cols.length}">${showText}</td>`)
		htmlStrArr.push(`</tr>`)
		this.tbodyElement.innerHTML = htmlStrArr.join('\n')
	}

	rowDragStartHandler(e) {
		const { target } = e
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setDragImage(createEmptyImage(), 0, 0)
		target.classList.add('dragmoving')
		this.dragProfile.mouseMoveY = e.clientY
		this.dragProfile.dragContainer = target.parentElement
		this.dragProfile.movingElement = target
		const allTrElements = Array.from(this.dragProfile.movingElement.parentElement.children)
		this.dragProfile.movingElementInitialIndex = allTrElements.indexOf(this.dragProfile.movingElement)
		const copyTrElement = this.dragProfile.movingElement.cloneNode(true)
		const copyTdElements = copyTrElement.children
		Array.from(this.dragProfile.movingElement.children).forEach((item, index) => {
			const tdElementWidth = item.getBoundingClientRect().toJSON().width
			copyTdElements[index].style.width = tdElementWidth + 'px'
		})
		const trElementBoundingClientRect = this.dragProfile.movingElement.getBoundingClientRect().toJSON()
		this.dragProfile.suspensionTable = createSuspensionTable(copyTrElement, trElementBoundingClientRect)
		this.dragProfile.suspensionTable.style.transform = `translate3d(0px, ${this.dragProfile.suspensionTableTranslateY}px, 5px)`
	}

	rowDragEndHandler(e) {
		const { target } = e
		target.classList.remove('dragmoving')
		if (this.optional.dragEndCallback instanceof Function) {
			this.optional.dragEndCallback(
				this.optional.list,
				this.dragProfile.movingElementInitialIndex,
				this.dragProfile.nowTargetElementRealTimeIndex,
				this.dragProfile.movingElementRealTimeIndex
			)
		}
		this.dragProfile.movingElement = null
		this.dragProfile.nowTargetElement = null
		this.dragProfile.suspensionTableTranslateY = 0
		this.dragProfile.suspensionTable.remove()
		this.dragProfile.suspensionTable = null
	}

	rowDragDropHandler(e) {
		const { target } = e
		if (!getDraggableRow(target)) {
			return
		}
	}

	rowDragEnterHandler(e) {
		e.preventDefault()
		const { target } = e
		const targetTrElement = getDraggableRow(target)
		if (!targetTrElement || targetTrElement === this.dragProfile.movingElement) {
			return
		}
		this.dragProfile.nowTargetElement = targetTrElement
		const allTrElements = Array.from(this.dragProfile.nowTargetElement.parentElement.children)
		this.dragProfile.movingElementRealTimeIndex = allTrElements.indexOf(this.dragProfile.movingElement)
		this.dragProfile.nowTargetElementRealTimeIndex = allTrElements.indexOf(this.dragProfile.nowTargetElement)
		if (this.dragProfile.movingElementRealTimeIndex < this.dragProfile.nowTargetElementRealTimeIndex) {
			this.dragProfile.dragContainer.insertBefore(this.dragProfile.movingElement, this.dragProfile.nowTargetElement.nextElementSibling)
		} else {
			this.dragProfile.dragContainer.insertBefore(this.dragProfile.movingElement, this.dragProfile.nowTargetElement)
		}
	}

	rowDragOverHandler(e) {
		e.preventDefault()
		const { target } = e
		if (!getDraggableRow(target)) {
			return
		}
		const diffY = e.clientY - this.dragProfile.mouseMoveY
		this.dragProfile.suspensionTableTranslateY += diffY
		this.dragProfile.suspensionTable.style.transform = `translate3d(0px, ${this.dragProfile.suspensionTableTranslateY}px, 5px)`
		this.dragProfile.mouseMoveY = e.clientY
	}
}
