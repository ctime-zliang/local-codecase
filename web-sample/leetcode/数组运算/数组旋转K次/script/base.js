/*
    给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数
 */
function rotate(nums, k) {
	const tmp = []
	for (let i = 0; i < nums.length; i++) {
		tmp[i] = nums[i]
	}
	const truelyK = nums.length - (k % nums.length)
	let p = 0
	for (let i = truelyK; i < tmp.length; i++) {
		nums[p] = tmp[i]
		p++
	}
	for (let i = 0; i < truelyK; i++) {
		nums[p] = tmp[i]
		p++
	}
	return nums
}

const a1 = [-1, -100, 3, 99] // 2  // [3, 99, -1, -100]
const a2 = [1, 2, 3, 4, 5, 6, 7] // 3  // [5, 6, 7, 1, 2, 3, 4]

console.log(rotate(a1, 2))
