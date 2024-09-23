/**
 * @description 移除数组前面所有的 0 项
 * @function ven$removeAllFrontZero
 * @param {array} arr 目标数组
 * @return {array<any>}
 */
function ven$removeAllFrontZero(arr) {
	const res = []
	let flag = false
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === 0 && !flag) {
			continue
		}
		flag = true
		res.push(arr[i])
	}
	return res
}
