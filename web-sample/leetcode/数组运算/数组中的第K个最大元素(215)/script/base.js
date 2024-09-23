/*
    给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

    请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 */
function findKthLargest(nums, k) {
	if (nums.length <= 0 || k > nums.length) {
		return null
	}
	const list = nums.sort((a, b) => {
		return +a - +b
	})
	return list[nums.length - k]
}

const array = [3, 2, 3, 1, 2, 4, 5, 5, 6, 7, 7, 8, 2, 3, 1, 1, 1, 10, 11, 5, 6, 2, 4, 7, 8, 5, 6]
const k = 2

console.log(findKthLargest(array, k))
