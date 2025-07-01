function getCurrentTab(callback) {
	chrome.tabs.query({ active: true }, ([tab]) => {
		if (!tab) {
			return
		}
		callback(tab)
	})
}

function getCPUInfo(callback) {
	chrome.system.cpu.getInfo(function (info) {
		callback(info)
	})
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'USR_CHANGE_MODE') {
		getCurrentTab(tab => {
			chrome.tabs.sendMessage(tab.id, { ...message })
		})
		return
	}
	if (message.action === 'USR_GET_CPUINFO') {
		getCurrentTab(tab => {
			getCPUInfo(info => {
				chrome.tabs.sendMessage(tab.id, { ...message, cpuInfo: info })
			})
		})
	}
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		chrome.tabs.sendMessage(tabId, { action: 'SYS_PAGE_LOADED', data: { tabId: tabId } })
	}
})

chrome.action.onClicked.addListener(() => {
	getCurrentTab(tab => {
		chrome.tabs.sendMessage(tab.id, { action: 'SYS_PLUGIN_ICON_CLICKED' })
	})
})
