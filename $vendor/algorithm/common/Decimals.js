class Ven$Decimals {
	static equalsFloat(num1, num2, places = 0) {
		const delta = Math.abs(num1 - num2)
		if (places > 5 && delta > 1e-5) {
			return false
		}
		if (isNaN(places) && delta > 1e-8) {
			return false
		}
		if (delta < 1e-13) {
			return true
		}
		let min = Math.min(Ven$Decimals.getDecimalPlaces(num1), Ven$Decimals.getDecimalPlaces(num2))
		if (min < 10) {
			min = 10
		}
		if (!isNaN(places)) {
			min = Math.min(min, places)
		}
		return ven$toFixed(num1, min) === ven$toFixed(num2, min)
	}

	static getDecimalPlaces(num) {
		let di = 0
		let dl = 0
		if (num > 0) {
			di = num - Math.floor(num)
		} else {
			di = num - Math.ceil(num)
		}
		dl = String(di).length
		if (dl > 2) {
			return dl - 2
		}
		return 0
	}
}
