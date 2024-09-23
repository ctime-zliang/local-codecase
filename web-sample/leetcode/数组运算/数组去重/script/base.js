/*
    给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度
    不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成
 */
function deleteRepeatItems(nums) {
	const len = nums.length
	if (len <= 0) {
		return len
	}
	let fast = 0
	let slow = 0
	while (fast < len) {
		if (nums[fast + 1] != nums[fast]) {
			nums[slow] = nums[fast]
			++slow
		}
		++fast
	}
	// nums.splice(slow, len)
	return slow
}

const testArray = [1, 4, 4, 4, 6, 9, 9, 10, 12]

console.log(testArray.length)
console.log(deleteRepeatItems(testArray))
console.log(testArray)
