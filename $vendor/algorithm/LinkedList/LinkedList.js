/**
 * @description 单向链表节点
 * @class Ven$SinglyLinkedListNode
 * @param {any} key 节点值
 * @param {Ven$SinglyLinkedListNode} next 下一个链表节点
 */
class Ven$SinglyLinkedListNode {
	constructor(key, next = undefined) {
		this._key = key === undefined ? undefined : key
		this._next = next === undefined ? null : next
	}

	get key() {
		return this._key
	}
	set key(value) {
		this._key = value
	}

	get next() {
		return this._next
	}
	set next(value) {
		this._next = value
	}
}

/**
 * @description 双向链表节点
 * @class Ven$DoublyLinkedListNode
 * @param {any} key 节点值
 * @param {Ven$DoublyLinkedListNode} next 下一个链表节点
 * @param {Ven$DoublyLinkedListNode} prev 上一个链表节点
 */
class Ven$DoublyLinkedListNode {
	constructor(key, next = undefined, prev = undefined) {
		this._key = key === undefined ? undefined : key
		this._next = next === undefined ? null : next
		this._prev = prev === undefined ? null : prev
	}

	get key() {
		return this._key
	}
	set key(value) {
		this._key = value
	}

	get prev() {
		return this._prev
	}
	set prev(value) {
		this._prev = value
	}

	get next() {
		return this._next
	}
	set next(value) {
		this._next = value
	}
}

class Ven$BaseLinkedList {
	constructor() {
		this._length = 0
		this._head = null
		this._tail = undefined
	}

	getItemAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`query index out of bounds.`)
			return null
		}
		let current = this._head
		for (let i = 0; i < index; i++) {
			current = current.next
		}
		return current
	}

	indexOf(key) {
		let current = this._head
		for (let i = 0; i < this._length; i++) {
			if (current._key === key) {
				return i
			}
			current = current.next
		}
		return -1
	}

	hasItem(key) {
		return this.indexOf(key) !== -1
	}

	size() {
		return this._length
	}

	head() {
		return this._head
	}

	tail() {
		return this._tail
	}

	clear() {
		this._length = 0
		this._head = null
		this._tail = undefined
	}

	toString() {
		let str = `linkedlist (`
		let current = this._head
		for (let i = 0; i < this._length; i++) {
			str += `${current._key}, `
			current = current.next
		}
		if (this._length > 0) {
			str = str.slice(0, -2)
		}
		str += `)`
		return str
	}
}

/**
 * @description 单向链表
 * @class Ven$SinglyLinkedList
 */
class Ven$SinglyLinkedList extends Ven$BaseLinkedList {
	constructor() {
		super()
	}

	appendItem(key) {
		const newItem = new Ven$SinglyLinkedListNode(key)
		if (this._head === null) {
			this._head = newItem
			this._length++
			return newItem
		}
		let lastItem = this.getItemAt(this._length - 1)
		lastItem.next = newItem
		this._length++
		return newItem
	}

	insertItem(key, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`insert index out of bounds.`)
			return null
		}
		const newItem = new Ven$SinglyLinkedListNode(key)
		if (index === 0) {
			newItem.next = this._head
			this._head = newItem
			this._length++
			return newItem
		}
		const prevItem = this.getItemAt(index - 1)
		const current = prevItem.next
		prevItem.next = newItem
		newItem.next = current
		this._length++
		return newItem
	}

	removeAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`remove index out of bounds.`)
			return false
		}
		if (index === 0) {
			this._head = this._head.next
			this._length--
			return true
		}
		const prevItem = this.getItemAt(index - 1)
		const current = prevItem.next
		prevItem.next = current.next
		this._length--
		return true
	}

	updateItem(key, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`update index out of bounds.`)
			return false
		}
		const newItem = new Ven$SinglyLinkedListNode(key)
		if (index === 0) {
			newItem.next = this._head.next
			this._head = newItem
			return true
		}
		const prevItem = this.getItemAt(index - 1)
		const current = prevItem.next
		const nextItem = current.next
		prevItem.next = newItem
		newItem.next = nextItem
		return true
	}
}

/**
 * @description 双向链表
 * @class Ven$DoublyLinkedList
 */
class Ven$DoublyLinkedList extends Ven$BaseLinkedList {
	constructor() {
		super()
		this._tail = null
	}

	getItemAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`query index out of bounds.`)
			return null
		}
		if (index >= Math.floor(this._length / 2)) {
			let current = this._tail
			for (let i = this._length - 1; i > index; i--) {
				current = current.prev
			}
			return current
		}
		return super.getItemAt(index)
	}

	appendItem(key) {
		const newItem = new Ven$DoublyLinkedListNode(key)
		if (this._head === null) {
			this._head = newItem
			this._tail = newItem
			this._length++
			return newItem
		}
		this._tail.next = newItem
		newItem.prev = this._tail
		this._tail = newItem
		this._length++
		return newItem
	}

	insertItem(key, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`insert index out of bounds.`)
			return null
		}
		const newItem = new Ven$DoublyLinkedListNode(key)
		if (index === 0) {
			this._head.prev = newItem
			newItem.next = this._head
			this._head = newItem
			this._length++
			return newItem
		}
		if (index === this._length - 1) {
			this._tail.prev.next = newItem
			newItem.prev = this._tail.prev
			this._tail.prev = newItem
			newItem.next = this._tail
			this._length++
			return
		}
		const current = this.getItemAt(index)
		const prevItem = current.prev
		newItem.next = current
		current.prev = newItem
		newItem.prev = prevItem
		prevItem.next = newItem
		this._length++
		return newItem
	}

	removeAt(index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`remove index out of bounds.`)
			return null
		}
		if (index === 0) {
			this._head = this._head.next
			if (this._head.next) {
				this._head.next.prev = this._head
			}
			this._length--
			return true
		}
		if (index === this._length - 1) {
			this._tail.prev.next = null
			this._tail = this._tail.prev
			this._length--
			return true
		}
		const current = this.getItemAt(index)
		const prevItem = current.prev
		prevItem.next = current.next
		current.next.prev = prevItem
		this._length--
		return true
	}

	updateItem(key, index) {
		if (index < 0 || index > this._length - 1) {
			console.warn(`update index out of bounds.`)
			return false
		}
		const newItem = new Ven$DoublyLinkedListNode(key)
		if (index === 0) {
			if (this._head.next) {
				this._head.next.prev = newItem
				newItem.next = this._head.next
			}
			this._head = newItem
			return true
		}
		if (index === this._length - 1) {
			if (this._tail.prev) {
				this._tail.prev.next = newItem
				newItem.prev = this._tail.prev
			}
			this._tail = newItem
			return true
		}
		const current = this.getItemAt(index)
		const prevItem = current.prev
		const nextItem = current.next
		prevItem.next = newItem
		newItem.prev = prevItem
		nextItem.prev = newItem
		newItem.next = nextItem
		return true
	}

	clear() {
		super.clear()
		this._tail = null
	}
}
