/**
 * @description 将单向链表转换成数组
 * @function ven$setSinglyLinkedList2Array
 * @param {Ven$SinglyLinkedListNode} list 单向链表
 * @return {array}
 */
function ven$setSinglyLinkedList2Array(list) {
	const arr = []
	arr.push(list.key)
	while (list.next) {
		list = list.next
		arr.push(list.key)
	}
	return arr
}

/**
 * @description 将数组转换成单向链表
 * @function ven$setArray2SinglyLinkedList
 * @param {array} arr 数组
 * @return {Ven$SinglyLinkedListNode}
 */
function ven$setArray2SinglyLinkedList(arr) {
	const head = new Ven$SinglyLinkedListNode(arr[0], undefined)
	let p = head
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$SinglyLinkedListNode(arr[i], undefined)
		p.next = node
		p = node
	}
	return head
}

/**
 * @description 将数组转换成循环链表
 * @function ven$setArray2CyclicLinkedList
 * @param {array} arr 数组
 * @return {Ven$SinglyLinkedListNode}
 */
function ven$setArray2CyclicLinkedList(arr) {
	const head = new Ven$SinglyLinkedListNode(arr[0], undefined)
	let p = head
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$SinglyLinkedListNode(arr[i], undefined)
		p.next = node
		p = node
	}
	p.next = head
	return head
}

/**
 * @description 将数组转换成双向链表
 * @function ven$setArray2DoublyLinkedList
 * @param {array} arr 数组
 * @return {Ven$DoublyLinkedListNode}
 */
function ven$setArray2DoublyLinkedList(arr) {
	const head = new Ven$DoublyLinkedListNode(arr[0], undefined, undefined)
	let p = head
	let t = null
	for (let i = 1; i < arr.length; i++) {
		const node = new Ven$DoublyLinkedListNode(arr[i], undefined, undefined)
		p.next = node
		t = p
		p = node
		p.prev = t
	}
	return head
}
