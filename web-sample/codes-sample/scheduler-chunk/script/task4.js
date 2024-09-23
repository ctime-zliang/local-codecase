const RUNTIME_PROFILE4 = {
	taskSize: 100,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest4'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE4.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE4.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 1000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE4.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	taskHandler(i, sourceArray, len) {
		for (let j = 0; j < len - 1 - i; j++) {
			if (sourceArray[j] > sourceArray[j + 1]) {
				const swap = sourceArray[j + 1]
				sourceArray[j + 1] = sourceArray[j]
				sourceArray[j] = swap
			}
		}
	},
	taskHandler2(sourceArray) {
		const arrCopy = sourceArray.slice(0)
		const len = arrCopy.length
		for (let i = 0; i < len; i++) {
			for (let j = 0; j < len - 1 - i; j++) {
				if (arrCopy[j] > arrCopy[j + 1]) {
					const swap = arrCopy[j + 1]
					arrCopy[j + 1] = arrCopy[j]
					arrCopy[j] = swap
				}
			}
		}
		return arrCopy
	},
}

function task4() {
	RUNTIME_PROFILE4.initData()
	/* ... */
	const appendDOMTaskBtn1Element = RUNTIME_PROFILE4.taskContainerElement.querySelector(`.append-dom-task-btn1`)
	appendDOMTaskBtn1Element.addEventListener('click', async function (e) {
		const LENGTH = RUNTIME_PROFILE4.sortDatas.length
		console.time(`Task`)
		const array = RUNTIME_PROFILE4.taskHandler2([...RUNTIME_PROFILE4.sortDatas])
		console.log(array)
		console.timeEnd(`Task`)
	})
	const appendDOMTaskBtn2Element = RUNTIME_PROFILE4.taskContainerElement.querySelector(`.append-dom-task-btn2`)
	appendDOMTaskBtn2Element.addEventListener('click', async function (e) {
		const LENGTH = RUNTIME_PROFILE4.sortDatas.length
		console.time(`Task`)
		const copyArray1 = [...RUNTIME_PROFILE4.sortDatas]
		console.log(`排序前: `, copyArray1)
		for (let i = 0; i < copyArray1.length; i++) {
			// console.time(`Loop ${i}`)
			RUNTIME_PROFILE4.taskHandler(i, copyArray1, LENGTH)
			// console.log(`每轮外循环后: `, copyArray1)
			// console.timeEnd(`Loop ${i}`)
		}
		console.log(`排序后: `, copyArray1)
		console.timeEnd(`Task`)
	})
	const appendDOMTaskBtn3Element = RUNTIME_PROFILE4.taskContainerElement.querySelector(`.append-dom-task-btn3`)
	appendDOMTaskBtn3Element.addEventListener('click', async function (e) {
		const LENGTH = RUNTIME_PROFILE4.sortDatas.length
		const scheduler = window.setTimeout.bind(window)
		console.time(`Task`)
		const copyArray2 = [...RUNTIME_PROFILE4.sortDatas]
		console.log(`排序前: `, copyArray2)
		for (let i = 0; i < copyArray2.length; i++) {
			console.time(`Chunk ${i}`)
			await schedulerTask(() => {
				RUNTIME_PROFILE4.taskHandler(i, copyArray2, LENGTH)
			}, scheduler)
			// console.log(`每轮外循环后: `, copyArray2)
			console.timeEnd(`Chunk ${i}`)
		}
		console.log(`排序后: `, copyArray2)
		console.timeEnd(`Task`)
	})
}
