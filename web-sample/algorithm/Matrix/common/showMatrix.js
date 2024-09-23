function showMatrix(container, data, row, col, title) {
	if (row * col !== data.length) {
		throw new Error('illegal matrix.')
	}
	let matrixTitle = title || `Matrix ${row}x${col}`
	let htmlStrArr = []
	htmlStrArr.push(
		`<div style="display: inline-flex; flex-direction: column; justify-content: center; width: fit-content; border: 1px solid #dcdcdc;box-sizing: border-box; margin: 10px 10px;">`
	)
	htmlStrArr.push(`<h4 style="padding: 5px 10px; margin: 0; text-align: center;">${matrixTitle}</h4>`)
	htmlStrArr.push(`<table border="0" cellspacing="0" cellpadding="0" style="text-align: center;">`)
	htmlStrArr.push(`<tbody>`)
	for (let ri = 0; ri <= row - 1; ri++) {
		htmlStrArr.push(`<tr>`)
		for (let ci = 0; ci <= col - 1; ci++) {
			const index = ci + ri * col
			htmlStrArr.push(`<td style="padding: 5px 5px; min-width: 50px;">${data[index]}</td>`)
		}
		htmlStrArr.push(`</tr>`)
	}
	htmlStrArr.push(`</tbody>`)
	htmlStrArr.push(`</table>`)
	htmlStrArr.push(`</div>`)
	const fragmentElement = document.createRange().createContextualFragment(htmlStrArr.join('\n'))
	container.appendChild(fragmentElement)
}
