/*
    给你一个字符串 s，找到 s 中最长的回文子串。
 */

/**
 * @param {string} s
 * @return {string}
 */
function longestPalindrome(s) {
	return getByGetLCS(s)
}

function getByGetLCS(string) {
	return ven$getLCS(string, string.split('').reverse().join('')).string
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/**
 * 求最长公共回文子串
 * @param {string} stringA 字符串 A
 * @param {string} stringB 字符串 B
 * @return {string}
 */
function getLCS(stringA, stringB) {
	const res = { count: -1, string: `` }
	if (!stringA || !stringA.length || !stringB || !stringB.length) {
		return res
	}
	const array = []
	const [longString, shortString] = swap(stringA, stringB)
	let maxSubstringLength = 0
	let maxRightEndIndex = 0
	for (let i = 0; i < longString.length; i++) {
		if (!array[i]) {
			array[i] = []
		}
		for (let j = 0; j < shortString.length; j++) {
			if (longString[i] === shortString[j]) {
				if (i === 0 || j === 0) {
					array[i][j] = 1
				} else {
					array[i][j] = array[i - 1][j - 1] + 1
				}
				res.count = array[i][j]
			} else {
				array[i][j] = 0
			}
			if (array[i][j] > maxSubstringLength) {
				/*
                    求最长公共回文子序列 
                 */
				const beforeRev = longString.length - 1 - j
				if (beforeRev + array[i][j] - 1 === i) {
					maxSubstringLength = array[i][j]
					maxRightEndIndex = i
				}
			}
		}
	}
	res.string = longString.substring(maxRightEndIndex - maxSubstringLength + 1, maxRightEndIndex + 1)
	// console.log(res)
	// console.log(array)
	return res
}
function swap(stringA, stringB) {
	if (stringA.length >= stringB.length) {
		return [stringA, stringB]
	}
	return [stringB, stringA]
}
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

console.log(longestPalindrome('aacabdkacaa'))
