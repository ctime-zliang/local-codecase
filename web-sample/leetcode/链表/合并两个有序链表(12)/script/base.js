/*
    两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
 */

function findLast(head) {
	let node = head
	while (node && node.next) {
		node = node.next
	}
	return node
}

function mergeTwoLists(l1, l2) {
	/**
	 * 初始化首节点并赋值
	 */
	let res = new ListNode(null, null)
	let p = res
	/**
     * 如果 
            l1 or l2 其中任意一个不存在
        则
            退出循环
     */
	while (l1 && l2) {
		if (l1.val < l2.val) {
			res.next = l1
			l1 = l1.next
		} else {
			res.next = l2
			l2 = l2.next
		}
		res = res.next
	}
	if (l1) {
		res.next = l1
	}
	if (l2) {
		res.next = l2
	}
	return p
}

const arr1 = []
const arr2 = []

const head1 = ven$setArray2SinglyLinkedList(arr1)
const head2 = ven$setArray2SinglyLinkedList(arr2)

console.log(head1, head2)

console.log(mergeTwoLists(head1, head2))
