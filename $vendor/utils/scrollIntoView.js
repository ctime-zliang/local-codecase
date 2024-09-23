/**
 * @description 依将目标元素自动滚动到视口内 - 垂直滚动
 *      如果元素处于视口外下部, 则滚动到底部对其为止
 *      如果元素处于视口外上部, 则滚动到顶部对其为止
 *      如果元素处于视口内, 则不做处理
 * @function ven$scrollIntoViewByIndexVertical
 * @param {number} itemIndex 目标元素的序列索引
 * @param {htmllement} containerElement 容器元素
 * @return {undefined}
 */
function ven$scrollIntoViewByIndexVertical(itemIndex, containerElement) {
	const containerElementRect = containerElement.getBoundingClientRect().toJSON()
	const targetElemet = containerElement.children[itemIndex]
	if (!targetElemet) {
		return
	}
	const targetElemetRect = targetElemet.getBoundingClientRect().toJSON()
	/**
	 * 将元素滚动到视口最顶部时需要给视口设定的 scroll-top 的值
	 */
	const scrollToShowInViewTop = targetElemet.offsetTop - targetElemetRect.height
	/**
	 * 将元素滚动到视口最底部时需要给视口设定的 scroll-top 的值
	 */
	const scrollToShowInViewBottom = targetElemet.offsetTop + targetElemetRect.height - containerElementRect.height
	/**
	 * 当目标元素隐藏于视口上方时, 满足此条件
	 * 此时需要将该元素滚动到视口顶部
	 */
	if (containerElement.scrollTop > scrollToShowInViewTop) {
		containerElement.scrollTop = scrollToShowInViewTop
		return
	}
	/**
	 * 当目标元素隐藏于视口下方时, 满足此条件
	 * 此时需要将该元素滚动到视口底部
	 */
	if (containerElement.scrollTop < scrollToShowInViewBottom) {
		containerElement.scrollTop = scrollToShowInViewBottom
		return
	}
}

/**
 * @description 获取元素相对于视口的位置
 * @function ven$getItemPostionByTarget
 * @param {htmllement} targetElemet 目标元素
 * @param {htmllement} containerElement 容器元素
 * @return {number}
 *      100001 - 元素隐藏于容器视口外上部
 *      100002 - 元素处于容器视口内
 *      100003 - 元素隐藏于容器视口外下部
 */
function ven$getItemPostionByTarget(targetElemet, containerElement) {
	if (!targetElemet || !containerElement) {
		return null
	}
	const containerElementRect = containerElement.getBoundingClientRect().toJSON()
	const targetElemetRect = targetElemet.getBoundingClientRect().toJSON()
	if (containerElement.scrollTop > targetElemet.offsetTop + targetElemetRect.height / 2) {
		return 100001
	}
	if (containerElement.scrollTop + containerElementRect.height < targetElemet.offsetTop + targetElemetRect.height / 2) {
		return 100003
	}
	return 100002
}
