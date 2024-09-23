// JavaScript Dcoument

/*!
 * File Name : qzql.js
 * File Author :qzql
 * Edite Time : 2017.05
 * Copyright : null
 * Description :Inner
 */

//基础方法
;(function (window, undefined) {
	var eventDataArr = [
		'onclick',
		'ondblclick',
		'onmousedown',
		'onmouseup',
		'onmouseover',
		'onmousemove',
		'onmouseout',
		'onkeypress',
		'onkeydown',
		'onkeyup',
		'onabort',
		'onbeforeunload',
		'onerror',
		'onload',
		'onmove',
		'onresize',
		'onscroll',
		'onstop',
		'onunload',
		'onblur',
		'onchange',
		'onfocus',
		'onreset',
		'onsubmit',
		'onbounce',
		'onfinish',
		'onstart',
		'onbeforecopy',
		'onbeforecut',
		'onbeforeeditfocus',
		'onbeforepaste',
		'onbeforeupdate',
		'oncontextmenu',
		'oncopy',
		'oncut',
		'ondrag',
		'ondragdrop',
		'ondragend',
		'ondragenter',
		'ondragleave',
		'ondragover',
		'ondragstart',
		'ondrop',
		'onlosecapture',
		'onpaste',
		'onselect',
		'onselectstart',
		'onafterupdate',
		'oncellchange',
		'ondataavailable',
		'ondatasetchanged',
		'ondatasetcomplete',
		'onerrorupdate',
		'onrowenter',
		'onrowexit',
		'onrowsdelete',
		'onrowsinserted',
		'onafterprint',
		'onbeforeprint',
		'onfilterchange',
		'onhelp',
		'onpropertychange',
		'onreadystatechange',
	]

	var TMP = {}

	var ini = {
		// 获取 对象 类型
		classOf: function (obj) {
			if (obj === null || obj === undefined) {
				return 'Null'
			}
			return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() //返回数据检测类型字符串
		},

		// 检测 数组成员是否是element
		isElements: function (arr) {
			var flag = true
			if (ini.classOf(arr) == 'array') {
				for (var i = 0; i < arr.length; i++) {
					if (!arr[i].nodeType || arr[i].nodeType != 1 || arr[i].nodeType != 9) {
						flag = false
						break
					}
				}
			} else {
				flag = false
			}
			return flag
		},
	}

	var qzql = {
		// 触摸
		tap: function (obj) {
			if (!obj || ini.classOf(obj) != 'object' || !obj['element']) {
				return
			}
			var startClient,
				trigger = obj['trigger'] || 8
			obj['element'].addEventListener(
				'touchstart',
				function (e) {
					var touches = e.touches[0]
					;(startClient['clientX'] = touches.clientX), (startClient['clientY'] = touches.clientY)
				},
				false
			)
			obj['element'].addEventListener(
				'touchend',
				function (e) {
					var touches = e.changedTouches[0]
					//在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
					if (
						Math.abs(startClient['clientX'] - touches.clientX) < trigger &&
						Math.abs(startClient['clientY'] - touches.clientY) < trigger
					) {
						obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
					}
				},
				false
			)
		},

		// 双触摸
		doubleTap: function (obj) {
			if (!obj || ini.classOf(obj) != 'object' || !obj['element']) {
				return
			}
			var startClient = {},
				trigger = obj['trigger'] || 8,
				interval = obj['interval'] || 301,
				offset = obj['offset'] || 45,
				isTouchEnd = false,
				lastTime = 0,
				lastTx = null,
				lastTy = null,
				firstTouchEnd = true,
				body = document.documentElement || document.body,
				dTapTimer,
				startTx,
				startTy,
				startTime
			obj['element'].addEventListener(
				'touchstart',
				function (e) {
					if (dTapTimer) {
						clearTimeout(dTapTimer)
						dTapTimer = null
					}
					var touches = e.touches[0]
					;(startClient['clientX'] = touches.clientX), (startClient['clientY'] = touches.clientY)
				},
				false
			)
			obj['element'].addEventListener(
				'touchend',
				function (e) {
					var touches = e.changedTouches[0],
						endTx = touches.clientX,
						endTy = touches.clientY,
						now = Date.now(),
						duration = now - lastTime
					if (Math.abs(startClient['clientX'] - endTx) < trigger && Math.abs(startClient['clientX'] - endTx) < trigger) {
						//首先要确保能触发单次的 tap 事件
						if (duration < interval) {
							// 两次tap的间隔确保在500毫秒以内
							if (lastTx !== null && Math.abs(lastTx - endTx) < offset && Math.abs(lastTy - endTy) < offset) {
								//本次的tap位置和上一次的tap的位置允许一定范围内的误差
								firstTouchEnd = true
								lastTx = lastTy = null
								obj['fnBack'] && obj['fnBack'].call(obj['element'], touches)
							}
						} else {
							lastTx = endTx
							lastTy = endTy
						}
					} else {
						firstTouchEnd = true
						lastTx = lastTy = null
					}
					lastTime = now
				},
				false
			)
			//在iOS的safari上手指敲击屏幕的速度过快,有一定的几率会导致第二次不会响应touchstart和touchend事件
			//同时手指长时间的touch不会触发click
			if (~navigator.userAgent.toLowerCase().indexOf('iphone os')) {
				body.addEventListener(
					'touchstart',
					function (e) {
						startTime = Date.now()
					},
					true
				)
				body.addEventListener(
					'touchend',
					function (e) {
						var touches = e.changedTouches[0] || e.touches[0]
						var noLongTap = Date.now() - startTime < 501
						if (firstTouchEnd) {
							firstTouchEnd = false
							if (noLongTap && e.target === obj['element']) {
								dTapTimer = setTimeout(function () {
									firstTouchEnd = true
									lastTx = lastTy = null
									obj['fnBack'] && obj['fnBack'].call(obj['element'], touches)
								}, 400)
							}
						} else {
							firstTouchEnd = true
						}
					},
					true
				)
				//iOS上手指多次敲击屏幕时的速度过快不会触发 click 事件
				obj['element'].addEventListener(
					'click',
					function (e) {
						if (dTapTimer) {
							clearTimeout(dTapTimer)
							dTapTimer = null
							firstTouchEnd = true
						}
					},
					false
				)
			}
		},

		// 长按触摸
		longTap: function (obj) {
			if (!obj || ini.classOf(obj) != 'object' || !obj['element']) {
				return
			}
			var lTapTimer,
				startClient = {},
				prevent = obj['prevent'] || Boolean(false),
				propagation = obj['propagation'] || Boolean(true),
				interval = obj['interval'] || 700
			obj['propagation'] = propagation
			obj['element'].addEventListener(
				'touchstart',
				function (e) {
					if (lTapTimer) {
						clearTimeout(lTapTimer)
						lTapTimer = null
					}
					var touches = e.touches[0]
					;(startClient['clientX'] = touches.clientX), (startClient['clientY'] = touches.clientY)
					lTapTimer = setTimeout(function () {
						obj['fnBack'] && obj['fnBack'].call(obj['element'], startClient)
					}, interval)
					if (prevent === true) {
						e.preventDefault()
					}
					if (propagation === true) {
						e.stopPropagation()
					}
				},
				false
			)
			obj['element'].addEventListener(
				'touchmove',
				function (e) {
					var touches = e.touches[0]
					if (
						lTapTimer &&
						(Math.abs(touches.clientX - startClient['clientX']) > 5 || Math.abs(touches.clientY - startClient['startY']) > 5)
					) {
						clearTimeout(lTapTimer)
						lTapTimer = null
					}
				},
				false
			)
			obj['element'].addEventListener(
				'touchend',
				function (e) {
					if (lTapTimer) {
						clearTimeout(lTapTimer)
						lTapTimer = null
					}
				},
				false
			)
		},

		// 滑屏
		swipe: function (obj, innerCallBackFn) {
			if (!obj || ini.classOf(obj) != 'object' || !obj['element']) {
				return
			}
			var config = {},
				prevent = obj['prevent'] || Boolean(false),
				propagation = obj['propagation'] || Boolean(true),
				startClient = {},
				offsetX = obj['offsetX'] || 30,
				offsetY = obj['offsetY'] || 30
			obj['offset'] ? (offsetX = offsetY = obj['offset']) : void 0
			config['isTouchMove'] = ''
			obj['element'].BuiltInDirection = ''
			obj['propagation'] = propagation
			obj['element'].addEventListener(
				'touchstart',
				function (e) {
					var touches = e.targetTouches[0]
					if (e.targetTouches.length > 1) {
						return
					}
					;(startClient['clientX'] = touches.clientX), (startClient['clientY'] = touches.clientY)
					;(obj['element'].BuiltInGetLastClientX = startClient['clientX']), (obj['element'].BuiltInGetLastClientY = startClient['clientY'])
					config['isTouchMove'] = false
					obj['fnStart'] && obj['fnStart'].call(obj['element'], touches, startClient)
				},
				false
			)
			if (innerCallBackFn && ini.classOf(innerCallBackFn) == 'function') {
				innerCallBackFn(obj, startClient, config)
				return
			}
			obj['element'].addEventListener(
				'touchmove',
				function (e) {
					config['isTouchMove'] = true
					var touches = e.touches[0]
					if (e.targetTouches.length > 1) {
						return
					}
					if (prevent === true) {
						e.preventDefault()
					}
					if (propagation === true) {
						e.stopPropagation()
					}
					obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient)
				},
				false
			)
			obj['element'].addEventListener(
				'touchend',
				function (e) {
					var touches = e.touches[0]
					if (e.targetTouches.length > 1) {
						return
					}
					if (!config['isTouchMove']) {
						return
					}
					var touches = e.changedTouches[0],
						isSwipe = false
					if (
						Math.abs(startClient['clientX'] - touches.clientX) > offsetX ||
						Math.abs(startClient['clientY'] - touches.clientY) > offsetY
					) {
						obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
					}
				},
				false
			)
		},

		// 滑屏
		swipeUp: function (obj) {
			obj['relataxis'] = obj['relataxis'] ? obj['relataxis'] : Number(100)
			var single = typeof obj['single'] != 'undefined' ? obj['single'] : Boolean(true)
			qzql.swipe(obj, function (obj, startClient, config) {
				obj['element'].addEventListener(
					'touchmove',
					function (e) {
						config['isTouchMove'] = true
						var touches = e.touches[0]
						if (e.changedTouches.length > 1) {
							return
						}
						if (obj['prevent'] === true) {
							e.preventDefault()
						}
						if (obj['propagation'] === true) {
							e.stopPropagation()
						}
						if (touches.clientY - obj['element'].BuiltInGetLastClientY > 0) {
							//to bottom
							obj['element'].BuiltInGetLastClientY = touches.clientY
							if (!single) {
								if (
									Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
									Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
								) {
									obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, -1)
								}
							} else {
								return
							}
						} else {
							//to top
							obj['element'].BuiltInGetLastClientY = touches.clientY
							if (
								Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
								Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
							) {
								obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, 1)
							}
						}
					},
					false
				)
				obj['element'].addEventListener(
					'touchend',
					function (e) {
						var touches = e.touches[0]
						if (!config['isTouchMove']) {
							return
						}
						var touches = e.changedTouches[0],
							isSwipe = false,
							offset = obj['offsetY'] || obj['offset'] || 30
						if (
							Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
							Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
						) {
							if (touches.clientY - startClient['clientY'] < -1 * offset) {
								obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
								isSwipe = true
							}
						}
					},
					false
				)
			})
		},

		// 滑屏
		swipeDown: function (obj) {
			obj['relataxis'] = obj['relataxis'] ? obj['relataxis'] : Number(100)
			var single = typeof obj['single'] != 'undefined' ? obj['single'] : Boolean(true)
			qzql.swipe(obj, function (obj, startClient, config) {
				obj['element'].addEventListener(
					'touchmove',
					function (e) {
						config['isTouchMove'] = true
						var touches = e.touches[0]
						if (e.changedTouches.length > 1) {
							return
						}
						if (obj['prevent'] === true) {
							e.preventDefault()
						}
						if (obj['propagation'] === true) {
							e.stopPropagation()
						}
						if (touches.clientY - obj['element'].BuiltInGetLastClientY < 0) {
							//to top
							obj['element'].BuiltInGetLastClientY = touches.clientY
							if (!single) {
								if (
									Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
									Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
								) {
									obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, -1)
								}
							} else {
								return
							}
						} else {
							//to bottom
							obj['element'].BuiltInGetLastClientY = touches.clientY
							if (
								Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
								Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
							) {
								obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, 1)
							}
						}
					},
					false
				)
				obj['element'].addEventListener(
					'touchend',
					function (e) {
						var touches = e.touches[0]
						if (!config['isTouchMove']) {
							return
						}
						var touches = e.changedTouches[0],
							isSwipe = false,
							offset = obj['offsetY'] || obj['offset'] || 30
						if (
							Math.abs(touches.clientX - startClient['clientX']) < Math.abs(touches.clientY - startClient['clientY']) &&
							Math.abs(touches.clientX - startClient['clientX']) < obj['relataxis']
						) {
							if (touches.clientY - startClient['clientY'] > 1 * offset) {
								obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
								isSwipe = true
							}
						}
					},
					false
				)
			})
		},

		// 滑屏
		swipeLeft: function (obj) {
			obj['relataxis'] = obj['relataxis'] ? obj['relataxis'] : Number(25)
			var single = typeof obj['single'] != 'undefined' ? obj['single'] : Boolean(true)
			qzql.swipe(obj, function (obj, startClient, config) {
				obj['element'].addEventListener(
					'touchmove',
					function (e) {
						config['isTouchMove'] = true
						var touches = e.changedTouches[0]
						if (e.changedTouches.length > 1) {
							return
						}
						if (obj['prevent'] === true) {
							e.preventDefault()
						}
						if (obj['propagation'] === true) {
							e.stopPropagation()
						}
						if (touches.clientX - obj['element'].BuiltInGetLastClientX > 0) {
							//to right
							obj['element'].BuiltInGetLastClientX = touches.clientX
							if (!single) {
								if (
									Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
									Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
								) {
									obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, -1)
								}
							} else {
								return
							}
						} else {
							//to left
							obj['element'].BuiltInGetLastClientX = touches.clientX
							if (
								Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
								Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
							) {
								obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, 1)
							}
						}
					},
					false
				)
				obj['element'].addEventListener(
					'touchend',
					function (e) {
						var touches = e.touches[0]
						if (!config['isTouchMove']) {
							return
						}
						var touches = e.changedTouches[0],
							isSwipe = false,
							offset = obj['offsetY'] || obj['offset'] || 30
						if (
							Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
							Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
						) {
							if (touches.clientY - startClient['clientX'] < -1 * offset) {
								obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
								isSwipe = true
							}
						}
					},
					false
				)
			})
		},

		// 滑屏
		swipeRight: function (obj) {
			obj['relataxis'] = obj['relataxis'] ? obj['relataxis'] : Number(25)
			var single = typeof obj['single'] != 'undefined' ? obj['single'] : Boolean(true)
			qzql.swipe(obj, function (obj, startClient, config) {
				obj['element'].addEventListener(
					'touchmove',
					function (e) {
						config['isTouchMove'] = true
						var touches = e.changedTouches[0]
						if (e.changedTouches.length > 1) {
							return
						}
						if (obj['prevent'] === true) {
							e.preventDefault()
						}
						if (obj['propagation'] === true) {
							e.stopPropagation()
						}
						if (touches.clientX - obj['element'].BuiltInGetLastClientX < 0) {
							//to left
							obj['element'].BuiltInGetLastClientX = touches.clientX
							if (!single) {
								if (
									Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
									Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
								) {
									obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, -1)
								}
							} else {
								return
							}
						} else {
							//to right
							obj['element'].BuiltInGetLastClientX = touches.clientX
							if (
								Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
								Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
							) {
								obj['fnDuring'] && obj['fnDuring'].call(obj['element'], touches, startClient, 1)
							}
						}
					},
					false
				)
				obj['element'].addEventListener(
					'touchend',
					function (e) {
						var touches = e.touches[0]
						if (!config['isTouchMove']) {
							return
						}
						var touches = e.changedTouches[0],
							isSwipe = false,
							offset = obj['offsetY'] || obj['offset'] || 30
						if (
							Math.abs(touches.clientX - startClient['clientX']) > Math.abs(touches.clientY - startClient['clientY']) &&
							Math.abs(touches.clientY - startClient['clientY']) < obj['relataxis']
						) {
							if (touches.clientY - startClient['clientX'] > 1 * offset) {
								obj['fnBack'] && obj['fnBack'].call(obj['element'], touches, startClient)
								isSwipe = true
							}
						}
					},
					false
				)
			})
		},

		// 删除 空格
		trim: function (str, isAll) {
			if (ini.classOf(str) != 'string') {
				return
			}
			if (isAll && isAll === true) {
				//全局匹配,过滤所有空格
				if (String.prototype.trim) {
					return str == null ? '' : String.prototype.trim.call(str)
				} else {
					return str.replace(/\s*/g, '')
				}
			} else {
				//两端匹配,过滤两端空格
				return str.replace(/(^\s*)|(\s*$)/g, '')
			}
		},

		// 过滤 HTML标记
		trimHTMLTag: function (str, flag) {
			str = str.replace(/<\/?[^>]*>/g, '') //去除HTML tag
			str = str.replace(/[|]*\n/g, '\n') //去除行尾空白
			str = str.replace(/&nbsp;/gi, '') //去掉&nbsp;
			if (flag) {
				str = str.replace(/\n[\s||]*\r/g, '\n') //去除多余空行
			}
			return str
		},

		// 检测 数字
		isNumber: function (str) {
			return !isNaN(str)
		},

		// 检测 PlusDecimal
		isPlusDecimal: function (str) {
			return /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(str)
		},

		// 检测 Date
		isDate: function (str) {
			return /^(?:(?:1[6-9]|[2-9][0-9])[0-9]{2}([-/.] ? )( ? : ( ? :0 ? [1 - 9] | 1[0 - 2])\1( ? :0 ? [1 - 9] | 1[0 - 9] | 2[0 - 8]) | ( ? :0 ? [13 - 9] | 1[0 - 2])\1( ? :29 | 30) | ( ? :0 ? [13578] | 1[02])\1( ? :31)) | ( ? :( ? :1[6 - 9] | [2 - 9][0 - 9])( ? :0[48] | [2468][048] | [13579][26]) | ( ? :16 | [2468][048] | [3579][26]) 00)([ - /.]?)0?2\2(?:29))(\s+([01][0-9]:|2[0-3]:)?[0-5][0-9]:[0-5][0-9])?$/.text(
				str
			)
		},

		// 检测 是否为空
		isEmpty: function (str) {
			return str == null || str == undefined || this.trim(str) == '' ? true : false
		},

		// 获取 GUID
		newGUID: function () {
			function _sub() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
			}
			return _sub() + _sub() + '-' + _sub() + '-' + _sub() + '-' + _sub() + '-' + _sub() + _sub() + _sub()
		},

		// 数组 去重
		unique: function (arr) {
			if (ini.classOf(arr) != 'array') {
				return arr
			}
			var result = [],
				hash = {}
			for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				if (!hash[elem]) {
					result.push(elem)
					hash[elem] = true
				}
			}
			return result
		},

		// 数组 快速排序 正序
		quickSeqSort: function (arr) {
			if (arr.length <= 1) {
				return arr
			}
			var left_arr = [],
				right_arr = []
			var mid_num = Math.floor(arr.length / 2),
				mid_value = arr.splice(mid_num, 1)
			for (var i = 0; i < arr.length; i++) {
				arr[i] < mid_value ? left_arr.push(arr[i]) : right_arr.push(arr[i])
			}
			return this.quickSeqSort(left_arr).concat([mid_value], this.quickSeqSort(right_arr))
		},

		// 数组 快速排序 逆序
		quickInvSort: function (arr) {
			if (arr.length <= 1) {
				return arr
			}
			var left_arr = [],
				right_arr = []
			var mid_num = Math.floor(arr.length / 2),
				mid_value = arr.splice(mid_num, 1)
			for (var i = 0; i < arr.length; i++) {
				arr[i] > mid_value ? left_arr.push(arr[i]) : right_arr.push(arr[i])
			}
			return this.quickInvSort(left_arr).concat([mid_value], this.quickSeqSort(right_arr))
		},

		// ready
		ready: function (callback) {
			if (ini.classOf(callback) == 'function') {
				//检测传参是否为function类型
				if (document.addEventListener) {
					//DOM事件监听
					document.addEventListener(
						'DOMContentLoaded',
						function () {
							doReady()
							document.removeEventListener('DOMContentLoaded', arguments.callee)
						},
						false
					)
				}
			}
			var doReady = function () {
				callback()
			}
		},

		// 获取 匹配元素
		query: function (selector, context) {
			if (typeof selector == 'undefined') {
				//无传参时退出
				return
			}
			if (ini.classOf(selector) == 'string') {
				//CSS选择器字符串
				var tmp
				if (typeof context == 'undefined') {
					//"上下文"未定义
					tmp = qzql.qzql_FIND_NODE(selector, document)
				} else if (context && (context.nodeType == 1 || context.nodeType == 9)) {
					//"上下文"定义为节点类型
					tmp = qzql.qzql_FIND_NODE(selector, context)
				} else {
					//"上下文"定义为字符串类型
					var pt = qzql.qzql_FIND_NODE(context, document)
					tmp = qzql.qzql_FIND_NODE(selector, pt)
				}
				return tmp
			} else if (selector) {
				//节点类型传参
				if (selector.nodeType == 1 || selector.nodeType == 9) {
					return selector
				} else if (ini.classOf(selector) == 'nodelist' || ini.classOf(selector) == 'htmlcollection') {
					return selector[0]
				}
			}
		},

		// 获取 所有匹配元素
		queryAll: function (selector, context) {
			if (typeof selector == 'undefined') {
				//无传参时退出
				return
			}
			var tmp = []
			if (ini.classOf(selector) == 'string') {
				//CSS选择器字符串
				if (typeof context == 'undefined') {
					//"上下文"未定义
					tmp = qzql.qzql_FIND_NODE_ALL(selector, document)
				} else if (context && (context.nodeType == 1 || context.nodeType == 9)) {
					//"上下文"定义为节点类型
					tmp = qzql.qzql_FIND_NODE_ALL(selector, context)
				} else {
					//"上下文"定义为字符串类型
					var pt = qzql.qzql_FIND_NODE(context, document)
					tmp = qzql.qzql_FIND_NODE_ALL(selector, pt)
				}
				return tmp
			} else if (selector) {
				//节点类型传参
				if (selector.nodeType == 1 || selector.nodeType == 9) {
					tmp.push(selector)
					return tmp
				} else if (ini.classOf(selector) == 'nodelist' || ini.classOf(selector) == 'htmlcollection') {
					return selector
				} else {
					return []
				}
			}
		},

		// 获取 匹配元素中的指定序号元素
		eq: function (selector, index) {
			var tmp = this.queryAll(selector)
			if (ini.classOf(tmp) == 'nodelist' || ini.classOf(tmp) == 'htmlcollection') {
				//检测类型是否为节点类数组
				var _index = index >= tmp.length - 1 ? tmp.length - 1 : index < 0 ? 0 : index //"越界"溢出兼容
				return tmp[_index]
			}
		},

		// 获取 匹配元素中的第一个元素
		first: function (selector, context) {
			return this.eq(this.queryAll(selector, context), 0)
		},

		// 获取 匹配元素中的最后一个元素
		last: function (selector, context) {
			var tmp = this.queryAll(selector, context)
			if (tmp) {
				return this.eq(tmp, tmp.length - 1)
			}
		},

		// 获取 匹配元素的所在兄弟节点列表中的索引
		index: function (selector) {
			var tmp = this.query(selector, document)
			if (tmp) {
				return Array.prototype.slice.call(tmp.parentNode.children).indexOf(tmp) //返回匹配索引值
			}
		},

		// 获取 下一个兄弟节点
		next: function (selector, condition) {
			if (arguments.length <= 0) {
				return
			}
			var tmp = this.query(selector) //匹配节点或者选择器,返回节点
			if (!tmp) {
				return
			}
			var tmpParent = tmp.parentNode,
				arrTmp = Array.prototype.slice.call(tmpParent.children),
				_index = this.index(tmp) //获取参考节点的索引值
			if (_index == arrTmp.length - 1) {
				return tmp //当参考节点(selector)索引为其父节点的子节点类数组的最后一项时,返回自身
			}
			if (typeof condition == 'undefined') {
				//限制条件未定义
				return tmp.nextSibling
			} else if (ini.classOf(condition) == 'string') {
				//定义限制条件为字符串
				var arrAllTmp = this.queryAll(condition, tmpParent), //在参考节点的父节点的子节点列表中匹配符合限制条件的子节点列表
					arrIndex = [],
					rt
				for (var i = 0; i < arrAllTmp.length; i++) {
					arrIndex[i] = this.index(arrAllTmp[i]) //获取所有由限制条件匹配到的节点的索引值
				}
				findIndex: for (var j = 0; j < arrIndex.length; j++) {
					if (arrIndex[j] > _index) {
						//查询索引值大于参考节点的索引值的最小索引值所对应的节点
						rt = arrTmp[arrIndex[j]]
						break findIndex
					}
				}
				return rt
			}
		},

		// 获取 上一个兄弟节点
		prev: function (selector, condition) {
			if (arguments.length <= 0) {
				return
			}
			var tmp = this.query(selector) //匹配节点或者选择器,返回节点
			if (!tmp) {
				return
			}
			var tmpParent = tmp.parentNode,
				arrTmp = Array.prototype.slice.call(tmpParent.children),
				_index = this.index(tmp) //获取参考节点的索引值
			if (_index == 0) {
				return tmp //当参考节点(selector)索引为其父节点的子节点类数组的第一项时,返回自身
			}
			if (typeof condition == 'undefined') {
				//限制条件未定义
				return tmp.previousSibling
			} else if (ini.classOf(condition) == 'string') {
				//定义限制条件为字符串
				var arrAllTmp = this.queryAll(condition, tmpParent) //在参考节点的父节点的子节点列表中匹配符合限制条件的子节点列表
				var arrIndex = [],
					rt,
					k
				for (var i = 0; i < arrAllTmp.length; i++) {
					arrIndex[i] = this.index(arrAllTmp[i]) //获取所有由限制条件匹配到的节点的索引值
				}
				findIndex: for (var j = 0; j < arrIndex.length; j++) {
					if (arrIndex[j] > _index) {
						//获取索引值大于参考节点的索引值的最小索引值
						k = j
						break findIndex
					}
				}
				rt = arrTmp[arrIndex[k - 1]]
				return rt
			}
		},

		// 获取 父节点
		parent: function (selector) {
			var tmp = this.query(selector), //匹配节点
				node
			if (tmp) {
				return (node = tmp.nodeType == 9 ? tmp : tmp.parentNode)
			}
		},

		// 获取 父节点
		getParents: function (element, className) {
			var returnParentElement = null
			function getParentNode(element, className) {
				if (element && element.classList.contains(className) && element.tagName.toLowerCase() != 'body') {
					returnParentElement = element
				} else {
					getParentNode(element.parentNode, className)
				}
			}
			getParentNode(element, className)
			return returnParentElement
		},

		// 获取 父节点
		childs: function (selector, condition) {
			if (typeof selector == 'undefined') {
				return
			}
			var tmp = this.query(selector)
			if (!tmp) {
				return
			}
			var arrTmp = Array.prototype.slice.call(tmp.children) //返回匹配节点类数组
			if (typeof condition == 'undefined') {
				//限制条件未定义
				return arrTmp
			} else if (ini.classOf(condition) == 'string') {
				//定义限制条件为字符串
				var arr = [],
					arrAllTmp = this.queryAll(condition, tmp.parentNode)
				for (var i = 0; i < arrTmp.length; i++) {
					var t = arrTmp[i]
					for (var j = 0; j < arrAllTmp.length; j++) {
						if (t == arrAllTmp[j]) {
							arr.push(arrAllTmp[j])
						}
					}
				}
				return arr
			}
		},

		// 创建 元素节点
		create: function (labelstring) {
			if (typeof labelstring == 'undefined') {
				return
			}
			var regs_out = /<\/?[^>]*>/gi, //<><>...正则匹配
				regs_inr = /<(.*)>/i, //<...>正则匹配
				serialize_str = serializeNodeString(regs_out, regs_inr, labelstring)
			return createHTMLNode(serialize_str)
			//将字符串转换成节点标识字符串("'div','<div>','</div>'" => "div")
			function serializeNodeString(regs_out_str, regs_inr_str, labelstring) {
				var res_tmp = labelstring.match(regs_out_str)
				var fn_regs_out
				if (!res_tmp) {
					return labelstring
				}
				fn_regs_out = res_tmp[0]
				fn_regs_out.indexOf('/') != -1
					? (fn_regs_out = fn_regs_out.match(regs_inr)[1].substring(1))
					: (fn_regs_out = fn_regs_out.match(regs_inr)[1])
				return fn_regs_out
			}
			//创建DOM节点
			function createHTMLNode(serializeLabelstring) {
				var tmpNode
				try {
					tmpNode = document.createElement(serializeLabelstring)
				} catch (e) {}
				return tmpNode
			}
		},

		// 包裹 元素节点
		wrapWidth: function (selector, labelstring) {
			var tmp = this.query(selector)
			if (!tmp) {
				return
			}
			if (tmp.nodeType == 1 || tmp.nodeType == 3) {
				var tmpParent = tmp.parentNode,
					tmpNextNode = tmp.nextSibling,
					createEle = this.create(labelstring)
				createEle.appendChild(tmp)
				tmpParent.insertBefore(createEle, tmpNextNode)
				return createEle
			}
		},

		// 包裹 所有匹配的元素节点
		allWrapWidth: function (selector, labelstring) {
			var tmp = this.queryAll(selector) || {},
				flag = true
			var tmp_len = tmp.length || 0
			for (var i = 0; i < tmp_len; i++) {
				if (!this.wrapWidth(tmp[i], labelstring)) {
					flag = false
				}
			}
			return flag
		},

		// 清空 所有匹配的元素节点的所有子节点
		empty: function (selector) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				tmp[i].innerHTML = ''
			}
		},

		// 清空 所有匹配的元素节点的所有子节点
		remove: function (selector, condition) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			var tmp_n, tmp_p
			if (typeof condition == 'undefined' || condition == 'undefined') {
				for (var i = 0; i < len; i++) {
					tmp_p = tmp[i].parentNode
					tmp_p.removeChild(tmp[i])
				}
			} else {
				//
			}
		},

		// 添加 子节点内容, 在子节点末尾添加内容
		append: function (selector, html) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (html && html.nodeType == 1) {
					tmp[i].insertAdjacentElement('beforeend', html)
				} else {
					tmp[i].insertAdjacentHTML('beforeend', html)
				}
			}
		},

		// 添加 子节点内容, 在子节点前面添加内容
		preappend: function (selector, html) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (html && html.nodeType == 1) {
					tmp[i].insertAdjacentElement('afterbegin', html)
				} else {
					tmp[i].insertAdjacentHTML('afterbegin', html)
				}
			}
		},

		// 添加 节点内容, 在匹配节点前添加内容
		before: function (selector, html) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (html && html.nodeType == 1) {
					tmp[i].insertAdjacentElement('beforebegin', html)
				} else {
					tmp[i].insertAdjacentHTML('beforebegin', html)
				}
			}
		},

		// 添加 节点内容, 在匹配节点后添加内容
		after: function (selector, html) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (html && html.nodeType == 1) {
					tmp[i].insertAdjacentElement('afterend', html)
				} else {
					tmp[i].insertAdjacentHTML('afterend', html)
				}
			}
		},

		// 检测 节点class列表是否包含指定class名
		hasClass: function (selector, clsName) {
			var tmp = this.query(selector) || {},
				result
			if (tmp.nodeType == 1 || tmp.nodeType == 9) {
				return (result = new RegExp('(\\s|^)' + clsName + '(\\s|$)').test(tmp.className))
			}
		},

		// 添加 指定class名
		addClass: function (selector, clsName) {
			var tmp = this.queryAll(selector) || {}
			if (!tmp) {
				return
			}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (!this.hasClass(tmp[i], clsName)) {
					tmp[i].className += ' ' + clsName
				}
			}
		},

		// 删除 指定class名
		removeClass: function (selector, clsName) {
			var tmp = this.queryAll(selector) || {}
			if (!tmp) {
				return
			}
			var len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				if (this.hasClass(tmp[i], clsName)) {
					tmp[i].className = tmp[i].className.replace(new RegExp('(\\s|^)' + clsName + '(\\s|$)'), '')
				}
			}
		},

		// 获取 元素节点的尺寸位置属性
		offset: function (selector) {
			var tmp = this.query(selector)
			if (!tmp) {
				return {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
				}
			}
			var scrollleft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
				scrolltop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
				rect = tmp.getBoundingClientRect()
			return {
				left: rect.left + scrollleft,
				top: rect.top + scrolltop,
				width: tmp.offsetWidth,
				height: tmp.offsetHeight,
				cwidth: rect.right - rect.left,
				cheight: rect.bottom - rect.top,
			}
		},

		// 获取 指定的计算后的样式
		getStyle: function (selector, propName) {
			var tmp = this.query(selector) || {}
			if (tmp.nodeType == 1 || tmp.nodeType == 9) {
				if (typeof window.getComputedStyle != 'undefined') {
					return window.getComputedStyle(tmp, null)[propName]
				}
			}
		},

		// 设置 指定的计算后的样式
		setStyle: function (selector, cssString) {
			var tmp = this.queryAll(selector) || {},
				len = tmp.length || 0
			for (var i = 0; i < len; i++) {
				tmp[i].style.cssText += cssString
			}
		},

		// 设置 or 获取 指定的transform属性
		cssTransform: function (selector, attr, val) {
			var tmp = this.queryAll(selector) || {},
				len = tmp.length || 0
			if (len <= 0) {
				return
			}
			if (arguments.length > 2) {
				for (var i = 0; i < len; i++) {
					_set_csstransform(tmp[i], attr, val)
				}
			} else {
				tmp = tmp[0]
				return _get_csstransform(tmp, attr, val)
			}
			function _get_csstransform(el, attr, val) {
				var _transform = el.transform || {},
					val = _transform[attr]
				if (typeof val == 'undefined') {
					if (attr == 'scale' || attr == 'scaleX' || attr == 'scaleY') {
						val = 1
					} else {
						val = 0
					}
				}
				return val
			}
			function _set_csstransform(el, attr, val) {
				if (!el.transform) {
					el.transform = {}
				}
				el.transform[attr] = val
				var sVal = ''
				for (var s in el.transform) {
					switch (s) {
						case 'rotate':
						case 'skewX':
						case 'skewY':
							sVal += s + '(' + el.transform[s] + 'deg)'
							break
						case 'translateX':
						case 'translateY':
						case 'translateZ':
							sVal += s + '(' + el.transform[s] + 'px)'
							break
						case 'scaleX':
						case 'scaleY':
						case 'sacleZ':
						case 'scale':
							sVal += s + '(' + el.transform[s] + ')'
							break
					}
					el.style.OTransform = el.style.MozTransform = el.style.WebkitTransform = el.style.transform = sVal
				}
			}
		},

		// 设置 or 获取 指定的样式
		css: function (selector, parms) {
			var tmp = this.queryAll(selector) || {},
				len = tmp.length || 0,
				_this = this
			if (len <= 0) {
				return
			}
			if (ini.classOf(parms) == 'object') {
				for (var i = 0; i < len; i++) {
					_set_cssStyle(tmp[i], parms)
				}
			} else if (ini.classOf(parms) == 'string') {
				return _get_cssStyle(tmp[0], parms)
			}
			function _get_cssStyle(el, attr) {
				var sCur = _this.getStyle(el, attr),
					offset
				if (sCur.toString() == 'auto') {
					offset = _this.offset(el)
					switch (attr) {
						case 'height':
							sCur = offset.height
							break
						case 'width':
							sCur = offset.width
							break
						case 'top':
							sCur = offset.top
							break
						case 'left':
							sCur = offset.left
							break
					}
				}
				return sCur
			}
			function _set_cssStyle(el, parms) {
				var value
				for (var attr in parms) {
					value = parms[attr]
					switch (attr) {
						case 'width':
						case 'height':
						case 'minWidth':
						case 'minHeight':
						case 'maxWidth':
						case 'maxHeight':
						case 'padding':
						case 'paddingLeft':
						case 'paddingTop':
						case 'paddingRight':
						case 'paddingBottom':
							value = Math.max(parms[attr], 0)
						case 'left':
						case 'top':
						case 'marginLeft':
						case 'marginTop':
						case 'marginRight':
						case 'marginBottom':
						case 'fontSize':
						case 'lineHeight':
							el.style[attr] = value + 'px'
							break
						case 'opacity':
							el.style.filter = 'alpha(opacity:' + value + ')'
							el.style.opacity = value / 100
							break
						default:
							el.style[attr] = parms[attr]
					}
				}
			}
		},

		// 获取 or 设置 文本内容
		text: function (selector, txt) {
			if (typeof txt == 'undefined') {
				var tmp = this.query(selector) || {}
				if (!tmp) {
					return
				}
				return tmp.textContent
			} else {
				if (ini.classOf(txt) == 'string') {
					var tmp = this.queryAll(selector)
					var len = tmp.length || 0
					for (var i = 0; i < len; i++) {
						tmp[i].textContent = txt
					}
				}
			}
		},

		// 获取 or 设置 HTML内容
		html: function (selector, html) {
			if (typeof html == 'undefined') {
				var tmp = this.query(selector) || {}
				if (!tmp) {
					return
				}
				return tmp.innerHTML
			} else {
				if (ini.classOf(html) == 'string') {
					var tmp = this.queryAll(selector) || {}
					var len = tmp.length || 0
					for (var i = 0; i < len; i++) {
						tmp[i].innerHTML = html
					}
				}
			}
		},

		// 获取 or 设置 元素节点属性
		attr: function (selector, data) {
			var tmp = this.queryAll(selector) || {},
				len = tmp.length || 0,
				tmp_n
			if (ini.classOf(data) == 'object') {
				for (var i = 0; i < len; i++) {
					tmp_n = tmp[i]
					for (var key in data) {
						tmp_n.setAttribute(key, data[key])
					}
				}
			} else if (ini.classOf(data) == 'string') {
				if (len > 0) {
					return tmp[0].getAttribute(data)
				}
			}
		},

		// 删除 元素节点属性
		removeAttr: function (selector, str) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			if (ini.classOf(str) == 'string') {
				for (var i = 0; i < len; i++) {
					tmp[i].removeAttribute(str)
				}
			}
		},

		// 获取 or 设置 元素DOM属性
		data: function (selector, data) {
			var tmp = this.queryAll(selector) || {},
				len = tmp.length || 0,
				tmp_n
			if (ini.classOf(data) == 'object') {
				for (var i = 0; i < len; i++) {
					tmp_n = tmp[i]
					for (var key in data) {
						tmp_n[key] = data[key]
					}
				}
			} else if (ini.classOf(data) == 'string') {
				if (len > 0) {
					return tmp[0][data]
				}
			}
		},

		// 删除 元素DOM属性
		removeData: function (selector, str) {
			var tmp = this.queryAll(selector) || {}
			var len = tmp.length || 0
			if (ini.classOf(str) == 'string') {
				for (var i = 0; i < len; i++) {
					tmp[i][str] = undefined
				}
			}
		},

		// 设置 存储storage
		storage: function (key, value) {
			if (arguments.length <= 0) {
				return
			}
			var ls = qzql.qzql_UZ_STROAGE()
			if (arguments.length == 1 && ls) {
				var v = ls.getItem(key)
				if (!v) {
					return
				}
				if (v.indexOf('obj-') === 0) {
					return JSON.parse(v.slice(4))
				} else if (v.indexOf('str-') === 0) {
					return v.slice(4)
				}
			} else if (arguments.length === 2 && ls) {
				var v = value
				if (typeof v == 'object') {
					v = JSON.stringify(v)
					v = 'obj-' + v
				} else {
					v = 'str-' + v
				}
				ls.setItem(key, v)
			}
		},

		// 删除 对应键名的存储storage
		rmStorage: function (key) {
			var ls = qzql.qzql_UZ_STROAGE()
			if (ls && key) {
				ls.removeItem(key)
			}
		},

		// 清空 存储storage
		clearStorage: function () {
			var ls = qzql.qzql_UZ_STROAGE()
			if (ls) {
				ls.clear()
			}
		},

		// 设置 会话session
		session: function (key, value) {
			if (arguments.length <= 0) {
				return
			}
			if (key && value) {
				window.sessionStorage.setItem(key.toString(), value)
			}
			if (key) {
				return window.sessionStorage.setItem(key.toString(), value)
			}
		},

		// 设置 异步请求Ajax
		ajax: function (obj) {
			qzql.nAjax(obj)
		},

		//设置 异步请求Ajax, 浏览器环境下调用
		//参数 obj
		//	   obj.username # 发送请求验证用户名
		//	   obj.password # 发送请求验证密码
		//	   obj.header # 设置发送的请求头
		//	   obj.rand # 是否设置url附带随机参数, true
		//	   obj.url # 设置的请求地址
		//	   obj.method # 设置请求方法
		//	   obj.timeout # 设置超时限制时间, 45s
		//	   obj.returnAll # 设置返回数据是否包含头信息
		//	   obj.success # 设置响应成功后的回调
		//	   obj.response # 设置请求后的回调
		//	   obj.async # 是否设置为异步请求, true
		//	   obj.dataType # 本地接收的数据预处理类型
		//	   obj.data # 发送的数据json
		nAjax: function (obj) {
			var defaultConfig = {
				username: '',
				password: '',
				header: 'application/x-www-form-urlencoded',
				rand: true,
				url: 'http://127.0.0.1/',
				method: 'get',
				timeout: 45,
				returnAll: false,
				success: function () {
					return true
				},
				response: function () {
					return true
				},
				async: true,
				dataType: 'json',
				data: {},
			}
			var argsuments = ini.INI_EXTEND_OBJ(obj, defaultConfig),
				XHR = iniAjax(),
				timeoutFlag,
				timeoutTimer
			checkParam(argsuments)
			runAjax(argsuments)
			//参数检测
			function checkParam(argsuments) {
				argsuments.timeout = argsuments.timeout > 500 ? argsuments.timeout : 500
				if (ini.classOf(argsuments.data.values) == 'object') {
					argsuments.data = argsuments.data.values
				}
			}
			//序列化参数data属性对象
			function parsDataeArguments(data, traditional) {
				var _this = this
				var arr = [],
					name,
					rbracket = /\[\]$/,
					r20 = /%20/g,
					rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
					rsubmittable = /^(?:input|select|textarea|keygen)/i
				if (ini.classOf(data) == 'array' || ini.classOf(data) != 'object') {
					for (var attr in data) {
						add(attr, data[attr])
					}
				} else {
					for (var prefix in data) {
						buildParams(prefix, data[prefix], false)
					}
				}
				function buildParams(prefix, obj, traditional) {
					if (ini.classOf(obj) == 'array') {
						for (var prop in obj) {
							if (traditional || rbracket.test(prefix)) {
								add(prefix, obj[prop])
							} else {
								buildParams(prefix + '[' + (typeof obj[prop] === 'object' ? prop : '') + ']', obj[prop], traditional)
							}
						}
					} else if (!traditional && typeof obj == 'object') {
						for (var prop in obj) {
							buildParams(prefix + '[' + prop + ']', obj[prop], traditional)
						}
					} else {
						try {
							add(prefix, obj)
						} catch (e) {}
					}
				}
				function add(key, value) {
					value = ini.classOf(value) == 'function' ? value() : value == null ? '' : value
					arr[arr.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
				}
				return arr.join('&').replace(r20, '+')
			}
			//初始化XMLHttpRequest对象
			function iniAjax() {
				return new XMLHttpRequest()
			}
			//运行ajax方法
			function runAjax(argsuments) {
				var xhr = XHR,
					_this = this
				if (argsuments.rand == false) {
					argsuments.url = argsuments.url + '?rand=' + Math.random()
				}
				argsuments.data = parsDataeArguments(argsuments.data)
				if (argsuments.method === 'get') {
					argsuments.url =
						argsuments.url.indexOf('?') == -1 ? argsuments.url + '?' + argsuments.data : argsuments.url + '&' + argsuments.data
				}
				timeoutFlag = true
				xhr.open(argsuments.method, argsuments.url, argsuments.async, argsuments.username, argsuments.password)
				if (argsuments.async == true) {
					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) {
							callBackFn()
						}
					}
				}
				if (argsuments.method === 'post') {
					xhr.setRequestHeader('Content-Type', argsuments.header)
					xhr.send(argsuments.data)
				} else {
					xhr.send(null)
				}
				if (argsuments.async === false) {
					callBackFn()
				}
				if (argsuments.async) {
					timeoutTimer = window.setTimeout(function () {
						if (_this.timeoutFlag) {
							xhr.abort()
							callBackFn()
						}
					}, argsuments.timeout * 1000)
				}
			}
			//执行回调处理
			function callBackFn() {
				clearTimeout(timeoutTimer)
				timeoutFlag = false
				var xhr = XHR,
					_this = this
				var callBackResponse = {
					header: {},
					body: '',
				}
				if (xhr.status == 200) {
					try {
						callBackResponse['header']['Date'] = xhr.status
						callBackResponse['header']['Server'] = xhr.statusText
						callBackResponse['header']['Content-Type'] = xhr.status
					} catch (e) {}
					callBackResponse['header']['status'] = xhr.status
					callBackResponse['header']['statusText'] = xhr.statusText
					switch (argsuments.dataType.toLowerCase()) {
						case 'text':
							callBackResponse['body'] = serializeText(xhr.responseText)
							break
						case 'json':
							callBackResponse['body'] = serializeJSON(xhr.responseText)
							break
						default:
							callBackResponse['body'] = serializeJSON(xhr.responseText)
					}
					if (argsuments.returnAll) {
						argsuments.success.call(
							xhr,
							callBackResponse || {
								body: '',
								header: {},
							},
							null
						) //回调
					} else {
						argsuments.success.call(xhr, callBackResponse['body'] || '', null) //回调
					}
					argsuments.response.call(this, xhr.responseText)
				} else {
					callBackResponse['header']['status'] = xhr.status
					callBackResponse['header']['statusText'] = xhr.statusText
					if (argsuments.returnAll) {
						argsuments.success.call(xhr, callBackResponse['body'] || '', callBackResponse['header']) //回调
					} else {
						argsuments.success.call(xhr, '', callBackResponse['header']) //回调
					}
				}
			}
			//JSON序列化回调响应
			function serializeJSON(source) {
				var tmp
				try {
					tmp = source.replace(/(^\s*)|(\s*$)/g, '')
					if (JSON) {
						return (tmp = JSON.parse(tmp) || '')
					}
				} catch (e) {}
			}
			//预处理回调响应
			function serializeText(source) {
				return source.replace(/(^\s*)|(\s*$)/g, '')
			}
		},

		// 设置 将json转换成string
		json2str: function (json) {
			var tmp
			if (ini.classOf(json) == 'object') {
				try {
					tmp = JSON && JSON.stringify(json)
				} catch (e) {}
				return tmp
			} else {
				return json
			}
		},

		// 设置 将string尝试转换成json
		str2json: function (str) {
			var tmp
			if (ini.classOf(str) == 'string') {
				try {
					tmp = JSON && JSON.parse(str)
				} catch (e) {}
				return tmp
			} else {
				return str
			}
		},

		// 设置 序列化form控件
		serializeForm: function (form) {
			if (form.nodeType == 1 && form.tagName.toLowerCase() == 'form') {
				var content = {},
					parts = [],
					field,
					form_element_len = form.elements.length,
					checkbox_string = ''
				for (var i = 0; i < form_element_len; i++) {
					//循环遍历表单控件
					var field = form.elements[i]
					switch (field.type) {
						case 'select-one':
						case 'select-multiple':
							for (var j = 0; j < field.options.length; j++) {
								var option = field.options[j]
								if (option.selected) {
									var optValue = ''
									if (option.hasAttribute) {
										optValue = option.hasAttribute('value') ? option.value : option.text
									} else if (option.attributes) {
										optValue = option.attributes['value'].specified ? option.value : option.text
									}
									content[field.name] = optValue
								}
							}
							break
						case undefined:
						case 'file':
						case 'submit':
						case 'reset':
						case 'button':
							break
						case 'checkbox':
							if (field.checked) {
								checkbox_string += ',' + field.value
								content[field.name] = checkbox_string.substring(1) //过滤字符串首字符串(",")
								break
							}
						case 'radio':
							if (!field.checked) {
								break
							}
						default:
							content[field.name] = field.value
					}
				}
				return content
			}
		},

		// 设置 渲染TPPL模板引擎
		tppl: function (tpl, data) {
			var fn = function (d) {
				var i,
					k = [],
					v = []
				for (i in d) {
					k.push(i)
					v.push(d[i])
				}
				return new Function(k, fn.$).apply(d, v)
			}
			if (!fn.$) {
				var tpls = tpl.split('<%')
				fn.$ = "var $=''"
				for (var t = 0; t < tpls.length; t++) {
					var p = tpls[t].split('%>')
					if (t != 0) {
						fn.$ += '=' == p[0].charAt(0) ? '+(' + p[0].substr(1) + ')' : ';' + p[0].replace(/\r\n/g, '') + '$=$'
					}
					fn.$ += "+'" + p[p.length - 1].replace(/\'/g, "\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + "'"
				}
				fn.$ += ';return $;'
				//log(fncss
			}
			return data ? fn(data) : fn
		},

		// 设置 模板渲染调用
		renderTpl: function (tpplId, htmlId, arrData, key) {
			if (!key || ini.classOf(key) != 'string') {
				var data = {
					list: arrData,
				}
			} else {
				var data = {}
				data[key] = arrData
			}
			try {
				var render = qzql.tppl(qzql.query(tpplId).innerHTML)
				qzql.query(htmlId).innerHTML += render(data)
			} catch (e) {}
		},

		// 获取 所有的兄弟节点
		siblings: function (selector) {
			var tmp = qzql.query(selector) || {}
			if (!tmp) {
				return
			}
			var n = tmp.parentNode.firstChild,
				r = []
			for (; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== tmp) {
					r.push(n)
				}
			}
			return r
		},

		// 设置 事件绑定
		bind: function (elements, eventType, callback, useCapture) {
			useCapture = useCapture || false
			if (!elements) {
				return
			}
			if (ini.classOf(elements) == 'nodelist' || ini.classOf(elements) == 'htmlcollection') {
				for (var i = 0; i < elements.length; i++)
					elements[i].addEventListener(
						eventType,
						function (event) {
							if (ini.classOf(callback) == 'function') {
								event.stopPropagation()
								callback.call(event.target, event, elements[i])
							}
						},
						useCapture
					)
			} else if (elements.nodeType == 1 || elements.node == 9) {
				elements.addEventListener(
					eventType,
					function (event) {
						if (ini.classOf(callback) == 'function') {
							event.stopPropagation()
							callback.call(event.target, event, elements)
						}
					},
					useCapture
				)
			} else if (elements == window) {
				elements.addEventListener(
					eventType,
					function (event) {
						if (ini.classOf(callback) == 'function') {
							event.stopPropagation()
							callback.call(event.target, event, elements)
						}
					},
					useCapture
				)
			}
		},

		// 删除 事件绑定
		unbind: function (elements, eventType, callback, useCapture) {
			useCapture = useCapture || false
			if (ini.isElements(elements)) {
				if (elements.length > 0) {
					for (var i = 0; i < elements.length; i++)
						elements[i].removeEventListener(
							eventType,
							function (event) {
								if (ini.classOf(callback) == 'function') {
									callback(event)
								}
							},
							useCapture
						)
				} else {
					elements.removeEventListener(
						eventType,
						function (event) {
							if (ini.classOf(callback) == 'function') {
								callback(event)
							}
						},
						useCapture
					)
				}
			}
		},

		// 设置 一次执行事件
		one: function (elements, eventType, callback, useCapture) {
			var fn = function (event) {
				callback && callback()
				qzql.unbind(lements, eventType, callback, useCapture)
			}
			qzql.bind(elements, eventType, fn, useCapture)
		},

		// 获取 文档高度
		getDocumentHeight: function () {
			var scrollHeight = 0,
				bodyScrollHeight = 0,
				documentScrollHeight = 0
			if (document.body) {
				bodyScrollHeight = document.body.scrollHeight
			}
			if (document.documentElement) {
				documentScrollHeight = document.documentElement.scrollHeight
			}
			scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight
			return scrollHeight
		},

		// 获取 滚动条高度
		getScrollTop: function () {
			var scrollTop = 0,
				bodyScrollTop = 0,
				documentScrollTop = 0
			if (document.body) {
				bodyScrollTop = document.body.scrollTop
			}
			if (document.documentElement) {
				documentScrollTop = document.documentElement.scrollTop
				scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
			}
			return scrollTop
		},

		// 获取window高度
		getWindowHeight: function () {
			var windowHeight = 0
			windowHeight = document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight
			return windowHeight
		},
	}

	var apis = {
		//...
	}

	//查询节点,返回匹配第一个节点
	Object.defineProperty(qzql, 'qzql_FIND_NODE', {
		value: function (s, p) {
			var rt
			try {
				rt = p.querySelector(s)
			} catch (e) {}
			return rt
		},
		writable: false,
		enumerable: false,
		configuration: false,
	})

	//查询节点,返回匹配所有节点
	Object.defineProperty(qzql, 'qzql_FIND_NODE_ALL', {
		value: function (s, p) {
			var rt
			try {
				rt = p.querySelectorAll(s)
			} catch (e) {}
			return rt
		},
		writable: false,
		enumerable: false,
		configuration: false,
	})

	//uzStorage,返回本地存储对象
	Object.defineProperty(qzql, 'qzql_UZ_STROAGE', {
		value: function () {
			var ls = window.localStorage
			if (/android/gi.test(navigator.appVersion)) {
				ls = os.localStorage()
			}
			return ls
		},
		writable: false,
		enumerable: false,
		configuration: false,
	})

	//克隆对象,返回新建对象
	Object.defineProperty(ini, 'INI_CLONE_OBJ', {
		value: function (oldObj) {
			if (ini.classOf(oldObj) != 'object') {
				return oldObj
			}
			var newObj = new Object()
			for (var prop in oldObj) {
				newObj[prop] = ini.INI_CLONE_OBJ(oldObj[prop])
			}
			return newObj
		},
	})

	//扩展对象,返回新建对象
	Object.defineProperty(ini, 'INI_EXTEND_OBJ', {
		value: function (subObj) {
			var args = arguments
			if (args.length < 2) {
				return subObj
			}
			var temp = ini.INI_CLONE_OBJ(subObj) //调用复制对象方法
			for (var n = 1; n < args.length; n++) {
				for (var prop in args[n]) {
					if (!temp[prop]) {
						temp[prop] = args[n][prop]
					}
				}
			}
			return temp
		},
	})

	TMP = ini.INI_EXTEND_OBJ(ini, apis, qzql, ini)

	/**
	 * 定义脚本库基本信息
	 */
	//版本信息
	Object.defineProperty(TMP, 'LIB_VERSON', {
		value: '1.0.0',
		writable: false,
		configuration: false,
	})
	//库名信息
	Object.defineProperty(TMP, 'LIB_NAME', {
		value: 'qzql',
		writable: false,
		configuration: false,
	})
	//作者信息
	Object.defineProperty(TMP, 'LIB_AUTHOR', {
		value: 'qzql',
		writable: false,
		configuration: false,
	})
	//版权信息
	Object.defineProperty(TMP, 'LIB_COPYRIGHT', {
		value: 'Null',
		writable: false,
		configuration: false,
	})

	//设备系统类型
	Object.defineProperty(TMP, 'sysType', {
		get: function () {
			return navigator.platform
		},
	})
	//设备系统版本
	Object.defineProperty(TMP, 'sysVersion', {
		get: function () {
			return ini.isAPICloud() ? api.systemVersion : navigator.platform
		},
	})
	//API版本
	Object.defineProperty(TMP, 'apiVersion', {
		get: function () {
			return '1.0.0'
		},
	})
	//设备用户代理
	Object.defineProperty(TMP, 'userAgent', {
		get: function () {
			return navigator.userAgent
		},
	})
	//设备屏幕宽度值
	Object.defineProperty(TMP, 'screenWidth', {
		get: function () {
			return screen.width
		},
	})
	//设备屏幕高度值
	Object.defineProperty(TMP, 'screenHeight', {
		get: function () {
			return screen.height
		},
	})
	//WIN名
	Object.defineProperty(TMP, 'winName', {
		get: function () {
			return window.name
		},
	})
	//WIN宽度值
	Object.defineProperty(TMP, 'winWidth', {
		get: function () {
			return document.documentElement.clientWidth
		},
	})
	//WIN高度值
	Object.defineProperty(TMP, 'winHeight', {
		get: function () {
			return document.documentElement.clientHeight
		},
	})
	//文档宽度值
	Object.defineProperty(TMP, 'docWidth', {
		get: function () {
			return ini.isAPICloud() ? api.winWidth : document.documentElement.clientWidth
		},
	})
	//文档高度值
	Object.defineProperty(TMP, 'docHeight', {
		get: function () {
			return ini.isAPICloud() ? api.winHeight : document.documentElement.clientHeight
		},
	})
	//PAGE PARAM
	Object.defineProperty(TMP, 'pageParam', {
		get: function () {
			if (ini.isAPICloud()) {
				return api.pageParam
			} else {
				return qzql.str2json(qzql.storage('storage'))
			}
		},
	})
	//WGT PARAM
	Object.defineProperty(TMP, 'wgtParam', {
		get: function () {
			return ini.isAPICloud() ? api.wgtParam : ''
		},
	})

	//绑定全局变量
	window['$$'] = window['Qling'] = TMP
})(window)
