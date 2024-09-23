const data = {
	username: 'zhangsan',
	level: '1',
	symbolItem: {
		title: 'symbol',
		author: {
			nickname: 'lisi',
		},
		id: 's-1',
	},
	footprintItem: {
		title: 'footprint',
		project: {
			projectName: 'test',
			belong: 'wangwu',
		},
		id: 'f-1',
	},
	list: [
		{ name: 'name-1', id: '1' },
		{ name: 'name-2', id: '2' },
	],
}

data.symbolItem.parent = data
data.footprintItem.parent = data

const proxyStore = new xProxy.ProxyState(data)
const proxyData = proxyStore.proxyObject

console.log(proxyStore)

const subscribeCancel = xProxy.subscribe(proxyData, op => {
	console.log(`subscribe.op = `, op)
	const snapItem = xProxy.snapshot(proxyData)
	console.log(`subscribe.snapshot = `, snapItem)
})

const snapItem1 = xProxy.snapshot(proxyData)
console.log(`snapItem1 = `, snapItem1)

proxyData.username = 'zhangsan_updated'
delete proxyData.level
proxyData.newKey = 'addKey'
proxyData.symbolItem.title = 'symbol_updated'
proxyData.age = 18
proxyData.list.push({ name: 'name-3', id: '3' })
proxyData.list[1].name = 'name-2_updated'

// subscribeCancel()

const snapItem2 = xProxy.snapshot(proxyData)
console.log(`snapItem2 = `, snapItem2)
