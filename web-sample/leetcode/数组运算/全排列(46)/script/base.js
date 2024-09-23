/*
    给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
 */
function permute(array) {
	return fn2(array)
}

function fn1(array) {
	if (array.length === 1) {
		return [array]
	}
	const res = []
	array.forEach((outerItem, outerIndex) => {
		const childArr = [...array]
		childArr.splice(outerIndex, 1)
		res.push(
			...fn1(childArr).map((item, index) => {
				return [outerItem, ...item]
			})
		)
	})
	return res
}

function fn2(array) {
	/**
	 * 结果集
	 */
	const res = []
	/**
	 * 路径缓存
	 */
	const path = []
	/**
     *  递归遍历数组中剩余的元素项
            选择列表：nums 中不存在于 path 的那些元素
            结束条件：nums 中的元素全都 path 中出现 
     */
	const dfs = (nums, path) => {
		if (path.length == nums.length) {
			return res.push(path.concat())
		}
		for (let i = 0; i < nums.length; i++) {
			/**
			 * 排除不合法的选择
			 */
			if (path.indexOf(nums[i]) > -1) {
				continue
			}
			path.push(nums[i])
			dfs(nums, path)
			path.pop()
		}
	}
	dfs(array, path)
	return res
}

// const array = [1, 2, 3]
const array = []
for (let i = 0; i < 3; i++) {
	array.push(i)
}
console.log(permute(array))
