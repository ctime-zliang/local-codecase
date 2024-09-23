class Ven$StringTrim {
	/**
	 * @description 删除首尾空白
	 * @function rmPreBlank
	 * @param {string} string 待处理字符串
	 * @return {string}
	 */
	static rmAround(string) {
		if (!string || typeof string !== 'string') {
			return string
		}
		if (String.prototype.trim) {
			return string.trim()
		}
		return string.replace(/(^\s*)|(\s*$)/g, '')
	}

	/**
	 * @description 删除HTML标签标记
	 * @function rmHTMLTag
	 * @param {string} string 待处理字符串
	 * @return {string}
	 */
	static rmHTMLTag(string) {
		if (!string || typeof string !== 'string') {
			return string
		}
		return string.replace(/<\/?[^>]*>/g, '')
	}

	/**
	 * @description 删除 &nbsp;
	 * @function rmNBSPTag
	 * @param {string} string 待处理字符串
	 * @return {string}
	 */
	static rmNBSPTag(string) {
		if (!string || typeof string !== 'string') {
			return string
		}
		return string.replace(/&nbsp;/gi, '')
	}

	/**
	 * @description 删除多余空行
	 * @function rmBlankLine
	 * @param {string} string 待处理字符串
	 * @return {string}
	 */
	static rmBlankLine(string) {
		if (!string || typeof string !== 'string') {
			return string
		}
		return string.replace(/\n[\s||]*\r/g, '\n')
	}

	/**
	 * @description 处理存储型 XSS 输入标签
	 * @function rmBlankLine
	 * @param {string} string 待处理字符串
	 * @return {string}
	 */
	static rmXSS(string) {
		if (!string || typeof string !== 'string') {
			return string
		}
		return string
			.replace(/<|&lt;/g, '&lt;')
			.replace(/>|&gt;/g, '&gt;')
			.replace(/\'|&#39;/g, '&#39;')
			.replace(/\"|&quot;/g, '&quot;')
	}
}
