class BlockTest {
	static profile = {
		blockBtnId: 'blockBtn',
	}

	static init() {
		const appContainer = document.getElementById('appContainer')
		appContainer.append(document.createRange().createContextualFragment(`<button id="${this.profile.blockBtnId}">Block Btn</button>`))
		const blockBtn = document.getElementById(this.profile.blockBtnId)
		blockBtn.addEventListener('click', e => {
			ven$blocking(1000)
		})
	}
}
