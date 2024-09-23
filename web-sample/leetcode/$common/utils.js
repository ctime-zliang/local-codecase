/**
 * 快速顺排序
 * @param {array} arr 被排序数组
 * @return {array}
 */
function $quickSortSeq(arr) {
	return __$quickSortSeqRecusion(arr)
}
function __$quickSortSeqRecusion(arr = []) {
	if (arr.length <= 1) {
		return arr
	}
	const middleIndex = Math.floor(arr.length / 2)
	const middlevalue = arr.splice(middleIndex, 1)[0]
	const leftArr = []
	const rightArr = []
	for (let i = 0; i < arr.length; i++) {
		arr[i] < middlevalue ? leftArr.push(arr[i]) : rightArr.push(arr[i])
	}
	return __$quickSortSeqRecusion(leftArr).concat([middlevalue], __$quickSortSeqRecusion(rightArr))
}
