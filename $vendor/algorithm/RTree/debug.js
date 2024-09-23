const Ven$Rtree_storageAuxiliary = {
	ids: [],
}

function Ven$Rtree_getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function Ven$Rtree_getHashIden(length = 18) {
	const s = []
	const HEX_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	for (let i = 0; i < length; i++) {
		s[i] = HEX_DIGITS.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[14] = String(Ven$Rtree_getRandomInArea(1, 9))
	s[19] = HEX_DIGITS.substr((+s[19] & 0x3) | 0x8, 1)
	s[8] = String(Ven$Rtree_getRandomInArea(1, 9))
	s[13] = String(Ven$Rtree_getRandomInArea(1, 9))
	s[18] = String(Ven$Rtree_getRandomInArea(1, 9))
	s[23] = String(Ven$Rtree_getRandomInArea(1, 9))
	return s.join('')
}

function Ven$Rtree_debugUpdateRectangleAuxiliary(id, node, borderColor = 'red') {
	if (Ven$Rtree_storageAuxiliary.ids.indexOf(id) <= -1) {
		Ven$Rtree_storageAuxiliary.ids.push(id)
	}
	const mixinId = `auxiliary_${id}`
	let targetElement = document.getElementById(mixinId)
	if (!targetElement) {
		const newElement = document.createElement('div')
		newElement.id = mixinId
		newElement.setAttribute('id', mixinId)
		document.body.appendChild(newElement)
		targetElement = newElement
	}
	targetElement.style.border = `1px dashed ${borderColor}`
	targetElement.style.position = 'absolute'
	targetElement.style.boxSizing = `border-box`
	targetElement.style.left = `${node.sx}px`
	targetElement.style.top = `${node.sy}px`
	targetElement.style.width = `${node.w}px`
	targetElement.style.height = `${node.h}px`
}

function Ven$Rtree_debugRemoveRectangleAuxiliary(id) {
	const idx = Ven$Rtree_storageAuxiliary.ids.indexOf(id)
	if (idx >= 0) {
		Ven$Rtree_storageAuxiliary.ids.splice(idx, 1)
	}
	const mixinId = `auxiliary_${id}`
	let targetElement = document.getElementById(mixinId)
	if (!targetElement) {
		return
	}
	targetElement.remove()
}
