function main() {
	const option = {
		cols: [
			{ title: 'ID', key: `index`, width: 0.1 },
			{ title: '姓名', key: `name`, width: 0.45 },
			{ title: '年龄', key: `age`, width: 0.45 },
		],
		draggable: true,
		dragEndCallback(dataList, handleInitialIndex, targetRealTimeIndex, handleRealTimeIndex) {
			console.log(`当前被拖拽行的初始索引: `, handleInitialIndex)
			console.log(`当前被拖拽行的实时索引: `, handleRealTimeIndex)
			console.log(`被插入的索引位置: `, targetRealTimeIndex)
			const copyList = [...dataList]
			const handleItemData = copyList[handleInitialIndex]
			copyList.splice(handleInitialIndex, 1)
			copyList.splice(targetRealTimeIndex, 0, handleItemData)
			table.upadteTableContent(copyList)
			console.log(copyList)
		},
	}
	const table = new Table(document.getElementById('appContainer'), option)
	const list = []
	for (let i = 0; i < 20; i++) {
		list.push({ $id: i, $draggable: true, index: i, name: `name ${i}`, age: 10 + i })
	}
	table.upadteTableContent(list)
	// table.updateTableStatus('no list')
}

main()
