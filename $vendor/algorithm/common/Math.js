class Ven$Math {
	static PI_2 = Math.PI / 2
	static PI_4 = Math.PI / 4

	/**
	 * @description 对数字进行四舍五入并保留指定位数
	 * @function toFixed
	 * @param {number|string} number 待处理的数字
	 * @param {number} digit 保留的小数位数长度
	 * @param {boolean} fixedDecimal 是否固定保留指定长度的浮点位
	 *      1.00 而不是 1
	 * @return {string|number}
	 */
	static toFixed(number, digit = 2, fixedDecimal = true) {
		if (typeof number !== 'number') {
			number = +number
		}
		if (isNaN(number)) {
			return NaN
		}
		digit = digit | 0
		if (digit <= 0 || (!number && !fixedDecimal)) {
			return String(Math.round(number))
		}
		const p = [1, 10, 100, 1000, 10000][digit] || Math.pow(10, digit) || 10
		if (fixedDecimal) {
			const sign = number < 0 ? '-' : ''
			number = number < 0 ? -number : number
			number = Math.round(number * p) + ''
			while (number.length <= digit) {
				number = '0' + number
			}
			number = number.slice(0, -digit) + '.' + number.slice(-digit)
			return sign + number
		}
		return String(Math.round(number * p + 1e-10) / p)
	}

	/**
	 * @description 求绝对的值
	 * 		0 => 0
	 * 		-0 => 0
	 * 		3.1817257161747205e-16 => 0
	 * 		-3.1817257161747205e-16 => 0
	 * @function calcAbsoluteValue
	 * @param {number} value 需要转换计算的值
	 * @return {number}
	 */
	static calcAbsoluteValue(value) {
		const MIN = 1e-10
		if (value === -0) {
			return 0
		}
		if (value > 0 && value <= MIN) {
			return 0
		}
		if (value < 0 && value >= -MIN) {
			return 0
		}
		return value
	}
}
