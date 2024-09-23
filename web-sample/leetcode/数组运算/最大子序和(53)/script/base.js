/*
    给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

    如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的 分治法 求解。
 */
function loopFind(nums) {
	if (nums.length <= 1) {
		return nums[0] || null
	}
	/*
        假定当前数组的第一个元素为最大和值 
     */
	let ans = nums[0]
	let tmpSum = 0
	/*
        外层遍历整个数组 
     */
	for (let i = 0; i < nums.length; i++) {
		/*
            重置临时计和变量
         */
		tmpSum = 0
		/* 
            统计当前遍历元素与后续所有元素的和
            在每累加一个元素求和后, 需要判断当前的临时计和变量与最大值的关系
                因为这个最大值可能包含在后续所有元素的子连续序列中
                例如累加到 nums.length - n 位置时就获取到了一个最大值, 而第 nums.length - n + 1 有可能为负数并从而导致临时计和变量的值变小
                因此需要将此刻的最大值记录下来, 再往后累加
         */
		for (let j = i; j < nums.length; j++) {
			tmpSum += nums[j]
			ans = tmpSum > ans ? tmpSum : ans
		}
	}
	return ans
}

function loopDynamicProgramming(nums) {
	if (nums.length <= 1) {
		return nums[0] || null
	}
	/*
        假定当前数组的第一个元素为最大和值
        并将其从原始数组中删除 
     */
	let ans = nums.splice(0, 1)[0]
	/*
        需要一个临时变量记录连续子序列的和值
        从数组第 1 个元素开始遍历
        因此假定已遍历 1 次, 则该和值就是第一个元素的值
     */
	let tmpSum = ans
	for (let i = 0; i < nums.length; i++) {
		/*
            tmpSum 为遍历到当前元素为止的一个计算和(由已遍历过的所有元素中的部分元素累加计算后的结果) 
            如果
                该值为负数
            则
                无论下一个值是正 or 负, 总体和值都将缩小
         */
		if (tmpSum > 0) {
			tmpSum += nums[i]
		} else {
			tmpSum = nums[i]
		}
		ans = Math.max(ans, tmpSum)
	}
	return ans
}

function maxSubArray(nums) {
	return loopFind(nums)
}

const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

console.log(maxSubArray(array))
