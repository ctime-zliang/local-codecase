const MAX_LENGTH = 50000

const createArray = len => {
	const array = []
	const min = 0
	const max = 100000
	for (let i = len - 1; i >= 0; i--) {
		array.push(ven$getRandomInArea(min, max))
	}
	return array
}

const bubbleSortOptimi1Handler = array => {
	console.time('bubbleSortOptimi1')
	const res = window.ArraySort.ven$bubbleSortOptimi(array)
	console.timeEnd('bubbleSortOptimi1')
	console.log(`sort list length: ${array.length}`, res)
}

const quickSeqSort1Handler = array => {
	console.time('quickSeqSort1')
	const res = window.ArraySort.ven$quickSeqSort(array)
	console.timeEnd('quickSeqSort1')
	console.log(`sort list length: ${array.length}`, res)
}

function main() {
	const array = createArray(MAX_LENGTH)
	/* ... */
	const bubbleSortOptimi1Element = document.getElementById('bubbleSortOptimi1')
	ven$bindEvent(bubbleSortOptimi1Element, 'click', function (evte) {
		bubbleSortOptimi1Handler(array)
	})
	/* ... */
	const quickSeqSort1Element = document.getElementById('quickSeqSort1')
	ven$bindEvent(quickSeqSort1Element, 'click', function (evte) {
		quickSeqSort1Handler(array)
	})
}

document.addEventListener('DOMContentLoaded', function () {
	main()
})
