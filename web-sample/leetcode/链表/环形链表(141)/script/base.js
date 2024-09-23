/*
    给定一个链表，判断链表中是否有环。

    如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

    如果链表中存在环，则返回 true 。 否则，返回 false 。
 */

function findLast(head) {
	let node = head
	while (node && node.next) {
		node = node.next
	}
	return node
}

function linkNode(head, pos) {
	const lastNode = findLast(head)
	if (!lastNode) {
		return null
	}
	let node = head
	while (pos > 0) {
		pos--
		node = node.next
	}
	lastNode.next = node
}

function hasCycle(head) {
	return slowAndFast(head)
}

function stringify(head) {
	try {
		const i = JSON.parse(JSON.stringify(head))
		return false
	} catch (e) {
		console.warn(e)
		return true
	}
}

function addTag(head) {
	let node = head
	while (node) {
		if (node.__visited) {
			return true
		}
		node.__visited = true
		node = node.next
	}
	return false
}

function slowAndFast(head) {
	let node = head
	let slow = node
	let fast = node
	let length = 0
	/**
	 * 快慢指针相遇的次数
	 */
	let count = 2
	let flag = false
	while (fast && fast.next) {
		fast = fast.next.next
		if (fast === slow) {
			flag = true
			count--
			if (count <= 0) {
				console.log(length)
				return true
			}
		}
		slow = slow.next
		if (flag) {
			++length
		}
	}
	return false
}

const arr = [3, 2, 0, -4]
const pos = 1
const head = ven$setArray2SinglyLinkedList(arr)

linkNode(head, pos)
console.log(head)
console.log(hasCycle(head))
