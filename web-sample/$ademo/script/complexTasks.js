class ComplexTasks {
	static elementUpdation = {
		count: 0,
		elementSize: 0,
		container: null,
		init(container, elementSize = 300) {
			this.container = container
			this.elementSize = elementSize
			let htmlString = ''
			for (let i = 0; i < this.elementSize; i++) {
				htmlString += `<div class="number" style="font-size: 20px;"></div>`
			}
			container.innerHTML = htmlString
		},
		update(inputValue) {
			const allNumElements = this.container.querySelectorAll('.number')
			const value = ++this.count
			for (let i = 0; i < allNumElements.length; i++) {
				// const value = Math.random()
				allNumElements[i].innerHTML = value
			}
		},
	}
}
