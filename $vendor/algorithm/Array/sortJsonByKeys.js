/**
 * @description 将 json 依据指定的 keys 排序
 * @function ven$sortJsonByKeys
 * @param {array} keys 参考字段数组
 * @param {boolean} seq 升序 or 降序
 * @return {number}
 */
function ven$sortJsonByKeys(keys, seq = true) {
	const rev = !!seq ? 1 : -1
	return (a, b) => {
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i]
			if (a[key] !== b[key]) {
				if (a[key] > b[key]) {
					return rev * 1
				}
				return rev * -1
			}
		}
	}
}
