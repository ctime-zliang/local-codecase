function updateView(ideal, real, diff, params) {
	document.getElementById('idealValue').textContent = ideal
	document.getElementById('realValue').textContent = real
	document.getElementById('diffValue').textContent = diff
	document.getElementById('paramsValue').textContent = params
}

let endTimeStamp = 20000

ven$accurateSetTimeout(
	(options, { idealTimeStamp, realTimeStamp, timeStampDifference }) => {
		updateView(idealTimeStamp, realTimeStamp, timeStampDifference, options ? JSON.stringify(options) : '-')
		// return performance.now() >= endTimeStamp ? false : true
	},
	{ a: 1 },
	(1 / 60) * 1000
)
