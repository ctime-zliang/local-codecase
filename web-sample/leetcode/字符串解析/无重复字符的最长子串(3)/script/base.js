/*
    给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
 */

/**
 * 求字符串中最长的连续不重复子串长度
 * @param {string} s 被检测字符串
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
	if (!s || !s.length || s.length <= 1) {
		return (s || '').length || 0
	}
	const length = s.length
	const hashtable = {}
	let count = 0
	/* 
        定义窗口左右指针
     */
	let left = 0
	let right = 0
	/* 
        以左指针为外循环, 当其移动到字符串末尾时结束
     */
	for (; left < length; ) {
		/*
            通过右指针右移不断扩大窗口 
         */
		for (; right < length; ) {
			if (!hashtable[s[right]]) {
				hashtable[s[right]] = true
				right++
				continue
			}
			/*
                当右指针移动到某个位置, 该位置的字符已在窗口中存在时, 停止扩大窗口 
             */
			break
		}
		/* 
            记录曾经遍历出的无重复字符字串的最大长度
         */
		count = Math.max(count, right - left)
		/*
            在窗口中移除当前左指针指向的字符
            并通过左指针右移缩小窗口 
         */
		delete hashtable[s[left]]
		left++
	}

	return count
}

const string = 'pwwkew'

console.log(lengthOfLongestSubstring(string))
