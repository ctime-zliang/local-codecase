function main() {
	const singlyLinkedList = new Ven$SinglyLinkedList()
	// 0 -> 1 -> 2 -> 3 -> 4 -> 5
	singlyLinkedList.appendItem(0)
	singlyLinkedList.appendItem(1)
	singlyLinkedList.appendItem(2)
	singlyLinkedList.appendItem(3)
	singlyLinkedList.appendItem(4)
	singlyLinkedList.appendItem(5)

	singlyLinkedList.removeAt(singlyLinkedList.indexOf(5))
	singlyLinkedList.appendItem(5)

	singlyLinkedList.removeAt(0)
	singlyLinkedList.removeAt(singlyLinkedList.size() - 1)
	singlyLinkedList.insertItem(0, 0)
	singlyLinkedList.insertItem(5, singlyLinkedList.size() - 1)
	singlyLinkedList.updateItem('N4', singlyLinkedList.size() - 2)
	singlyLinkedList.updateItem('N5', singlyLinkedList.size() - 1)

	console.log(singlyLinkedList.toString())
	console.log(`Singly Linked List`, singlyLinkedList)
}

main()
