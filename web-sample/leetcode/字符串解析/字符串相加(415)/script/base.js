/*
    给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。

    你不能使用任何內建的用于处理大整数的库（比如 BigInteger）， 也不能直接将输入的字符串转换为整数形式。
 */
function addStrings(num1, num2) {
	return loop2(num1, num2)
}

function loop1(num1, num2) {
	/* 转换成数组 */
	const arr1 = num1.split('')
	const arr2 = num2.split('')
	/* 
        对齐两个数组
            前导补 0 对齐
     */
	const maxLength = Math.max(arr1.length, arr2.length)
	if (arr1.length < maxLength) {
		for (let i = maxLength - arr1.length - 1; i >= 0; i--) {
			arr1.unshift('0')
		}
	}
	if (arr2.length < maxLength) {
		for (let i = maxLength - arr2.length - 1; i >= 0; i--) {
			arr2.unshift('0')
		}
	}
	/*
        初始化临时数组
            以 0 填充
     */
	const temp = []
	for (let i = 0; i < maxLength + 1; i++) {
		temp[i] = 0
	}
	/*
        执行一个长度为 maxLength 的循环, 倒序遍历数组
            l1:    [4, 5, 6]
            l2:    [0, 7, 7]
            tp: [0, 0, 0, 0] 
     */
	let tempIndex = maxLength - 1 + 1
	for (let i = maxLength - 1; i >= 0; i--) {
		const sum = (+arr1[i] || 0) + (+arr2[i] || 0) + +temp[tempIndex]
		if (sum >= 10) {
			temp[tempIndex] = sum - 10
			temp[tempIndex - 1] = 1
		} else {
			temp[tempIndex] = sum
		}
		tempIndex--
	}
	const res = ven$removeAllFrontZero(temp)
	return res.length <= 0 ? '0' : res.join('')
}

function loop2(num1, num2) {
	/* 转换成数组 */
	const arr1 = num1.split('')
	const arr2 = num2.split('')
	/* 
        对齐两个数组
            前导补 0 对齐
     */
	const maxLength = Math.max(arr1.length, arr2.length)
	if (arr1.length < maxLength) {
		for (let i = maxLength - arr1.length - 1; i >= 0; i--) {
			arr1.unshift('0')
		}
	}
	if (arr2.length < maxLength) {
		for (let i = maxLength - arr2.length - 1; i >= 0; i--) {
			arr2.unshift('0')
		}
	}
	/* 
        定义低位值(字符串)
     */
	let lowPos = ``
	/*
        定义进位位 
     */
	let carry = 0
	for (let i = maxLength - 1; i >= 0; i--) {
		const sum = (+arr1[i] || 0) + (+arr2[i] || 0) + carry
		lowPos = (sum % 10) + '' + lowPos
		carry = (sum / 10) | 0
		/*
            当遍历到最后一轮循环时, 需要判断进位位值是否需要累加(大于 0 时需要累加) 
         */
		if (carry >= 1 && i <= 0) {
			lowPos = carry + lowPos
		}
	}
	return lowPos
}

console.log(addStrings('2323', '349'))
