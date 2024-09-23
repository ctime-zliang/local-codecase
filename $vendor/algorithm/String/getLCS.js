/**
 * @description 求最长公共子串
 * @function ven$getLCS
 * @param {string} stringA 字符串 A
 * @param {string} stringB 字符串 B
 * @return {string}
 */
function ven$getLCS(stringA, stringB) {
	const res = { count: -1, string: `` }
	if (!stringA || !stringA.length || !stringB || !stringB.length) {
		return res
	}
	const matrix = []
	const [longString, shortString] = __ven$getLCS__swap(stringA, stringB)
	let maxSubstringLength = 0
	let maxRightEndIndex = 0
	for (let i = 0; i < longString.length; i++) {
		if (!matrix[i]) {
			matrix[i] = []
		}
		for (let j = 0; j < shortString.length; j++) {
			if (longString[i] === shortString[j]) {
				if (i === 0 || j === 0) {
					matrix[i][j] = 1
				} else {
					matrix[i][j] = matrix[i - 1][j - 1] + 1
				}
				res.count = matrix[i][j]
			} else {
				matrix[i][j] = 0
			}
			if (matrix[i][j] > maxSubstringLength) {
				maxSubstringLength = matrix[i][j]
				maxRightEndIndex = i
			}
		}
	}
	res.string = longString.substring(maxRightEndIndex - maxSubstringLength + 1, maxRightEndIndex + 1)
	return res
}
function __ven$getLCS__swap(stringA, stringB) {
	if (stringA.length >= stringB.length) {
		return [stringA, stringB]
	}
	return [stringB, stringA]
}
