const ven$TreeUtils = {
	insertItem(referenceItem, newItem) {
		if (newItem.key > referenceItem.key) {
			if (referenceItem.right === null) {
				referenceItem.right = newItem
				return
			}
			ven$TreeUtils.insertItem(referenceItem.right, newItem)
			return
		}
		if (referenceItem.left === null) {
			referenceItem.left = newItem
			return
		}
		ven$TreeUtils.insertItem(referenceItem.left, newItem)
	},
	getMin(item) {
		if (item.left) {
			return item.left
		}
		return item
	},
	getMax(item) {
		if (item.right) {
			return item.right
		}
		return item
	},
	removeItem(referenceItem, key) {
		if (key > referenceItem.key) {
			referenceItem.right = ven$TreeUtils.removeItem(referenceItem.right, key)
			return referenceItem
		}
		if (key < referenceItem.key) {
			referenceItem.left = ven$TreeUtils.removeItem(referenceItem.left, key)
			return referenceItem
		}
		if (referenceItem.left === null && referenceItem.right === null) {
			/**
			 * 叶子节点
			 */
			return null
		}
		if (referenceItem.left === null && referenceItem.right !== null) {
			/**
			 * 仅存在右子树
			 */
			return referenceItem.right
		}
		if (referenceItem_left !== null && referenceItem.right === null) {
			/**
			 * 仅存在左子树
			 */
			return referenceItem.left
		}
		const minItemByRightChilds = ven$TreeUtils.getMin(referenceItem.right)
		referenceItem.key = minItemByRightChilds.key
		referenceItem.right = ven$TreeUtils.removeItem(referenceItem.right, minItemByRightChilds.key)
		return referenceItem
	},
	preOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.preOrderTraverseItemByRecursion(item, result)
		return result
	},
	preOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			result.push(item.key)
			ven$TreeUtils.preOrderTraverseItemByRecursion(item.left, result)
			ven$TreeUtils.preOrderTraverseItemByRecursion(item.right, result)
		}
	},
	preOrderTraverseByStack(item) {
		const result = []
		const stack = [item]
		while (stack.length) {
			const current = stack.pop()
			result.push(current.key)
			if (current.right) {
				stack.push(current.right)
			}
			if (current.left) {
				stack.push(current.left)
			}
		}
		return result
	},
	inOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.inOrderTraverseItemByRecursion(item, result)
		return result
	},
	inOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			ven$TreeUtils.inOrderTraverseItemByRecursion(item.left, result)
			result.push(item.key)
			ven$TreeUtils.inOrderTraverseItemByRecursion(item.right, result)
		}
	},
	inOrderTraverseByStack(item) {
		const result = []
		const stack = []
		let current = item
		while (current || stack.length) {
			while (current) {
				stack.push(current)
				current = current.left
			}
			const top = stack.pop()
			result.push(top.key)
			current = top.right
		}
		return result
	},
	postOrderTraverseByRecursion(item) {
		const result = []
		ven$TreeUtils.postOrderTraverseItemByRecursion(item, result)
		return result
	},
	postOrderTraverseItemByRecursion(item, result = []) {
		if (item) {
			ven$TreeUtils.postOrderTraverseItemByRecursion(item.left, result)
			ven$TreeUtils.postOrderTraverseItemByRecursion(item.right, result)
			result.push(item.key)
		}
	},
	postOrderTraverseByStack(item) {
		const result = []
		const stack = [item]
		while (stack.length) {
			const current = stack.pop()
			result.push(current.key)
			if (current.left) {
				stack.push(current.left)
			}
			if (current.right) {
				stack.push(current.right)
			}
		}
		return result.reverse()
	},
}

/**
 * @description Tree 结构基本节点
 * @class Ven$TreeNode
 * @param {any} val 节点值
 */
class Ven$TreeNode {
	constructor(key) {
		this._key = key
	}

	get key() {
		return this._key
	}
	set key(value) {
		this._key = value
	}
}

/**
 * @description BinaryTree 结构基本节点
 * @class Ven$BinaryTreeNode
 * @param {any} key 节点值
 */
class Ven$BinaryTreeNode extends Ven$TreeNode {
	constructor(key) {
		super(key)
		this._left = null
		this._right = null
	}

	get left() {
		return this._left
	}
	set left(value) {
		this._left = value
	}

	get right() {
		return this._right
	}
	set right(value) {
		this._right = value
	}
}
