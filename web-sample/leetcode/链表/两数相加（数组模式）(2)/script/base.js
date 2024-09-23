/*
    给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

    请你将两个数相加，并以相同形式返回一个表示和的链表。

    你可以假设除了数字 0 之外，这两个数都不会以 0 开头
 */

function addTwoNumbers(list1, list2) {
	const arr1 = ven$setSinglyLinkedList2Array(list1).reverse()
	const arr2 = ven$setSinglyLinkedList2Array(list2).reverse()
	/**
	 * 获取两个数组的最大长度
	 */
	const maxLength = Math.max(arr1.length, arr2.length)
	/**
	 * 数组前导补位
	 */
	if (arr1.length < maxLength) {
		const len = arr1.length
		for (let i = 0; i < maxLength - len; i++) {
			arr1.unshift(0)
		}
	}
	if (arr2.length < maxLength) {
		const len = arr2.length
		for (let i = 0; i < maxLength - len; i++) {
			arr2.unshift(0)
		}
	}
	/**
     * 初始化临时数组
            以 0 填充
     */
	const temp = []
	for (let i = 0; i < maxLength + 1; i++) {
		temp[i] = 0
	}
	/**
     * l1:    [0, 9, 4, 2]
        l2:    [9, 4, 6, 5]
        tp: [0, 0, 0, 0, 0] 

        从 arr1/arr2 的最末尾开始倒叙遍历
     */
	let tempIndex = maxLength // tempIndex = (maxLength - 1) + 1
	for (let i = maxLength - 1; i >= 0; i--) {
		/**
		 * 遍历到某一位时, 将三组数组的该位值相加
		 */
		const sum = arr1[i] + arr2[i] + temp[tempIndex]
		if (sum >= 10) {
			temp[tempIndex] = sum - 10
			temp[tempIndex - 1] = 1
		} else {
			temp[tempIndex] = sum
		}
		tempIndex--
	}
	console.log(temp)
	/**
	 * 移除数组开头的所有 0 位并反向该数组
	 */
	const newArr = ven$removeAllFrontZero(temp).reverse()
	/**
	 * 将数组转换成链表
	 */
	const head = new ListNode(newArr[0], null)
	let p = head
	for (let i = 1; i < newArr.length; i++) {
		const node = new ListNode(newArr[i], null)
		p.next = node
		p = node
	}
	return head
}

/*
    942 + 9465
       [0, 9, 4, 2]
       [9, 4, 6, 5]
    [0, 0, 0, 0, 0]
 */
const arr1 = [2, 4, 9]
const arr2 = [5, 6, 4, 9]

const list1 = ven$setArray2SinglyLinkedList(arr1)
const list2 = ven$setArray2SinglyLinkedList(arr2)

console.log(addTwoNumbers(list1, list2))
