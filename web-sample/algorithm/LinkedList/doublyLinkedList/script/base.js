function main() {
	const doublyLinkedList = new Ven$DoublyLinkedList()
	// 0 -> 1 -> 2 -> 3 -> 4 -> 5
	doublyLinkedList.appendItem(0)
	doublyLinkedList.appendItem(1)
	doublyLinkedList.appendItem(2)
	doublyLinkedList.appendItem(3)
	doublyLinkedList.appendItem(4)
	doublyLinkedList.appendItem(5)

	doublyLinkedList.removeAt(doublyLinkedList.indexOf(5))
	doublyLinkedList.appendItem(5)

	doublyLinkedList.removeAt(0)
	doublyLinkedList.removeAt(doublyLinkedList.size() - 1)
	doublyLinkedList.insertItem(0, 0)
	doublyLinkedList.insertItem(5, doublyLinkedList.size() - 1)
	doublyLinkedList.updateItem('N4', doublyLinkedList.size() - 2)
	doublyLinkedList.updateItem('N5', doublyLinkedList.size() - 1)

	console.log(doublyLinkedList.toString())
	console.log(`Doubly Linked List`, doublyLinkedList)
}

main()
