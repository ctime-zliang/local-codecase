const btnElement = document.getElementById('btn')
const boxElement = document.getElementById('box')

const a1 = new AsyncAnimator(1000, p => {
	const tx = 100 * p
	boxElement.style.transform = 'translateX(' + tx + 'px)'
})

const a2 = new AsyncAnimator(1000, p => {
	const ty = 100 * p
	boxElement.style.transform = 'translate(100px,' + ty + 'px)'
})

const a3 = new AsyncAnimator(1000, p => {
	const tx = 100 * (1 - p)
	boxElement.style.transform = 'translate(' + tx + 'px, 100px)'
})

const a4 = new AsyncAnimator(1000, p => {
	const ty = 100 * (1 - p)
	boxElement.style.transform = 'translateY(' + ty + 'px)'
})

function main() {
	btnElement.addEventListener('click', async function (e) {
		while (true) {
			await a1.animate()
			await a2.animate()
			await a3.animate()
			await a4.animate()
		}
	})
}

window.addEventListener('DOMContentLoaded', function () {
	main()
})
