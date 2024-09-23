function Ven$Rtree_insertSubtree(leafItem, root, minWidth, maxWidth, debug = true) {
	/**
	 * 当 root 节点的子节点集合为空时, 执行插入时首先填充根节点
	 * 则 root 节点的 MBR 即为当前被插入的节点的尺寸的数据值
	 */
	if (root.nodes.length === 0) {
		root.sx = leafItem.sx
		root.sy = leafItem.sy
		root.w = leafItem.w
		root.h = leafItem.h
		root.nodes.push(leafItem)
		debug && Ven$Rtree_debugUpdateRectangleAuxiliary(root.id, root)
		return
	}
	/**
	 * 将目标节点插入到当前树中
	 * 获取从 root 节点到最终插入位置的路径上的节点集合
	 */
	let nodePath = Ven$Rtree_chooseLeafSubtree(leafItem, root)
	let handleItem = leafItem
	let bc = undefined
	let expandRect = null
	let splitRes = []
	while (nodePath.length > 0) {
		/**
		 * 对 bc.nodes.length === 0
		 *
		 * 		当在某一轮循环中同时满足:
		 * 			1. bc 为非 root 节点
		 * 			2. bc 的直接子节点个数因超过最大限值而发生裂变
		 * 		则此时 bc 的子节点将生成两个独立的树, 子节点列表(数组)引用将被清空
		 *
		 * 		缓存 bc
		 * 		继续取 bc 的父节点, 记作 p
		 * 			即 p = nodePath.pop()
		 * 		重新赋值给 bc
		 * 		遍历 p 的直接子节点集合(p.nodes), 对任意的 p.nodes[n], 如果其直接子节点集合(p.nodes[n].nodes)为空, 则删除 p.nodes[n]
		 */
		if (bc && bc.nodes && bc.nodes.length <= 0) {
			let cache = bc
			bc = nodePath.pop()
			for (let n = 0; n < bc.nodes.length; n++) {
				if (bc.nodes[n] === cache || bc.nodes[n].nodes.length <= 0) {
					const item = bc.nodes.splice(n, 1)
					debug && Ven$Rtree_debugRemoveRectangleAuxiliary(item[0].id)
					break
				}
			}
		} else {
			bc = nodePath.pop()
		}
		if (expandRect) {
			Ven$Rtree_Rectangle.expandRectangle(bc, expandRect)
			debug && Ven$Rtree_debugUpdateRectangleAuxiliary(bc.id, bc)
			expandRect = {
				sx: bc.sx,
				sy: bc.sy,
				w: bc.w,
				h: bc.h,
			}
		} else {
			if (splitRes.length) {
				/**
				 * 需要将裂变后的两棵子树追加挂载到 p 节点上
				 * 更新 p 节点矩形尺寸
				 */
				for (let i = 0; i < splitRes.length; i++) {
					Ven$Rtree_Rectangle.expandRectangle(bc, splitRes[i])
					debug && Ven$Rtree_debugUpdateRectangleAuxiliary(bc.id, bc)
				}
				bc.nodes = bc.nodes.concat(splitRes)
				splitRes.length = 0
			} else {
				Ven$Rtree_Rectangle.expandRectangle(bc, handleItem)
				bc.nodes.push(handleItem)
				debug && Ven$Rtree_debugUpdateRectangleAuxiliary(bc.id, bc)
			}
			if (bc.nodes.length <= maxWidth) {
				expandRect = {
					sx: bc.sx,
					sy: bc.sy,
					w: bc.w,
					h: bc.h,
				}
			} else {
				/**
				 * 对 bc.nodes 进行裂变, 裂变后 bc.nodes 长度为 0
				 * 在后续的大循环中将把裂变结果逐一插入到当前树中
				 */
				let a = Ven$Rtree_linearSplit(bc.nodes, minWidth, debug)
				a[0].id = 'node-' + Ven$Rtree_getHashIden() + '-a'
				a[1].id = 'node-' + Ven$Rtree_getHashIden() + '-b'
				if (debug) {
					a.forEach((item, index) => {
						Ven$Rtree_debugUpdateRectangleAuxiliary(item.id, item)
					})
				}
				/**
				 * nodePath 存储从 root 节点到被插入位置的路径上的所有节点
				 *
				 * 当 nodePath 为空, 即表示大循环遍历过程已退回到 root 节点, 且已弹出 root 节点并赋值给 bc
				 * 需要将裂变结果中的节点之一挂载到 root 节点
				 * 将 root 节点重新存入 nodePath 中以便重新开启新一轮大循环
				 * 并在新一轮大循环中将裂变结果中的另一个根节点插入到 root 节点(树)中
				 *
				 * 如果 nodePath 不为空, 即大循环遍历过程正处于树的中间某一层节点, 当前节点即 bc 所指向的引用
				 * 在下一轮大循环中, 将裂变结果插入到 bc.parent 中
				 */
				if (nodePath.length <= 0) {
					bc.nodes.push(a[0])
					nodePath.push(bc)
					handleItem = a[1]
				} else {
					splitRes = a
				}
				expandRect = null
			}
		}
	}
}

function Ven$Rtree_chooseLeafSubtree(itemData, root, debug = true) {
	const debugId0 = Ven$Rtree_getHashIden()
	const debugId1 = Ven$Rtree_getHashIden()
	/**
	 * 假设某一层的所有子节点 nodes 均为非叶子节点
	 * 将被插入的节点(itemData) 逐一包含进 nodes[i] 中, 生成矩形 R(i)
	 * 取该层 nodes 遍历过程中 R(i) 的面积最小时对应的节点项 nodes[i], 则判定其为最佳子节点, 并继续对该最佳子节点的子节点执行同样的操作
	 *
	 * 从当前的 root 逐层往下遍历, 直到遍历到叶子节点即终止循环
	 *
	 * 遍历树的某一层的所有节点 nodes
	 * 取 nodes[i] 的"正方化"面积值 SQ(i)
	 * 取 nodes[i] 和 itemData 构建的矩形 R[i] 的"正方化"面积值 SQ(di)
	 * 找到 SQ(di) 和 SQ(i) 的差的最小值并记录索引 bestChoiceIndex = i
	 *
	 * 在下一轮外循环中获取 nodes[bestChoiceIndex] 的所有子节点 nodes
	 * 并再次执行同样的遍历操作
	 *
	 * 当 nodes[i] 为叶子节点时, 即退出整个查找循环(do-while)
	 *
	 * 遍历过程使用 bestChoiceStack 记录从 root 到 nodes[i] 的父节点的路径(节点集合)
	 */
	const bestChoiceStack = [root]
	let bestChoiceIndex = -1
	let bestChoiceArea = 0
	let nodes = root.nodes
	do {
		if (bestChoiceIndex !== -1) {
			bestChoiceStack.push(nodes[bestChoiceIndex])
			nodes = nodes[bestChoiceIndex].nodes
			bestChoiceIndex = -1
		}
		for (let i = nodes.length - 1; i >= 0; i--) {
			const childItem = nodes[i]
			if (childItem.leaf) {
				bestChoiceIndex = -1
				break
			}
			debug && Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, childItem, '#440000')
			const sx = Math.min(childItem.sx, itemData.sx)
			const sy = Math.min(childItem.sy, itemData.sy)
			const ex = Math.max(childItem.sx + childItem.w, itemData.sx + itemData.w)
			const ey = Math.max(childItem.sy + childItem.h, itemData.sy + itemData.h)
			const newW = ex - sx
			const newH = ey - sy
			debug && Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, { sx, sy, w: newW, h: newH }, '#440000')
			const oldChildItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(childItem.w, childItem.h, childItem.nodes.length + 1)
			const newChildItemRatio = Ven$Rtree_Rectangle.squarifiedRatio(newW, newH, childItem.nodes.length + 2)
			if (bestChoiceIndex < 0 || Math.abs(newChildItemRatio - oldChildItemRatio) < bestChoiceArea) {
				bestChoiceArea = Math.abs(newChildItemRatio - oldChildItemRatio)
				bestChoiceIndex = i
			}
		}
	} while (bestChoiceIndex !== -1)
	debug && Ven$Rtree_debugRemoveRectangleAuxiliary(debugId0)
	debug && Ven$Rtree_debugRemoveRectangleAuxiliary(debugId1)
	return bestChoiceStack
}

function Ven$Rtree_linearSplit(nodes, minWidth, debug = true) {
	/**
	 * 将 nodes 分割成两棵树
	 * 先通过构建矩形策略从 nodes 中选择两个节点生成两棵树的根节点
	 * 将剩下的节点分配到两棵树
	 */
	const n = Ven$Rtree_pickLinear(nodes, debug)
	const debugId0 = Ven$Rtree_getHashIden()
	const debugId1 = Ven$Rtree_getHashIden()
	Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, n[0], '#440000')
	Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, n[1], '#880000')
	while (nodes.length > 0) {
		Ven$Rtree_pickNext(nodes, n[0], n[1], minWidth, debug)
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugId0, n[0], '#440000')
		Ven$Rtree_debugUpdateRectangleAuxiliary(debugId1, n[1], '#880000')
	}
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId0)
	Ven$Rtree_debugRemoveRectangleAuxiliary(debugId1)
	return n
}

function Ven$Rtree_pickLinear(nodes, debug = true) {
	/**
	 * 在一个平面上分布着 nodes[i] 元素
	 * nodes 的长度即为其父节点当前的子节点个数, 且父节点存在一个最大子节点个数限制 M
	 * 当 nodes.length 值在某一个处理过程中已经大于了 M, 则会立即开始分裂
	 * 因此 [0, nodes.length - 2] 区间内的元素个数即等于 M
	 * 遍历 [0, nodes.length - 2] 区间内的元素
	 * 		找到起始 X 坐标(sx)最大的元素对应的索引 indexHighestStartX
	 * 		找到起始 Y 坐标(sy)最大的元素对应的索引 indexHighestStartY
	 * 		找到结束 X 坐标(ex)最小的元素对应的索引 indexLowestEndX
	 * 		找到结束 Y 坐标(ey)最小的元素对应的索引 indexLowestEndY
	 */
	let indexLowestEndX = nodes.length - 1
	let indexHighestStartX = 0
	let indexLowestEndY = nodes.length - 1
	let indexHighestStartY = 0
	for (let i = nodes.length - 2; i >= 0; i--) {
		const childItem = nodes[i]
		if (childItem.sx > nodes[indexHighestStartX].sx) {
			indexHighestStartX = i
		} else if (childItem.sx + childItem.w < nodes[indexLowestEndX].sx + nodes[indexLowestEndX].w) {
			indexLowestEndX = i
		}
		if (childItem.sy > nodes[indexHighestStartY].sy) {
			indexHighestStartY = i
		} else if (childItem.sy + childItem.h < nodes[indexLowestEndY].sy + nodes[indexLowestEndY].h) {
			indexLowestEndY = i
		}
	}
	/**
	 * 存在一个由
	 * 		x1 = lowestEndX
	 * 		x2 = highestStartX
	 * 		y1 = lowestEndY
	 * 		y2 = highestStartY
	 * 4 条直线构成的矩形 R
	 *
	 * 获取该矩形 R 的两条短边 L1 与 L2
	 * 找到 L1 和 L2 所在的直线 x1 和 x2(或 y1 和 y2)
	 * 继续在 nodes 依据索引定位到决定 x1 和 x2(或 y1 和 y2) 直线坐标的元素 nodes[idx1] 和 nodes[idx2], 记作 A 和 B
	 * 分别由 A 和 B 的尺寸数据生成 MBR 节点 MA 和 MB, 并将 A 和 B 作为其子节点
	 * 返回 MA 和 MB
	 *
	 * 通过 index 使用 splice 方法删除数组元素并获取 index 对应的元素
	 * 需要从较大的 index 开始查找并删除, 以防止 splice 方法修改原数组导致后续的 index 查找元素出错
	 */
	const lowestEndX = nodes[indexLowestEndX].sx + nodes[indexLowestEndX].w
	const lowestEndY = nodes[indexLowestEndY].sy + nodes[indexLowestEndY].h
	const highestStartX = nodes[indexHighestStartX].sx
	const highestStartY = nodes[indexHighestStartY].sy
	const dx = Math.abs(lowestEndX - highestStartX)
	const dy = Math.abs(lowestEndY - highestStartY)
	let itemLowestEnd
	let itemHighestStart
	if (dx > dy) {
		if (indexLowestEndX > indexHighestStartX) {
			itemLowestEnd = nodes.splice(indexLowestEndX, 1)[0]
			itemHighestStart = nodes.splice(indexHighestStartX, 1)[0]
		} else {
			itemHighestStart = nodes.splice(indexHighestStartX, 1)[0]
			itemLowestEnd = nodes.splice(indexLowestEndX, 1)[0]
		}
	} else {
		if (indexLowestEndY > indexHighestStartY) {
			itemLowestEnd = nodes.splice(indexLowestEndY, 1)[0]
			itemHighestStart = nodes.splice(indexHighestStartY, 1)[0]
		} else {
			itemHighestStart = nodes.splice(indexHighestStartY, 1)[0]
			itemLowestEnd = nodes.splice(indexLowestEndY, 1)[0]
		}
	}
	return [
		{
			sx: itemLowestEnd.sx,
			sy: itemLowestEnd.sy,
			w: itemLowestEnd.w,
			h: itemLowestEnd.h,
			nodes: [itemLowestEnd],
		},
		{
			sx: itemHighestStart.sx,
			sy: itemHighestStart.sy,
			w: itemHighestStart.w,
			h: itemHighestStart.h,
			nodes: [itemHighestStart],
		},
	]
}

function Ven$Rtree_pickNext(nodes, a, b, minWidth, debug = true) {
	const areaA = Ven$Rtree_Rectangle.squarifiedRatio(a.w, a.h, a.nodes.length + 1)
	const areaB = Ven$Rtree_Rectangle.squarifiedRatio(b.w, b.h, b.nodes.length + 1)
	/**
	 * "正方化"起始节点 a, 记作 SQ(A)
	 * "正方化"起始节点 b, 记作 SQ(B)
	 *
	 * 逐一遍历 nodes
	 * 取任意的 nodes[i] 并"正方化"后取值记作 SQ(nodes[i])
	 * 计算 SQ(nodes[i]) 和 SQ(A) 的差的绝对值, 记作 DA
	 * 计算 SQ(nodes[i]) 和 SQ(B) 的差的绝对值, 记作 DB
	 * 取整个遍历周期内 DA 和 DB 的差的最小值 m, 并记录对应的索引 highAreaNodeIndex = i
	 *
	 * 从 nodes 中删除 highAreaNodeIndex 位置处的元素, 并将该元素插入到 a 或 b 的子节点列表中
	 */
	let highAreaDelta = undefined
	let lowestGrowthGroup = null
	let highAreaNodeIndex = -1
	const debugIdA = Ven$Rtree_getHashIden()
	const debugIdB = Ven$Rtree_getHashIden()
	for (let i = nodes.length - 1; i >= 0; i--) {
		const item = nodes[i]
		const tempItemA = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempItemA.sx = Math.min(a.sx, item.sx)
		tempItemA.sy = Math.min(a.sy, item.sy)
		tempItemA.ex = Math.max(a.sx + a.w, item.sx + item.w)
		tempItemA.ey = Math.max(a.sy + a.h, item.sy + item.h)
		tempItemA.w = tempItemA.ex - tempItemA.sx
		tempItemA.h = tempItemA.ey - tempItemA.sy
		debug && Ven$Rtree_debugUpdateRectangleAuxiliary(debugIdA, tempItemA, '#444400')
		const tempItemAreaA = Ven$Rtree_Rectangle.squarifiedRatio(tempItemA.w, tempItemA.h, a.nodes.length + 2)
		const changeTempAreaA = Math.abs(tempItemAreaA - areaA)
		/* ... */
		const tempItemB = { sx: 0, sy: 0, ex: 0, ey: 0, w: 0, h: 0 }
		tempItemB.sx = Math.min(b.sx, item.sx)
		tempItemB.sy = Math.min(b.sy, item.sy)
		tempItemB.ex = Math.max(b.sx + b.w, item.sx + item.w)
		tempItemB.ey = Math.max(b.sy + b.h, item.sy + item.h)
		tempItemB.w = tempItemB.ex - tempItemB.sx
		tempItemB.h = tempItemB.ey - tempItemB.sy
		debug && Ven$Rtree_debugUpdateRectangleAuxiliary(debugIdB, tempItemB, '#448800')
		const tempItemAreaB = Ven$Rtree_Rectangle.squarifiedRatio(tempItemB.w, tempItemB.h, b.nodes.length + 2)
		const changeTempAreaB = Math.abs(tempItemAreaB - areaB)
		/**
		 * old if: !highAreaNodeIndex || !highAreaDelta || Math.abs(changeTempAreaB - changeTempAreaA) < highAreaDelta
		 */
		if (highAreaNodeIndex === -1 || typeof highAreaDelta === 'undefined' || Math.abs(changeTempAreaB - changeTempAreaA) <= highAreaDelta) {
			highAreaNodeIndex = i
			highAreaDelta = Math.abs(changeTempAreaB - changeTempAreaA)
			lowestGrowthGroup = changeTempAreaB < changeTempAreaA ? b : a
		}
	}
	debug && Ven$Rtree_debugRemoveRectangleAuxiliary(debugIdA)
	debug && Ven$Rtree_debugRemoveRectangleAuxiliary(debugIdB)
	const nodesInitLength = nodes.length
	const dist = minWidth - nodesInitLength
	const tempNode = nodes.splice(highAreaNodeIndex, 1)[0]
	if (a.nodes.length <= dist) {
		a.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(a, tempNode)
		return
	}
	if (b.nodes.length <= dist) {
		b.nodes.push(tempNode)
		Ven$Rtree_Rectangle.expandRectangle(b, tempNode)
		return
	}
	lowestGrowthGroup.nodes.push(tempNode)
	Ven$Rtree_Rectangle.expandRectangle(lowestGrowthGroup, tempNode)
}

function Ven$Rtree_searchSubtree(rect, root, isGetNodeDataOnly = true) {
	const result = []
	if (!Ven$Rtree_Rectangle.overlapRectangle(rect, root)) {
		return result
	}
	/**
	 * hitStack 是一个元素类型为数组的数组
	 * 在任意一次 for 遍历过程中, 在满足条件的情况下, 某一节点的所有子节点将作为一个整体, 存入 hitStack 中
	 *
	 * 由于
	 * 		1. hitStack.pop()
	 * 		2. for 倒序遍历
	 * 遍历某一节点的子节点列表时, 都会从最左子节点开始
	 * 当某一个子节点 C(n) 满足条件时, 将 C(n) 的子节点列表作为一个整体存入 hitStack 中
	 * 当某一个子节点 C(n) 不满足条件时, 继续遍历 C(n) 的前一个兄弟节点
	 * 整个遍历过程将是一个类似"深度优先"的处理流程
	 */
	const hitStack = [root.nodes]
	while (hitStack.length > 0) {
		const nodes = hitStack.pop()
		for (let i = nodes.length - 1; i >= 0; i--) {
			const itemTree = nodes[i]
			if (Ven$Rtree_Rectangle.overlapRectangle(rect, itemTree)) {
				if (itemTree.nodes) {
					hitStack.push(itemTree.nodes)
					continue
				}
				if (itemTree.leaf) {
					if (isGetNodeDataOnly) {
						result.push(itemTree.leaf)
						continue
					}
					result.push(itemTree)
				}
			}
		}
	}
	return result
}

function Ven$Rtree_getFlattenLeafs(trees) {
	const result = []
	let treesCopy = trees.slice()
	while (treesCopy.length) {
		const current = treesCopy.pop()
		if (current.nodes) {
			treesCopy = treesCopy.concat(current.nodes)
			continue
		}
		if (current.leaf) {
			result.push(current)
			continue
		}
	}
	return result
}

function Ven$Rtree_removeArea(rect, rootTree, minWidth, maxWidth, balanceChildrenOnDeleting) {
	let countDeleted = 0
	let result = []
	do {
		countDeleted = result.length
		const removeResult = Ven$Rtree_removeSubtree(rect, false, rootTree, minWidth, maxWidth, balanceChildrenOnDeleting)
		result = result.concat(removeResult)
	} while (countDeleted !== result.length)
	return result
}

function Ven$Rtree_removeObj(rect, targetOnLeaf, rootTree, minWidth, maxWidth, balanceChildrenOnDeleting) {
	const result = Ven$Rtree_removeSubtree(rect, targetOnLeaf, rootTree, minWidth, maxWidth, balanceChildrenOnDeleting)
	return result
}

function Ven$Rtree_removeSubtree(rect, targetOnLeaf, root, minWidth, maxWidth, balanceChildrenOnDeleting) {
	let result = []
	if (!rect || !Ven$Rtree_Rectangle.overlapRectangle(rect, root)) {
		return result
	}
	let handleItem = {
		sx: rect.sx,
		sy: rect.sy,
		w: rect.w,
		h: rect.h,
		target: targetOnLeaf,
	}
	let currentDepth = 1
	let lastItemIndex = -1
	let chooseStack = [root]
	let chooseChildIndexStack = [root.nodes.length - 1]
	let tree = null
	let itemTree = null
	while (chooseStack.length > 0) {
		tree = chooseStack.pop()
		lastItemIndex = chooseChildIndexStack.pop()
		Ven$Rtree_debugUpdateRectangleAuxiliary(tree.id, tree)
		if (handleItem.hasOwnProperty('target')) {
			/**
			 * 逐级遍历子节点树
			 * 		每次选择子节点列表的最后一个逐级往下遍历
			 * 		将当前遍历到的节点记作 itemTree
			 * 		当遍历到满足以下任意条件:
			 * 			=>. 如果 handleItem.target 存在有效目标对象值(即从树中指定删除某个存储对象), 再满足以下任意条件:
			 * 					=>. 需要 itemTree 为叶子节点且同时满足 itemTree.leaf 等于 handleItem.target
			 * 			=>. 如果 handleItem.target 存在有效目标对象值(即范围删除), 再满足以下任意条件:
			 * 					=>. 需要 itemTree 为叶子节点
			 * 					=>. itemTree 的矩形尺寸范围包含于 handleItem 描述的矩形尺寸范围内
			 *      即对 itemTree 做对应的处理:
			 * 			如果 itemTree 为叶子节点
			 * 				从其所在节点列表(集合)中移除之, 将被移除的节点集合作为返回值
			 * 			如果 itemTree 为中间层节点
			 * 				获取扁平化后的所有叶子节点, 将其作为返回值
			 * 				从其所在节点列表(集合)中移除之
			 * 		需要读取 itemTree.parent 的所有子节点并修正 itemTree.parent 的矩形尺寸数值
			 */
			while (lastItemIndex >= 0) {
				itemTree = tree.nodes[lastItemIndex]
				Ven$Rtree_debugUpdateRectangleAuxiliary(itemTree.id || 'leaf', itemTree)
				if (Ven$Rtree_Rectangle.overlapRectangle(handleItem, itemTree)) {
					const isConfirm =
						handleItem.target !== false
							? itemTree.leaf === handleItem.target
							: itemTree.hasOwnProperty('leaf') || Ven$Rtree_Rectangle.containsRectangle(itemTree, handleItem)
					if (isConfirm) {
						if (itemTree.hasOwnProperty('nodes')) {
							result = Ven$Rtree_getFlattenLeafs([itemTree])
							tree.nodes.splice(lastItemIndex, 1)
						} else {
							result = tree.nodes.splice(lastItemIndex, 1)
						}
						Ven$Rtree_Rectangle.makeMBR(tree, tree.nodes)
						Ven$Rtree_debugUpdateRectangleAuxiliary(tree.id, tree)
						delete handleItem.target
						if (balanceChildrenOnDeleting && tree.nodes.length < minWidth) {
							/**
							 * 搜索并返回当前 tree 节点所占矩形尺寸内从 tree 节点层开始的所有叶子节点
							 * 将搜索结果暂存到 handler 中
							 * 当前 tree 节点将在下一轮外循环中被从其所在的节点集合中移除(Action: Remove Child Node)
							 */
							handleItem.nodes = Ven$Rtree_searchSubtree({ sx: tree.sx, sy: tree.sy, w: tree.w, h: tree.h }, tree, false) // Action: Get All Leafs
						}
						break
					}
					/**
					 * 栈存当前遍历对象后继续遍历子节点
					 * 		将每级选择的子节点的索引栈存
					 * 		将当前的树节点栈存
					 *
					 * 		仅当其子节点列表不为空时执行
					 */
					if (itemTree.hasOwnProperty('nodes') && itemTree.nodes.length) {
						currentDepth += 1
						chooseStack.push(tree)
						chooseChildIndexStack.push(lastItemIndex)
						tree = itemTree
						lastItemIndex = itemTree.nodes.length - 1
						continue
					}
				}
				/**
				 * 如果当前检索的范围和当前节点 itemTree 的矩形尺寸范围没有交集, 则继续检查 itemTree 的前一个兄弟节点
				 */
				lastItemIndex--
				/**
				 * 当 itemTree 已经是其所在节点集合中的第一个且其为叶子节点时
				 * 即表示已经遍历到树的某一分支的最左底部
				 *
				 * 如果此时 chooseChildIndexStack 不为空, 则网上回溯到最近的分叉节点, 选择前一个子节点树并继续往下遍历
				 */
				if (lastItemIndex < 0 && chooseChildIndexStack.length) {
					--chooseChildIndexStack[chooseChildIndexStack.length - 1]
				}
			}
			continue
		}
		if (handleItem.hasOwnProperty('nodes')) {
			/**
			 * 在某一轮遍历过程中, 约定 theTreeItem 为当前遍历节点 tree 的子节点
			 * theTreeItem 在 tree.nodes 中的索引即 lastItemIndex
			 *
			 * 如果 theTreeItem 的子节点个数小于节点最小阈值
			 * 需要将该节点从其所在的节点集合(tree.nodes)中移除
			 * 同时将 theTreeItem 下的所有叶子节点(handleItem.nodes)重新插入到 tree 中
			 */
			tree.nodes.splice(lastItemIndex, 1) // Action: Remove Child Node
			Ven$Rtree_Rectangle.makeMBR(tree, tree.nodes)
			Ven$Rtree_debugUpdateRectangleAuxiliary(tree.id, tree)
			for (let k = 0; k < handleItem.nodes.length; k++) {
				Ven$Rtree_insertSubtree(handleItem.nodes[k], tree, minWidth, maxWidth, false)
			}
			Ven$Rtree_debugUpdateRectangleAuxiliary(tree.id, tree)
			handleItem.nodes = []
			if (chooseStack.length === 0 && tree.nodes.length <= 1) {
				/**
				 * 平衡子树的调整策略
				 *
				 * 当回溯到 root 节点时, 如果其子节点个数小于等于 1
				 * 需要获取 tree 下的所有叶子节点, 即 handleItem.nodes
				 * 将当前 tree 节点重新存入 chooseStack 中, 以便继续开启新一轮外循环
				 * 继而使得 handleItem.nodes 将被重新插入到 tree.parent
				 */
				handleItem.nodes = Ven$Rtree_searchSubtree({ sx: tree.sx, sy: tree.sy, w: tree.w, h: tree.h }, tree, false)
				tree.nodes = []
				chooseStack.push(tree)
				chooseChildIndexStack.push(0)
				currentDepth -= 1
				continue
			}
			if (chooseStack.length > 0 && tree.nodes.length < minWidth) {
				/**
				 * 平衡子树的调整策略
				 *
				 * 在回溯过程中, 如果当前遍历的节点 tree 为非 root 节点, 且其子节点个数小于最小阈值
				 * 需要获取 tree 下的所有叶子节点, 即 handleItem.nodes
				 * 在随即的下一轮外循环中, handleItem.nodes 将被重新插入到 tree.parent
				 */
				handleItem.nodes = Ven$Rtree_searchSubtree({ sx: tree.sx, sy: tree.sy, w: tree.w, h: tree.h }, tree, false)
				tree.nodes = []
				currentDepth -= 1
				continue
			}
			delete handleItem.nodes
			currentDepth -= 1
			continue
		}
		/**
		 * 不断往上遍历, 回溯至 root 节点
		 * 在每一轮回溯过程中, 依据当前 tree.nodes 修正 tree 的矩形尺寸数值
		 */
		Ven$Rtree_Rectangle.makeMBR(tree, tree.nodes)
		Ven$Rtree_debugUpdateRectangleAuxiliary(tree.id, tree)
		currentDepth -= 1
	}
	Ven$Rtree_debugRemoveRectangleAuxiliary('leaf')
	return result
}

function Ven$Rtree_attachData(newTree, root) {
	root.nodes = newTree.nodes
	root.sx = newTree.sx
	root.sy = newTree.sy
	root.w = newTree.w
	root.h = newTree.h
	return root
}
