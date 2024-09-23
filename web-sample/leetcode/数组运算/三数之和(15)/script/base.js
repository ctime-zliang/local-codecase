/*
    给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标
    你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现
 */
/*
    算法流程：
        1 特殊判定，对于数组长度为n 如果数组为null 或者数组的长度小于3，返回[]。
        2 对数组进行排序。
        3 遍历排序后的数组：
            nums[i] > 0 因为已经排序好，所以后面不可能有三个数加和等于0，直接返回结果。
            对于重复元素：跳过 避免出现重复解
            令左指针 L = i+1 右指针 R = n-1 当 L < R 时候执行循环：
                当 nums[i]+nums[L]+nums[R] === 0, 执行循环，判断左边界和有边界是否和下一个位置重复，去除重复解，并同时将L R 移动到下一个位置，寻找新的解
            若和大于0 说明nums[R] 太大，R左移
            若和小于0 说明nums[L] 太小, L右移=
 */
function loopFind(nums) {
	/* 排序 */
	const list = nums.sort((a, b) => {
		return +a - +b
	})
	const res = []
	for (let i = 0; i < list.length - 2; i++) {
		/* 
            如果
                当前位置的值大于 0
            则
                后续不可能再有数字小于 0
            即
                及后续数字的和永远会大于 0
        */
		if (list[i] > 0) {
			break
		}
		if (i - 1 >= 0 && list[i - 1] === list[i]) {
			continue
		}
		let left = i + 1
		let right = list.length - 1
		const item1 = list[i]
		while (left < right) {
			const item2 = list[left]
			const item3 = list[right]
			const sum = item1 + item2 + item3
			/*
                判断三数之和 
             */
			if (sum === 0) {
				res.push([item1, item2, item3])
				/*
                    跳过重复的数字 
                        item2 一开始由 list[left] 赋值而来, 故该 while 循环至少会执行一次
                        当 
                            list 中, item2 的下一个值仍然与 item2 相同
                        时
                        则
                            将左指针继续往后移
                 */
				while (left < right && list[left] === item2) {
					left++
				}
				while (left < right && list[right] === item3) {
					right--
				}
			} else if (sum > 0) {
				right--
			} else {
				left++
			}
		}
	}
	return res
}

function threeSum(nums) {
	return loopFind(nums)
}

const array = [-1, 0, 1, 2, -1, -4]
const arr2 = [-3, -2, -1, 0, 1, 2, 3, 4]

console.log(threeSum(arr2))
