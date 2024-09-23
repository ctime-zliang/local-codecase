const array = [3, 5, 8, 1, 9, 6]

function main() {
	const singlyLinkedList = ven$setArray2SinglyLinkedList(array)
	const cyclicLinkedList = ven$setArray2CyclicLinkedList(array)
	console.log(`Singly Linked List`, singlyLinkedList)
	console.log(`Cyclic Linked List`, cyclicLinkedList)

	const translateArray = ven$setSinglyLinkedList2Array(singlyLinkedList)
	console.log(`Translate Array`, translateArray)
}

main()
