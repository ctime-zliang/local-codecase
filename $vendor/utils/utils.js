/**
 * @description 类型检测
 * @function ven$classOf
 * @param {any} target 被检测数据
 * @return {string}
 */
async function ven$classOf(target) {
	return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}

/**
 * @description 同步阻塞
 * @function ven$blocking
 * @param {number} delay 阻塞时长
 * @return {number}
 */
function ven$blocking(delay = 1000) {
	console.log('%c Synchronous Blocking Start...' + delay + 'ms.', 'color: green; font-size: 18px;')
	const start = performance.now()
	let count = 0
	while (performance.now() - start <= delay) {
		++count
	}
	console.log('%c Synchronous Blocking End...', 'color: green; font-size: 18px;')
	return count
}

/**
 * @description 异步等待阻塞
 * @function ven$sleep
 * @param {number} delay 阻塞时长
 * @return {promise<undefined>}
 */
async function ven$sleep(delay = 1000) {
	return Promise(_ => {
		window.setTimeout(_, delay)
	})
}

/**
 * @description 判断对象是否为空
 * @function ven$isEmptyObject
 * @param {object} obj 被检测对象
 * @return {boolean}
 */
function ven$isEmptyObject(obj) {
	for (let attr in obj) {
		return false
	}
	return true
}

/**
 * @description 在指定上下限范围内生成随机数
 * @function ven$getRandomInArea
 * @param {number} min 指定下限
 * @param {number} max 指定上限
 * @return {number}
 */
function ven$getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @description 以 0 补全数值位数
 * @function ven$padNumber
 * @param {number} number 数值
 * @param {number} allLength 位数
 * @return {number}
 */
function ven$padNumber(number, allLength) {
	const len = String(number).length
	return Array(allLength > len ? allLength - len + 1 || 0 : 0).join('') + number
}

/**
 * @description 生成指定长度的数组并以固定值填充各位
 * @function ven$createArray
 * @param {any} value 默认填充值
 * @return {array<any>}
 */
function ven$createArray(length, value = undefined) {
	return new Array(length + 1).join(value).split('')
}

/**
 * @description 在数组插入另一数组的指定位置
 * @function ven$insertArray2Array
 * @param {array<any>} operaArr 需要插入的数组
 * @param {array<any>} targetArr 被插入的数组
 * @param {number} insertIndex 索引位置
 * @return {undefined}
 */
function ven$insertArray2Array(operaArr, targetArr, insertIndex) {
	/**
	 * 将 operaArr 插入到 targetArr 的 insertIndex 处
	 */
	targetArr.splice.apply(targetArr, Array.concat(insertIndex, 0, operaArr))
}

/**
 * @description 依据 HTML 字符串生成 DOM 片段
 * @function ven$createElementFragment
 * @param {string} htmlString HTML 字符串
 * @param {boolean} useDOMParser 是否使用 DOMParser API
 * @return {htmllement}
 */
function ven$createElementFragment(htmlString, useDOMParser = false) {
	if (useDOMParser) {
		return new DOMParser().parseFromString(htmlString, 'text/html')
	}
	return document.createRange().createContextualFragment(htmlString)
}

/**
 * @description 使用 setTimeout 模拟 setInterval
 * @function ven$interval
 * @param {function} fn 执行函数
 * @param {number} interval 间隔时间
 * @param {object} scope 指定 fn 的作用域
 * @return {{ timer: null }}
 */
function ven$interval(fn, interval, scope = undefined) {
	const handler = { timer: null }
	const intv = function () {
		fn.call(scope)
		handler.timer = setTimeout(intv, interval)
	}
	handler.timer = setTimeout(intv, interval)
	return handler.timer
}

/**
 * @description 奇偶判断
 * @function ven$isOddEven
 * @param {number} number 被检测数
 * @return {boolean}
 */
function ven$isOddEven(number) {
	return !!(number & 1)
}

/**
 * @description 缩放图片以适应容器
 * @function ven$zoomImageByContainer
 * @param {number} naturalWidth 图片本身宽度
 * @param {number} naturalHeight 图片本身高度
 * @param {number} containerWidth 容器宽度
 * @param {number} containerHeight 容器高度
 * @return {
 *      {
 *          width,
 *          height,
 *          naturalScale,
 *          containerScale,
 *          naturalWidth,
 *          naturalHeight,
 *          containerWidth,
 *          containerHeight,
 *          benchmark,
 *      }
 * }
 */
function ven$zoomImageByContainer(naturalWidth, naturalHeight, containerWidth, containerHeight) {
	const imageRatio = naturalWidth / naturalHeight
	const containerRatio = containerWidth / containerHeight
	let width = 0
	let height = 0
	let benchmark = 'WIDTH'
	if (imageRatio >= containerRatio) {
		if (naturalWidth > containerWidth) {
			width = containerWidth
			height = (containerWidth / naturalWidth) * naturalHeight
			benchmark = 'WIDTH'
		} else {
			width = naturalWidth
			height = naturalHeight
		}
	} else {
		if (naturalHeight > containerHeight) {
			width = (containerHeight / naturalHeight) * naturalWidth
			height = containerHeight
			benchmark = 'HEIGHT'
		} else {
			width = naturalWidth
			height = naturalHeight
		}
	}
	return {
		width,
		height,
		naturalScale: width / naturalWidth,
		containerScale: benchmark === 'WIDTH' ? height / containerHeight : width / containerWidth,
		naturalWidth,
		naturalHeight,
		containerWidth,
		containerHeight,
		benchmark,
	}
}

/**
 * @description 递归向上查找指定 className 的元素节点
 * @function ven$findTargetByClassName
 * @param {htmllement} element HTML 元素
 * @param {string} className class-name
 * @param {array<Element>} eventPath HTMLEvent Path
 * @param {number} index 索引
 * @return {htmllement|null}
 */
function ven$findTargetByClassName(element, className, eventPath, index = 0) {
	if (!eventPath) {
		return null
	}
	const nowElement = eventPath[index]
	if (!nowElement || (nowElement.nodeType !== 1 && nowElement.nodeType !== 3)) {
		return null
	}
	if (element.classList.contains(className)) {
		return element
	}
	return ven$findTargetByClassName(element.parentElement, className, eventPath, ++index)
}

/**
 * @description 递归向上查找指定 className 的元素节点
 * @function ven$findTargetByClassName2
 * @param {htmllement} nowElement HTML 元素
 * @param {string} className class-name
 * @return {htmllement|null}
 */
function ven$findTargetByClassName2(nowElement, className) {
	if (!nowElement || (nowElement.nodeType !== 1 && nowElement.nodeType !== 3)) {
		return null
	}
	if (nowElement.classList.contains(className)) {
		return nowElement
	}
	return ven$findTargetByClassName2(nowElement.parentElement, className)
}

/**
 * @description 在 JSON 列表中查找指定 key: value 对应的项
 * @function ven$findList
 * @param {array<object>} list JSON 列表
 * @param {string} key 指定 key
 * @param {string} value 指定 value
 * @return {object}
 */
function ven$findList(list, key, value) {
	const res = { index: -1, data: null }
	if (list.length <= 0) {
		return res
	}
	for (let i = 0; i < list.length; i++) {
		if (list[i][key] === value) {
			res.index = i
			res.data = list[i]
			break
		}
	}
	return res
}

/**
 * @description 生成 <select /> 标签内的 option 标签 HTML 字符串
 * @function ven$createSelectOptionsHtmlString
 * @param {array<object>} dataList JSON 列表
 *      dataList = [
 *          {
 *              text: '显示在页面上的文本'
 *              value: '该项对应的值'
 *              attrs: {
 *                  'html-prop-key': 'html-prop-value'
 *              }
 *          }
 *      ]
 *      option = {
 *          v: 'value'  // 内部生成 options-html 时, 需要遍历 dataList 的每一项, 需要读取每一项的 value, 此配置指定代表 value 的键的名称
 *          t: 'text'  // 内部生成 options-html 时, 需要遍历 dataList 的每一项, 需要读取每一项的 text, 此配置指定代表 text 的键的名称
 *          offAutoFill: boolean  // 关闭自动填充默认值(当 selectedValue 的值没有在 datatList 中存在时, 是否自动添加 selectedValue 到 dataList 的末尾)
 *      }
 * @param {object} option 配置项
 * @param {string|number} selectedValue 被选中的值
 * @return {string}
 */
function ven$createSelectOptionsHtmlString(dataList, option = {}, selectedValue = undefined) {
	const iOption = option || {}
	const v = iOption.v || 'value'
	const t = iOption.t || 'text'
	const offAutoFill = typeof iOption.offAutoFill === 'undefined' ? false : !!iOption.offAutoFill
	const iDataList = JSON.parse(JSON.stringify(dataList))
	let isIn = false
	if (typeof selectedValue !== 'undefined') {
		for (let i = 0; i < iDataList.length; i++) {
			if (iDataList[i][v] === selectedValue) {
				iDataList[i]['selected'] = true
				isIn = true
			}
		}
		if (!offAutoFill && typeof selectedValue !== 'undefined' && (!isIn || !iDataList.length)) {
			iDataList.unshift({
				[v]: selectedValue,
				[t]: selectedValue,
			})
		}
	}
	let optionsHtml = ''
	for (let i = 0; i < iDataList.length; i++) {
		const itemData = iDataList[i]
		const selected = itemData['selected'] || false
		const disabled = itemData['disabled'] || false
		const value = itemData[v]
		const text = itemData[t]
		const attrs = itemData['attrs'] || {}
		const attrKeys = Object.keys(attrs)
		let attrsString = ''
		for (let j = 0; j < attrKeys.length; j++) {
			attrsString += `${attrKeys[i]}="${attrs[attrKeys[i]]}"`
		}
		optionsHtml += `
            <option
                value="${value}"
                ${!selected ? '' : 'selected="selected"'}
                ${!disabled ? '' : 'disabled="disabled"'}
                ${attrsString}
            >${text}</option>
        `
	}
	return optionsHtml
}

/**
 * @description 精确执行 setTimeout (https://mp.weixin.qq.com/s/v7YJAmMhzSAFzlJXY4mXTg)
 * @function ven$accurateSetTimeout
 * @param {function} callback 回调函数
 * @param {object} options 传递给回调函数的参数
 * @param {number} interval 回调函数的执行间隔
 * @return {void}
 */
function ven$accurateSetTimeout(callback, options = null, interval = (1 / 60) * 1000) {
	let loopCount = 0
	let startTimeStamp = performance.now()

	function instance() {
		const idealTimeStamp = loopCount++ * interval
		const realTimeStamp = performance.now() - startTimeStamp
		const timeStampDifference = realTimeStamp - idealTimeStamp
		const result = callback(options, { idealTimeStamp, realTimeStamp, timeStampDifference })
		if (result === false) {
			return
		}
		window.setTimeout(() => {
			instance()
		}, interval - timeStampDifference)
	}

	instance()
}

/**
 * @description 动态引入 script
 * @function ven$importScript
 * @param {string} src script url
 * @return {void}
 */
function ven$importScript(src) {
	const newScriptElement = document.createElement('script')
	newScriptElement.src = src
	newScriptElement.type = 'text/javascript'
	const nScriptElement = document.getElementsByTagName('script')[0]
	nScriptElement.parentNode.insertBefore(newScriptElement, nScriptElement)
}
