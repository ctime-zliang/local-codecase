/**
 * @description 深度优先遍历
 * @function ven$dfs1
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$dfs1(node = null) {
	const nodelist = []
	return traverse(node, nodelist), nodelist

	function traverse(node, nodelist) {
		const children = []
		if (node) {
			nodelist.push(node)
			children = node.children
			for (let i = 0; i < children.length; i++) {
				traverse(children[i], nodelist)
			}
		}
	}
}

/**
 * @description 深度优先遍历
 * @function ven$dfs2
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$dfs2(node = null) {
	const nodelist = []
	const stack = []
	let item = null
	if (node) {
		stack.push(node)
		while (stack.length) {
			item = stack.pop()
			nodelist.push(item)
			children = item.children
			for (let i = children.length - 1; i >= 0; i--) {
				stack.push(children[i])
			}
		}
	}
	return nodelist
}

/**
 * @function 广度优先遍历
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$bfs(node = null) {
	const nodelist = []
	const children = []
	const queue = []
	let item = null
	if (node) {
		queue.push(node)
		while (queue.length) {
			item = queue.shift()
			nodelist.push(item)
			children = item.children
			for (let i = 0; i < children.length; i++) {
				queue.push(children[i])
			}
		}
	}
	return nodelist
}
