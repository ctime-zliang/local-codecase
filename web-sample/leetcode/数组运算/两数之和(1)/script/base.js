/*
    给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标
    你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现
 */
function loopFind(nums, target) {
	const len = nums.length
	if (len <= 1) {
		return []
	}
	for (let i = 0; i < len - 1; i++) {
		for (let j = i + 1; j < len; j++) {
			if (nums[i] + nums[j] == target) {
				return [i, j]
			}
		}
	}
	return []
}

function hashtableFind(nums, target) {
	const hashtable = {}
	for (let i = 0; i < nums.length; i++) {
		if (typeof hashtable[target - nums[i]] != 'undefined') {
			return [hashtable[target - nums[i]], i]
		}
		hashtable[nums[i]] = i
	}
	return []
}

function twoSum(nums, target) {
	return hashtableFind(nums, target)
}

const array = [3, 2, 4]
const target = 7

console.log(twoSum(array, target))
