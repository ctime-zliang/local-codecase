/**
 * @description 链表反转
 * @function ven$reverseSinglyLinkedList
 * @param {Ven$LinkedListNode} head 单向链表的起始节点(头节点)
 * @return {Ven$LinkedListNode} 单向链表
 */
function ven$reverseSinglyLinkedList(head) {
	if (!head || !head.next) {
		return head
	}
	let target = head
	let pre = null
	let next = null
	while (target != null) {
		next = target.next
		target.next = pre
		pre = target
		target = next
	}
	return pre
}
