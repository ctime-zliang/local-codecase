const RUNTIME_PROFILE1 = {
	taskSize: 50000,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest1'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE1.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE1.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 5000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE1.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	appendChild(idx) {
		const divElement = document.createElement('div')
		const appendTargetContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container`)
		divElement.innerText = idx
		appendTargetContainerElement.appendChild(divElement)
		// const array = window.ArraySort.ven$bubbleSortOptimi([...RUNTIME_PROFILE1.sortDatas])
	},
}

function runtimeProfile1TestItem0() {
	const profile = {}
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-dom-task-btn0`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		for (let i = 0; i < RUNTIME_PROFILE1.taskSize; i++) {
			RUNTIME_PROFILE1.appendChild(i)
		}
		window.requestAnimationFrame(() => {
			const spanElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container-childcount`)
			const childContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector('.append-target-container')
			spanElement.innerText = childContainerElement.childElementCount
			profile.aEndTime = performance.now()
			console.log(`Task Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
		})
	})
}

function runtimeProfile1TestItem1() {
	const profile = {}
	/* ... */
	const schedulerHandler = Ven$SchedulerChunk.broswerSchedulerChunk(RUNTIME_PROFILE1.taskSize, RUNTIME_PROFILE1.appendChild)
	schedulerHandler.setChunkStartHandler((chunkCount, taskIndex) => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} Start, Task Index: ${taskIndex}.`)
	})
	schedulerHandler.setChunkEndHandler((chunkCount, taskIndex) => {
		profile.eEndTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} End, Task Index: ${taskIndex}, time: ${profile.eEndTime - profile.eStartTime}.`)
		const spanElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container-childcount`)
		const childContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector('.append-target-container')
		spanElement.innerText = childContainerElement.childElementCount
	})
	schedulerHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-dom-task-btn1`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		schedulerHandler.start()
	})
}

function runtimeProfile1TestItem2() {
	const profile = {}
	/* ... */
	const schedulerHandler = Ven$SchedulerChunk.broswerSchedulerChunk2(RUNTIME_PROFILE1.taskSize, RUNTIME_PROFILE1.appendChild)
	schedulerHandler.setChunkStartHandler((chunkCount, taskIndex) => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} Start, Task Index: ${taskIndex}.`)
	})
	schedulerHandler.setChunkEndHandler((chunkCount, taskIndex) => {
		profile.eEndTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} End, Task Index: ${taskIndex}, time: ${profile.eEndTime - profile.eStartTime}.`)
		const spanElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container-childcount`)
		const childContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector('.append-target-container')
		spanElement.innerText = childContainerElement.childElementCount
	})
	schedulerHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-dom-task-btn2`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		schedulerHandler.start()
	})
}

function runtimeProfile1TestItem3() {
	const profile = {}
	/* ... */
	const schedulerHandler = Ven$SchedulerChunk.broswerSchedulerChunk3(RUNTIME_PROFILE1.taskSize, RUNTIME_PROFILE1.appendChild)
	schedulerHandler.setChunkStartHandler((chunkCount, taskIndex) => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} Start, Task Index: ${taskIndex}.`)
	})
	schedulerHandler.setChunkEndHandler((chunkCount, taskIndex) => {
		profile.eEndTime = performance.now()
		console.log(`Chunk Item Count: ${chunkCount} End, Task Index: ${taskIndex}, time: ${profile.eEndTime - profile.eStartTime}.`)
		const spanElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container-childcount`)
		const childContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector('.append-target-container')
		spanElement.innerText = childContainerElement.childElementCount
	})
	schedulerHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-dom-task-btn3`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		schedulerHandler.start()
	})
}

function task1() {
	RUNTIME_PROFILE1.initData()
	/* ... */
	runtimeProfile1TestItem0()
	runtimeProfile1TestItem1()
	runtimeProfile1TestItem2()
	runtimeProfile1TestItem3()
}
