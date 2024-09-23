/*
    给定一个整数数组，判断是否存在重复元素
 */
function containsDuplicate(nums) {
	const copyNums = nums.sort()
	for (let i = 0; i < copyNums.length - 1; i++) {
		if (copyNums[i] == copyNums[i + 1]) {
			return true
		}
	}
	return false
}

console.log(containsDuplicate(a1))
