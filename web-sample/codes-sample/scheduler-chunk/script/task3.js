const RUNTIME_PROFILE3 = {
	taskSize: 10000,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest3'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE3.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE3.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 6000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE3.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	appendChild(idx) {
		const divElement = document.createElement('div')
		const appendTargetContainerElement = RUNTIME_PROFILE3.taskContainerElement.querySelector(`.append-target-container`)
		divElement.innerText = idx
		appendTargetContainerElement.appendChild(divElement)
		// const array = window.ArraySort.ven$bubbleSortOptimi([...RUNTIME_PROFILE3.sortDatas])
	},
}

function task3() {
	RUNTIME_PROFILE3.initData()
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE3.taskContainerElement.querySelector(`.append-dom-task-btn`)
	appendDOMTaskBtnElement.addEventListener('click', async function (e) {
		const scheduler = window.setTimeout.bind(window)
		console.time(`Task`)
		for (let i = 0; i < RUNTIME_PROFILE3.taskSize; i++) {
			// RUNTIME_PROFILE3.appendChild(i)
			// continue
			console.time(`Chunk ${i}`)
			await schedulerTask(() => {
				RUNTIME_PROFILE3.appendChild(i)
			}, scheduler)
			console.timeEnd(`Chunk ${i}`)
		}
		console.timeEnd(`Task`)
	})
}
