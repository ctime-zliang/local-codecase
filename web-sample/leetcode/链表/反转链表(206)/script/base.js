/*
    给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */

function reverseList(head) {
	if (ven$isEmptyObject(head)) {
		return null
	}
	let pre = null
	let next = null
	while (head != null) {
		next = head.next
		head.next = pre
		pre = head
		head = next
	}
	return pre
}

const arr = [1, 2, 3, 4, 5]
const list = ven$setArray2SinglyLinkedList(arr)

console.log(reverseList(list))
