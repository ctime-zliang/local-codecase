/**
 * @description 获取一组形如 {a: [], b: [], c: [], ...} 的数据中的所有的数组中相同的数据(假设数组元素均为原始类型)
 * @function ven$findIntersectionInArrays
 * @param {object} data 被检索数据
 * @return {array<string|number|unknown>}
 */
function ven$findIntersectionInArrays(data) {
	const keys = Object.keys(data)
	if (!keys.length) {
		return []
	}
	let f = data[keys[0]]
	keys.reduce((pre, cur, idx, arr) => {
		f = f.filter(item => {
			return data[cur].indexOf(item) !== -1
		})
		return f
	}, dara[keys[0]])
	return f
}
