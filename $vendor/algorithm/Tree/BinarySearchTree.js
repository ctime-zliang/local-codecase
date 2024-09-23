/**
 * @description BinarySearchTree 二叉搜索树
 *      val(left.key) < val(parent.key) < val(right.key)
 * @class Ven$BinarySearchTree
 */
class Ven$BinarySearchTree {
	constructor() {
		this._root = null
	}

	get root() {
		return this._root
	}
	set root(value) {
		this._root = value
	}

	insertItem(key) {
		const newItem = new Ven$BinaryTreeNode(key)
		if (this.root === null) {
			this.root = newItem
			return
		}
		ven$TreeUtils.insertItem(this.root, newItem)
	}

	max() {
		let item = this.root
		let key = undefined
		while (item) {
			key = item.key
			item = item.right
		}
		return key
	}

	min() {
		let item = this.root
		let key = undefined
		while (item) {
			key = item.key
			item = item.left
		}
		return key
	}

	hasItem(key) {
		let item = this.root
		while (item) {
			if (key < item.key) {
				item = item.left
				continue
			}
			if (key > item.key) {
				item = item.right
				continue
			}
			return true
		}
		return false
	}

	removeItem(key) {
		if (this.root === null) {
			return false
		}
		ven$TreeUtils.removeItem(this.root, key)
		return true
	}

	preOrderTraverseByRecursion() {
		return ven$TreeUtils.preOrderTraverseByRecursion(this.root)
	}

	preOrderTraverseByStack() {
		return ven$TreeUtils.preOrderTraverseByStack(this.root)
	}

	inOrderTraverseByRecursion() {
		return ven$TreeUtils.inOrderTraverseByRecursion(this.root)
	}

	inOrderTraverseByStack() {
		return ven$TreeUtils.inOrderTraverseByStack(this.root)
	}

	postOrderTraverseByRecursion() {
		return ven$TreeUtils.postOrderTraverseByRecursion(this.root)
	}

	postOrderTraverseByStack() {
		return ven$TreeUtils.postOrderTraverseByStack(this.root)
	}
}
