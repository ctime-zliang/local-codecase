/*
    给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效

    有效字符串需满足：
        左括号必须用相同类型的右括号闭合
        左括号必须以正确的顺序闭合
 */
function isValid(string) {
	const len = string.length
	if (len % 2 !== 0) {
		return false
	}
	const stack = []
	for (let i = 0; i < len; i++) {
		switch (string[i]) {
			case '{':
			case '[':
			case '(':
				stack.push(string[i])
				break
			case '}':
				if (stack.pop() !== '{') {
					return false
				}
				break
			case ']':
				if (stack.pop() !== '[') {
					return false
				}
				break
			case ')':
				if (stack.pop() !== '(') {
					return false
				}
				break
		}
	}
	if (stack.length <= 0) {
		return true
	}
	return false
}

const string = '{[]}'

console.log(isValid(string))
