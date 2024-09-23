const GeoData = window.Ven$RTreeGeoData

function appendRectDraw(rectList, container) {
	let wrapper = document.createDocumentFragment()
	rectList.forEach((item, index) => {
		const pos = item[0]
		const data = item[1]
		let htmlString = `
			<div id="${data.id}" style="position: absolute; overflow: hidden; font-size: 12px; width: ${pos.w}px; height: ${pos.h}px; left: ${pos.sx}px; top: ${pos.sy}px; background-color: rgba(128, 128, 128, 0.5);">
				<div>${index}. ${data.id}</div>
				<div>sx = ${pos.sx}</div>
				<div>sy = ${pos.sy}</div>
				<div>w = ${pos.w}</div>
				<div>h = ${pos.h}</div>
			</div>
		`
		let itemElement = document.createRange().createContextualFragment(htmlString)
		wrapper.appendChild(itemElement)
	})
	container.appendChild(wrapper)
}

function removeRectDraw(idList) {
	idList.forEach(item => {
		const element = document.getElementById(item)
		if (!element) {
			return
		}
		element.remove()
	})
}

function main1() {
	const rtree = new Ven$RTree()

	const data00 = { id: '000' }
	const data01 = { id: '001' }
	const data02 = { id: '002' }
	const data03 = { id: '003' }
	const data04 = { id: '004' }
	const data05 = { id: '005' }
	const data16 = { id: '016' }
	const TestGetData = [
		[{ sx: 100, sy: 100, w: 100, h: 100 }, data00],
		[{ sx: 250, sy: 250, w: 100, h: 100 }, data01],
		[{ sx: 150, sy: 400, w: 100, h: 100 }, data02],
		[{ sx: 300, sy: 50, w: 100, h: 100 }, data03],
		[{ sx: 400, sy: 350, w: 100, h: 100 }, data04],
		[{ sx: 450, sy: 150, w: 100, h: 100 }, data05],
		[{ sx: 650, sy: 200, w: 100, h: 100 }, { id: '006' }],
		[{ sx: 800, sy: 100, w: 100, h: 100 }, { id: '007' }],
		[{ sx: 850, sy: 300, w: 100, h: 100 }, { id: '008' }],
		[{ sx: 700, sy: 450, w: 100, h: 100 }, { id: '009' }],
		[{ sx: 550, sy: 500, w: 100, h: 100 }, { id: '010' }],
		[{ sx: 350, sy: 600, w: 100, h: 100 }, { id: '011' }],
		[{ sx: 50, sy: 550, w: 100, h: 100 }, { id: '012' }],
		[{ sx: 800, sy: 650, w: 100, h: 100 }, { id: '013' }],
		[{ sx: 500, sy: 700, w: 100, h: 100 }, { id: '014' }],
		[{ sx: 900, sy: 500, w: 100, h: 100 }, { id: '015' }],
		[{ sx: 100, sy: 100, w: 100, h: 100 }, data16],
	]
	appendRectDraw(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach((v, i) => {
		rtree.insertItemData(v[0], v[1])
	})

	const targetRect1 = { sx: 50, sy: 50, w: 500, h: 500 }
	Ven$Rtree_debugUpdateRectangleAuxiliary('SEARCH', targetRect1, 'blue')
	const result1 = rtree.search(targetRect1, true)
	console.log('区域搜索仅返回绑定数据', result1)
	const result2 = rtree.search(targetRect1, false)
	console.log('区域搜索返回叶子节点', result2)
	const result3 = rtree.search({ sx: 150, sy: 150, w: 0, h: 0 }, true)
	console.log('点搜索仅返回绑定数据', result3)

	window.setTimeout(() => {
		// const ids = [...Ven$Rtree_storageAuxiliary.ids]
		// ids.forEach((id, idx) => {
		// 	Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		// })
		// const targetRect = { sx: 450, sy: 150, w: 50, h: 550 }
		// Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION1', targetRect, 'blue')
		// const remoteResult = rtree.removeArea(targetRect)
		// removeRectDraw(remoteResult.map((item, index) => {
		// 	return item.leaf.id
		// }))
		// console.log(`移除元素`, remoteResult)
	}, 1500)

	window.setTimeout(() => {
		const ids = [...Ven$Rtree_storageAuxiliary.ids]
		ids.forEach((id, idx) => {
			Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		})
		const targetRect = { sx: 100, sy: 100, w: 100, h: 100 }
		Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION2', targetRect, 'blue')
		const remoteResult = rtree.removeTarget(targetRect, data16)
		removeRectDraw(
			remoteResult.map((item, index) => {
				return item.leaf.id
			})
		)
		console.log(`移除元素`, remoteResult)
	}, 1500)

	window.setTimeout(() => {
		// const ids = [...Ven$Rtree_storageAuxiliary.ids]
		// ids.forEach((id, idx) => {
		// 	Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		// })
		// const targetRect = { sx: 450, sy: 150, w: 0, h: 0 }
		// Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION3', targetRect, 'blue')
		// const remoteResult = rtree.removeTarget(targetRect, data05)
		// removeRectDraw(
		// 	remoteResult.map((item, index) => {
		// 		return item.leaf.id
		// 	})
		// )
		// console.log(`移除元素`, remoteResult)
	}, 1500)

	console.log(rtree)
}

function main2() {
	const rtree = new Ven$RTree(20)

	const TRANSLATE_X = 100
	const TRANSLATE_Y = 100
	const data01 = { id: '1e1' }
	const data02 = { id: '1e2' }
	const data03 = { id: '1e3' }
	const data04 = { id: '1e4' }
	const data05 = { id: '1e5' }
	const data06 = { id: '1e6' }
	const data07 = { id: '1e7' }
	const data08 = { id: '1e8' }
	const data09 = { id: '1e9' }
	const data10 = { id: '1e10' }
	const data11 = { id: '1e11' }
	const data12 = { id: '1e12' }
	const data13 = { id: '1e13' }
	const data14 = { id: '1e14' }
	const data15 = { id: '1e15' }
	const data16 = { id: '1e16' }
	const data17 = { id: '1e17' }
	const data18 = { id: '1e18' }
	const data19 = { id: '1e19' }
	const data20 = { id: '1e20' }
	const data21 = { id: '1e21' }
	const TestGetData = [
		[{ sx: -40.784428446057845 + TRANSLATE_X, sy: -1 + TRANSLATE_Y, w: 41.784428446057845, h: 22.530610912095934 }, data01],
		[{ sx: -1 + TRANSLATE_X, sy: -5.106122182419188 + TRANSLATE_Y, w: 9.95688568921157, h: 6.106122182419188 }, data02],
		[{ sx: -33.75681866339067 + TRANSLATE_X, sy: -1 + TRANSLATE_Y, w: 34.75681866339067, h: 53.51706008678703 }, data03],
		[{ sx: -1 + TRANSLATE_X, sy: -11.303412017357408 + TRANSLATE_Y, w: 8.551363732678134, h: 12.303412017357408 }, data04],
		[{ sx: -44.83310685112788 + TRANSLATE_X, sy: -68.76699797710008 + TRANSLATE_Y, w: 45.33310685112788, h: 69.26699797710008 }, data05],
		[{ sx: -0.5 + TRANSLATE_X, sy: -0.5 + TRANSLATE_Y, w: 9.866621370225579, h: 14.653399595420014 }, data06],
		[{ sx: -3.5 + TRANSLATE_X, sy: -3.5 + TRANSLATE_Y, w: 7, h: 7 }, data07],
		[{ sx: -2 + TRANSLATE_X, sy: -2 + TRANSLATE_Y, w: 4, h: 4 }, data08],
		[{ sx: -86.3990625 + TRANSLATE_X, sy: -86.3990625 + TRANSLATE_Y, w: 172.798125, h: 172.798125 }, data09],
		[{ sx: 37.69953124999999 + TRANSLATE_X, sy: 65.66352895031507 + TRANSLATE_Y, w: 5, h: 7.928203230275514 }, data10],
		[{ sx: 65.66352895031505 + TRANSLATE_X, sy: 37.69953125000001 + TRANSLATE_Y, w: 7.928203230275514, h: 5 }, data11],
		[{ sx: 75.8990625 + TRANSLATE_X, sy: -0.49999999999999534 + TRANSLATE_Y, w: 9, h: 1.0000000000000004 }, data12],
		[{ sx: 65.66352895031507 + TRANSLATE_X, sy: -42.69953124999998 + TRANSLATE_Y, w: 7.928203230275514, h: 4.999999999999993 }, data13],
		[{ sx: 37.69953124999999 + TRANSLATE_X, sy: -73.59173218059058 + TRANSLATE_Y, w: 5, h: 7.928203230275514 }, data14],
		[{ sx: -0.4999999999999906 + TRANSLATE_X, sy: -84.8990625 + TRANSLATE_Y, w: 1.0000000000000009, h: 9 }, data15],
		[{ sx: -42.69953125000001 + TRANSLATE_X, sy: -73.59173218059057 + TRANSLATE_Y, w: 5, h: 7.928203230275514 }, data16],
		[{ sx: -73.59173218059055 + TRANSLATE_X, sy: -42.699531250000035 + TRANSLATE_Y, w: 7.9282032302755, h: 5 }, data17],
		[{ sx: -84.8990625 + TRANSLATE_X, sy: -0.5000000000000155 + TRANSLATE_Y, w: 9, h: 1.0000000000000016 }, data18],
		[{ sx: -73.59173218059057 + TRANSLATE_X, sy: 37.69953125000001 + TRANSLATE_Y, w: 7.928203230275514, h: 5 }, data19],
		[{ sx: -42.699531250000035 + TRANSLATE_X, sy: 65.66352895031504 + TRANSLATE_Y, w: 5, h: 7.928203230275514 }, data20],
		[{ sx: -0.5000000000000207 + TRANSLATE_X, sy: 75.8990625 + TRANSLATE_Y, w: 1.000000000000002, h: 9 }, data21],
	]
	appendRectDraw(TestGetData, document.getElementById('appContainer'))

	TestGetData.forEach((v, i) => {
		rtree.insertItemData(v[0], v[1])
	})

	console.log(rtree)

	window.setTimeout(() => {
		const ids = [...Ven$Rtree_storageAuxiliary.ids]
		ids.forEach((id, idx) => {
			Ven$Rtree_debugRemoveRectangleAuxiliary(id)
		})
		TestGetData.forEach((v, i) => {
			rtree.removeTarget(v[0], v[1])
		})
		// const targetRect = { sx: -86.3990625 + TRANSLATE_X, sy: -86.3990625 + TRANSLATE_Y, w: 172.798125, h: 172.798125 }
		// Ven$Rtree_debugUpdateRectangleAuxiliary('DELETION1', targetRect, 'blue')
		// const remoteResult = rtree.removeTarget(targetRect, data09)
		// removeRectDraw(
		// 	remoteResult.map((item, index) => {
		// 		return item.leaf.id
		// 	})
		// )
		// console.log(`移除元素`, remoteResult)
	}, 1500)
}

// main1()
main2()
