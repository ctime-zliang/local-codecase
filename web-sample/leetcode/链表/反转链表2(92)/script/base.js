/*
    给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */

function ListNode(val, next) {
	this.val = val === undefined ? 0 : val
	this.next = next === undefined ? null : next
}

function reverseBetween(head, left, right) {
	return fn1(head, left, right)
}

function fn1(head, left, right) {
	let dist = right - left
	/**
	 * 创建起始前置节点
	 */
	let point = new ListNode(null)
	point.next = head
	/**
	 * 后一指针到需要反转的起始节点
	 */
	let pre = point
	while (pre && left > 1) {
		pre = pre.next
		--left
	}
	/**
	 * 反转区域节点
	 */
	let cur = pre.next
	while (dist > 0) {
		const next = cur.next
		cur.next = next.next
		next.next = pre.next
		pre.next = next
		--dist
	}
	return point.next
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const list = ven$setArray2SinglyLinkedList(arr)

const a = reverseBetween(list, 3, 7)
console.log(ven$setSinglyLinkedList2Array(a))
