class InputFilter {
	static init() {
		const self = this
		const inputElement = document.createElement('input')
		inputElement.type = 'text'
		inputElement.name = 'inputContent'
		inputElement.id = 'inputContent'
		document.getElementById('appContainer').appendChild(inputElement)
		/* ... */
		const inputElementElement = document.getElementById('inputContent')
		inputElementElement.addEventListener('input', function (e) {
			const sourceValue = this.value
			this.value = ven$onlyRationalFloatNumber({ value: sourceValue }, 3).value
		})
		inputElementElement.addEventListener('blur', function (e) {
			const sourceValue = this.value
			this.value = +ven$onlyRationalFloatNumber({ value: sourceValue }, 3).value
		})
	}
}
