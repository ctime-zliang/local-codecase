function getCurrentTab(callback) {
	chrome.tabs.query({ active: true }, ([tab]) => {
		if (!tab) {
			return
		}
		callback(tab)
	})
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	getCurrentTab(tab => {
		chrome.tabs.sendMessage(tab.id, { ...request })
	})
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		chrome.tabs.sendMessage(tabId, { action: 'PAGE_LOADED', data: { tabId: tabId } })
	}
})

chrome.action.onClicked.addListener(() => {
	getCurrentTab(tab => {
		chrome.tabs.sendMessage(tab.id, { action: 'PLUGIN_ICON_CLICKED' })
	})
})
