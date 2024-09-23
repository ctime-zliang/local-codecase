/**
 * @description 数组分组
 *      获取由各项子数组构成的输出数组
 * @function ven$chunkArray
 * @param {array} array 被切割的数组
 * @param {number} size 每组尺寸长度
 * @return {array<any>}
 */
function ven$chunkArray(array, size) {
	const res = []
	for (let i = 0, len = array.length; i < len; i += size) {
		res.push(array.slice(i, i + size))
	}
	return res
}
