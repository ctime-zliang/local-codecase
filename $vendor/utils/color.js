/**
 * @description 创建随机颜色
 * @function ven$randomColor
 * @return {object}
 */
function ven$randomColor() {
	return {
		r: Math.random() * 255,
		g: Math.random() * 255,
		b: Math.random() * 255,
		a: Math.random() * 1,
	}
}

/**
 * @description 创建指定范围内的随机颜色
 * @function ven$randomRangeColor
 * @param {array} r RED 原色数值范围
 * @param {array} g GREEN 原色数值范围
 * @param {array} b BLUE 原色数值范围
 * @param {array} a ALPHA 数值范围
 * @return {object}
 */
function ven$randomRangeColor(r = [0, 255], g = [0, 255], b = [0, 255], a = [1, 1]) {
	r[0] = Math.max(0, r[0])
	r[1] = Math.min(255, r[1])
	g[0] = Math.max(0, g[0])
	g[1] = Math.min(255, g[1])
	b[0] = Math.max(0, b[0])
	b[1] = Math.min(255, b[1])
	a[0] = Math.max(0, a[0])
	a[1] = Math.min(1, a[1])
	const ri = Math.floor(Math.random() * (r[1] - r[0] + 1)) + r[0]
	const gi = Math.floor(Math.random() * (g[1] - g[0] + 1)) + g[0]
	const bi = Math.floor(Math.random() * (b[1] - b[0] + 1)) + b[0]
	const ai = Math.floor(Math.random() * (a[1] - a[0] + 1)) + a[0]
	return {
		r: ri,
		g: gi,
		b: bi,
		a: ai,
	}
}

/**
 * @description 颜色转换: HEX 转 RGBA
 * @function ven$hex2Rgba
 * @param {string} hex HEX 颜色值
 * @return {object}
 */
function ven$hex2Rgba(hex) {
	const result = { r: 0, g: 0, b: 0, a: 0 }
	let alpha = false
	let h = hex.slice(hex.startsWith('#') ? 1 : 0)
	if (h.length === 3) {
		h = [...h]
			.map(x => {
				return x + x
			})
			.join('')
	} else if (h.length === 8) {
		alpha = true
	}
	const n = parseInt(h, 16)
	result.r = n >>> (alpha ? 24 : 16)
	result.g = (n & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)
	result.b = (n & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)
	result.a = alpha ? n & 0x000000ff : 1
	return result
}

/**
 * @description 颜色转换: RGBA 转 HEX
 * @function ven$hex2Rgba
 * @param {object} rgba RGBA 颜色值
 * @return {string}
 */
function ven$rgba2Hex(rgba) {
	return '#' + ((rgba.r << 16) + (rgba.g << 8) + rgba.b).toString(16).padStart(6, '0')
}
