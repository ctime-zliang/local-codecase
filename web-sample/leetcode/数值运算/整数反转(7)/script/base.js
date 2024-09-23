/*
    给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果

    如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0

    假设环境不允许存储 64 位整数（有符号或无符号）
 */
function reverse(x) {
	let number = x
	let res = 0
	while (number != 0) {
		res = res * 10 + (number % 10)
		if (res > 2147483647 || res < -2147483648) {
			return 0
		}
		number = parseInt(number / 10)
	}
	return res
}

console.log(reverse(123456789))
