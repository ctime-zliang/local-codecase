const boxElement = document.getElementById('box')

const a1 = new Ven$AsyncAnimator(1000, progress => {
	const tx = 300 * progress
	boxElement.style.transform = 'translateX(' + tx + 'px)'
})

const a2 = new Ven$AsyncAnimator(1000, progress => {
	const ty = 300 * progress
	boxElement.style.transform = 'translate(300px,' + ty + 'px)'
})

const a3 = new Ven$AsyncAnimator(1000, progress => {
	const tx = 300 * (1 - progress)
	boxElement.style.transform = 'translate(' + tx + 'px, 300px)'
})

const a4 = new Ven$AsyncAnimator(1000, progress => {
	const ty = 300 * (1 - progress)
	boxElement.style.transform = 'translateY(' + ty + 'px)'
})

function main() {
	boxElement.addEventListener('click', async function (e) {
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
