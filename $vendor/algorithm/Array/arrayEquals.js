function ven$arrayEquals(a1, a2) {
	const len1 = a1.length
	const len2 = a2.length
	if (len1 !== len2) {
		return false
	}
	for (let k1 = 0; k1 < len1; k1++) {
		for (let k2 = 0; k2 < len2; k2++) {
			if (a1[k1] !== a2[k2]) {
				return false
			}
		}
	}
	return true
}
