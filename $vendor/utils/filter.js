function ven$onlyPositiveFloatNumber(content, decimalLength = 2) {
	content.value = content.value.replace(/[^\d.]/g, '')
	content.value = content.value.replace(/^\./g, '')
	content.value = content.value.replace(/\.{2,}/g, '.')
	content.value = content.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
	let decimalRegStr = ''
	if (decimalLength <= 1) {
		decimalLength = 1
	}
	decimalRegStr += '^(\\-)*(\\d+)\\.('
	for (let i = 0; i < decimalLength; i++) {
		decimalRegStr += `\\d`
	}
	decimalRegStr += ').*$'
	content.value = content.value.replace(new RegExp(decimalRegStr), '$1$2.$3')
	if (content.value.indexOf('.') < 0 && content.value != '') {
		if (content.value.substr(0, 1) == '0' && content.value.length == 2) {
			content.value = parseFloat(content.value)
		}
	}
	return content
}

function ven$onlyRationalFloatNumber(content, decimalLength = 2) {
	content.value = content.value.replace(/[^\d.-]/g, '')
	content.value = content.value.replace(/^\./g, '')
	content.value = content.value.replace(/\.{2,}/g, '.')
	content.value = content.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
	content.value = content.value.replace(/\-{2,}/g, '-')
	content.value = content.value.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-')
	if (!/^\-/.test(content.value)) {
		content.value = content.value.replace('-', '')
	}
	let decimalRegStr = ''
	if (decimalLength <= 1) {
		decimalLength = 1
	}
	decimalRegStr += '^(\\-)*(\\d+)\\.('
	for (let i = 0; i < decimalLength; i++) {
		decimalRegStr += `\\d`
	}
	decimalRegStr += ').*$'
	content.value = content.value.replace(new RegExp(decimalRegStr), '$1$2.$3')
	if (content.value.indexOf('.') < 0 && content.value != '') {
		if (content.value.substr(0, 1) == '0' && content.value.length == 2) {
			content.value = parseFloat(content.value)
		}
	}
	return content
}
