/*
    给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。
 */

function findLast(head) {
	let node = head
	while (node && node.next) {
		node = node.next
	}
	return node
}

function getIntersectionNode(head1, head2) {
	let pA = head1
	let pB = head2
	while (pA !== pB) {
		pA = !pA ? head2 : pA.next
		pB = !pB ? head1 : pB.next
	}
	return pA
}

const coms = [8, 4, 5]
const arr1 = [4, 1]
const arr2 = [5, 0, 1]

const head = ven$setArray2SinglyLinkedList(coms)
const head1 = ven$setArray2SinglyLinkedList(arr1)
const head2 = ven$setArray2SinglyLinkedList(arr2)
const last1 = findLast(head1)
const last2 = findLast(head2)

last1.next = head
last2.next = head

console.log(getIntersectionNode(head1, head2))
