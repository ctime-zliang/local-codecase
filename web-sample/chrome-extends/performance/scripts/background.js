const chromOpearManager = {
	getCurrentTab(callback) {
		chrome.tabs.query({ active: true }, ([tab]) => {
			if (!tab) {
				return
			}
			callback(tab)
		})
	},
	getCPUInfo(callback) {
		chrome.system.cpu.getInfo(function (cpuInfo) {
			callback(cpuInfo)
		})
	},
	getMemoryInfo(callback) {
		chrome.system.memory.getInfo(function (memoryInfo) {
			callback(memoryInfo)
		})
	},
}

const cpuUsageManager = {
	lastCpuInfo: null,
	update(cpuInfo) {
		if (!cpuUsageManager.lastCpuInfo) {
			cpuUsageManager.lastCpuInfo = cpuInfo
			return 0
		}
		const usage = cpuUsageManager.calculateAverageUsage(cpuUsageManager.lastCpuInfo.processors, cpuInfo.processors)
		cpuUsageManager.lastCpuInfo = cpuInfo
		return usage
	},
	/****************************************************************************************************/
	/****************************************************************************************************/
	calculateCoreUsage(oldSample, newSample) {
		const totalDiff = newSample.total - oldSample.total
		const idleDiff = newSample.idle - oldSample.idle
		if (totalDiff === 0) {
			return 0
		}
		const usage = ((totalDiff - idleDiff) / totalDiff) * 100
		return Math.round(usage * 100) / 100
	},
	calculateAverageUsage(oldProcessors, newProcessors) {
		let totalUsage = 0
		for (let i = 0; i < oldProcessors.length; i++) {
			totalUsage += cpuUsageManager.calculateCoreUsage(oldProcessors[i].usage, newProcessors[i].usage)
		}
		return totalUsage / oldProcessors.length / 100
	},
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'USR_CHANGE_MODE') {
		chromOpearManager.getCurrentTab(tab => {
			chrome.tabs.sendMessage(tab.id, { ...message })
		})
		return
	}
	if (message.action === 'USR_GET_SYSINFO') {
		chromOpearManager.getCurrentTab(tab => {
			chromOpearManager.getCPUInfo(cpuInfo => {
				chromOpearManager.getMemoryInfo(memoryInfo => {
					chrome.tabs.sendMessage(tab.id, { ...message, data: { cpuUsage: cpuUsageManager.update(cpuInfo), ...memoryInfo } })
				})
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
	chromOpearManager.getCurrentTab(tab => {
		chrome.tabs.sendMessage(tab.id, { action: 'SYS_PLUGIN_ICON_CLICKED' })
	})
})
