/**
 * @description 获取两个集合的并集
 * @function ven$getUnionOfSets
 * @param {set} setA
 * @param {set} setB
 * @return {set}
 */
function ven$getUnionOfSets(setA, setB) {
	return new Set([...setA, ...setB])
}

/**
 * @description 获取两个集合的交集
 * @function ven$getIntersectOfSets
 * @param {set} setA
 * @param {set} setB
 * @return {set}
 */
function ven$getIntersectOfSets(setA, setB) {
	return new Set(
		[...setA].filter(item => {
			return setB.has(item)
		})
	)
}

/**
 * @description 获取两个集合的差集
 * @function ven$getDifferenceOfSets
 * @param {set} setA
 * @param {set} setB
 * @return {set}
 */
function ven$getDifferenceOfSets(setA, setB) {
	return new Set(
		[...setA].filter(item => {
			return !setB.has(item)
		})
	)
}
