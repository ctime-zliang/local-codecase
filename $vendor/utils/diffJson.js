class Ven$JsonDiff {
	static TYPE_CREATED = 'CREATED'
	static TYPE_UPDATED = 'UPDATED'
	static TYPE_DELETED = 'DELETED'
	static TYPE_UNCHANGED = 'UNCHANGED'

	static KEY_TYPE = '$$TYPE'
	static KEY_NEW_DATA = '$$NEW_DATA'
	static KEY_OLD_DATA = '$$OLD_DATA'
	static KEY_NEW_CLASSOF = '$$KEY_NEW_CLASSOF'
	static KEY_OLD_CLASSOF = '$$KEY_OLD_CLASSOF'
	static KEY_PATH = '$$KEY_PATH'

	static classOf(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
	}

	static isFunction(target) {
		return this.classOf(target) === 'function'
	}

	static isArray(target) {
		return this.classOf(target) === 'array'
	}

	static isObject(target) {
		return this.classOf(target) === 'object'
	}

	static isDate(target) {
		return this.classOf(target) === 'date'
	}

	static isUndefined(target) {
		return this.classOf(target) === 'undefined'
	}

	static isNull(target) {
		return this.classOf(target) === 'null'
	}

	static isRegexp(target) {
		return this.classOf(target) === 'regexp'
	}

	static isError(target) {
		return this.classOf(target) === 'error'
	}

	static isMap(target) {
		return this.classOf(target) === 'map'
	}

	static isWeakMap(target) {
		return this.classOf(target) === 'weakmap'
	}

	static isSet(target) {
		return this.classOf(target) === 'set'
	}

	static isWeakSet(target) {
		return this.classOf(target) === 'weakset'
	}

	static isSymbol(target) {
		return this.classOf(target) === 'symbol'
	}

	static isBigInt(target) {
		return this.classOf(target) === 'bigint'
	}

	static isEmpty(target) {
		if (this.isMap(target) || this.isWeakMap(target) || this.isSet(target) || this.isWeakSet(target)) {
			return target.size() <= 0
		}
		if (this.isArray(target)) {
			return target.length <= 0
		}
		if (this.isObject(target)) {
			return Object.keys(target).length <= 0
		}
		return true
	}

	static isEmptyArray(target) {
		return target.length <= 0
	}

	static isEmptyObject(target) {
		return Object.keys(target).length <= 0
	}

	static isSameType(target1, target2) {
		return this.classOf(target1) === this.classOf(target2)
	}

	static isPrimitiveValue(target) {
		return !this.isObject(target) && !this.isArray(target)
	}

	static compareValues(value1, value2) {
		if (value1 === value2) {
			return this.TYPE_UNCHANGED
		}
		if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
			return this.TYPE_UNCHANGED
		}
		if ('undefined' == typeof value1) {
			return this.TYPE_CREATED
		}
		if ('undefined' == typeof value2) {
			return this.TYPE_DELETED
		}
		return this.TYPE_UPDATED
	}

	/**
	 * @description diff 主函数
	 * 		层次化 key-path 返回格式
	 * @function exec
	 * @param {object|array} obj1 对象 1(基准对象)
	 * @param {object|array} obj2 对象 2(被检查对象)
	 * @return {object}
	 */
	static exec(obj1, obj2) {
		return __Ven$JsonDiff__diff(obj1, obj2)
	}

	/**
	 * @description diff 主函数
	 * 		扁平化化 key-path 返回格式
	 * @function exec2
	 * @param {object|array} obj1 对象 1(基准对象)
	 * @param {object|array} obj2 对象 2(被检查对象)
	 * @return {object}
	 */
	static exec2Output = {}
	static resetExec2Output() {
		this.exec2Output = {}
	}
	static exec2(obj1, obj2) {
		this.resetExec2Output()
		__Ven$JsonDiff__diff2(obj1, obj2, '')
		return this.exec2Output
	}
}

function __Ven$JsonDiff__diff(obj1, obj2) {
	const result = {}
	let valueOfObj2
	if (Ven$JsonDiff.isFunction(obj1) || Ven$JsonDiff.isFunction(obj2)) {
		throw 'Invalid argument. Function given, Object expected.'
	}
	if (Ven$JsonDiff.isPrimitiveValue(obj1) || Ven$JsonDiff.isPrimitiveValue(obj2)) {
		return {
			[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.compareValues(obj1, obj2),
			[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
			[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
			[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
			[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
		}
	}
	let hasSet = false
	for (let key in obj1) {
		if (Ven$JsonDiff.isFunction(obj1[key])) {
			continue
		}
		valueOfObj2 = undefined
		if ('undefined' !== typeof obj2[key]) {
			valueOfObj2 = obj2[key]
		}
		hasSet = true
		result[key] = __Ven$JsonDiff__diff(obj1[key], valueOfObj2)
	}
	for (let key in obj2) {
		if (Ven$JsonDiff.isFunction(obj2[key]) || 'undefined' != typeof result[key]) {
			continue
		}
		hasSet = true
		result[key] = __Ven$JsonDiff__diff(undefined, obj2[key])
	}
	if (!hasSet) {
		return {
			[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.isSameType(obj1, obj2) ? Ven$JsonDiff.TYPE_UNCHANGED : Ven$JsonDiff.TYPE_UPDATED,
			[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
			[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
			[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
			[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
		}
	}
	result[Ven$JsonDiff.KEY_TYPE] = Ven$JsonDiff.isSameType(obj1, obj2) ? Ven$JsonDiff.TYPE_UNCHANGED : Ven$JsonDiff.TYPE_UPDATED
	result[Ven$JsonDiff.KEY_NEW_CLASSOF] = Ven$JsonDiff.classOf(obj2)
	result[Ven$JsonDiff.KEY_OLD_CLASSOF] = Ven$JsonDiff.classOf(obj1)
	return result
}

function __Ven$JsonDiff__diff2(obj1, obj2, path = '') {
	const result = {}
	let valueOfObj2
	if (Ven$JsonDiff.isFunction(obj1) || Ven$JsonDiff.isFunction(obj2)) {
		throw 'Invalid argument. Function given, Object expected.'
	}
	if (Ven$JsonDiff.isPrimitiveValue(obj1) || Ven$JsonDiff.isPrimitiveValue(obj2)) {
		return {
			[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.compareValues(obj1, obj2),
			[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
			[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
			[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
			[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
			[Ven$JsonDiff.KEY_PATH]: path,
		}
	}
	let hasSet = false
	let iPath = path
	if (Ven$JsonDiff.isArray(obj1) && Ven$JsonDiff.isArray(obj2)) {
		if (obj1.length === 1 && obj2.length === 1 && obj1[0] === obj2[0]) {
			return {
				[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.TYPE_UNCHANGED,
				[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
				[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
				[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
				[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
				[Ven$JsonDiff.KEY_PATH]: path,
			}
		}
		if (Ven$JsonDiff.isEmptyArray(obj1) && Ven$JsonDiff.isEmptyArray(obj2)) {
			return {
				[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.TYPE_UNCHANGED,
				[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
				[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
				[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
				[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
				[Ven$JsonDiff.KEY_PATH]: path,
			}
		}
	}
	for (let key in obj1) {
		if (Ven$JsonDiff.isFunction(obj1[key])) {
			continue
		}
		valueOfObj2 = undefined
		if ('undefined' !== typeof obj2[key]) {
			valueOfObj2 = obj2[key]
		}
		hasSet = true
		iPath = path + '/' + key
		result[key] = __Ven$JsonDiff__diff2(obj1[key], valueOfObj2, iPath)
		if (result[key][Ven$JsonDiff.KEY_PATH]) {
			Ven$JsonDiff.exec2Output[result[key][Ven$JsonDiff.KEY_PATH]] = result[key]
		}
	}
	for (let key in obj2) {
		if (Ven$JsonDiff.isFunction(obj2[key]) || 'undefined' != typeof result[key]) {
			continue
		}
		hasSet = true
		iPath = path + '/' + key
		result[key] = __Ven$JsonDiff__diff(undefined, obj2[key])
		if (result[key][Ven$JsonDiff.KEY_PATH]) {
			Ven$JsonDiff.exec2Output[result[key][Ven$JsonDiff.KEY_PATH]] = result[key]
		}
	}
	if (!hasSet) {
		return {
			[Ven$JsonDiff.KEY_TYPE]: Ven$JsonDiff.isSameType(obj1, obj2) ? Ven$JsonDiff.TYPE_UNCHANGED : Ven$JsonDiff.TYPE_UPDATED,
			[Ven$JsonDiff.KEY_NEW_DATA]: obj2 || undefined,
			[Ven$JsonDiff.KEY_OLD_DATA]: obj1 || undefined,
			[Ven$JsonDiff.KEY_NEW_CLASSOF]: Ven$JsonDiff.classOf(obj2),
			[Ven$JsonDiff.KEY_OLD_CLASSOF]: Ven$JsonDiff.classOf(obj1),
			[Ven$JsonDiff.KEY_PATH]: path,
		}
	}
	result[Ven$JsonDiff.KEY_TYPE] = Ven$JsonDiff.isSameType(obj1, obj2) ? Ven$JsonDiff.TYPE_UNCHANGED : Ven$JsonDiff.TYPE_UPDATED
	result[Ven$JsonDiff.KEY_NEW_CLASSOF] = Ven$JsonDiff.classOf(obj2)
	result[Ven$JsonDiff.KEY_OLD_CLASSOF] = Ven$JsonDiff.classOf(obj1)
	return result
}
