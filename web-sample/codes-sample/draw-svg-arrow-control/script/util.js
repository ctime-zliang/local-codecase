/*
    util.js
 */
window.$util = {
	/**
	 * @method nodeIndexOf
	 * @desc 获取el在兄弟元素中的索引
	 * @param {Element} el DOM元素
	 * @return {Object}
	 */
	nodeIndexOf(el) {
		return [].indexOf.call(el.parentNode.children, el)
	},
	/**
	 * @method getBoundingClientRect
	 * @desc 获取el的尺寸/坐标数据
	 * @param {Element} el DOM元素
	 * @return {Object}
	 */
	getBoundingClientRect(el) {
		return el.getBoundingClientRect()
	},
	/**
	 * @method entrustEventBinding
	 * @desc 基于属性选择器定位的事件委托绑定
	 * @param {Element} container DOM元素
	 * @param {String} eventName 事件类型
	 * @param {String} attribute 指定的属性(选择器)
	 * @param {Function} callback 事件回调
	 * @return {Undefined}
	 */
	entrustEventBinding(container, eventName, attribute, callback) {
		container.addEventListener(
			eventName,
			function (evte) {
				let tar = evte.target
				while (!tar.getAttribute(attribute)) {
					if (tar === container) {
						tar = null
						break
					}
					tar = tar.parentNode
				}
				if (tar) {
					callback && callback.call(tar, evte)
				}
			},
			false
		)
	},
}
