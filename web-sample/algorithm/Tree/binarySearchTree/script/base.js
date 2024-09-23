function main() {
	const binarySearchTree = new Ven$BinarySearchTree()

	binarySearchTree.insertItem(11)
	binarySearchTree.insertItem(7)
	binarySearchTree.insertItem(15)
	binarySearchTree.insertItem(5)
	binarySearchTree.insertItem(9)
	binarySearchTree.insertItem(13)
	binarySearchTree.insertItem(20)
	binarySearchTree.insertItem(3)
	binarySearchTree.insertItem(8)
	binarySearchTree.insertItem(10)
	binarySearchTree.insertItem(12)
	binarySearchTree.insertItem(14)
	binarySearchTree.insertItem(18)
	binarySearchTree.insertItem(25)
	binarySearchTree.insertItem(19)

	console.log(binarySearchTree.hasItem(9))
	// console.log(binarySearchTree.preOrderTraverseByRecursion())
	// console.log(binarySearchTree.preOrderTraverseByStack())
	// console.log(binarySearchTree.inOrderTraverseByRecursion())
	// console.log(binarySearchTree.inOrderTraverseByStack())
	// console.log(binarySearchTree.postOrderTraverseByRecursion())
	// console.log(binarySearchTree.postOrderTraverseByStack())

	console.log(`Binary Search Tree`, binarySearchTree)
}

main()
