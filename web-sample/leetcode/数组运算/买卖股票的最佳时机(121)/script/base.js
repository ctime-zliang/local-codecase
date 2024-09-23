/*
    给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

    你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

    返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
 */

function loopCalc(prices) {
	/**
	 * 初始化最大利润值
	 */
	let maxProfitValue = 0
	/**
	 * 初始化交易日自然索引值(以 1 开始)
	 */
	let dayIndex = 0
	/**
	 * 遍历整个数组
	 *      计算某一项与其下一项的差值, 并于历史缓存的最大利润值比较, 并保留索引
	 */
	for (let i = 0; i < prices.length - 1; i++) {
		for (let j = i; j < prices.length; j++) {
			/**
             *  如果
                    某一项与其下一项的差为负值
                即
                    表示次日股价是下跌的, 则直接跳过
             */
			const p = prices[j] - prices[i]
			if (p < 0) {
				continue
			}
			if (maxProfitValue < p) {
				maxProfitValue = p
				dayIndex = j + 1
			}
		}
	}
	console.log(`dayIndex === ${dayIndex}`)
	return maxProfitValue
}

function maxCalc(prices) {
	/**
	 * 假定第一天的交易价格为最低
	 */
	let minPrice = prices[0]
	let maxProfitValue = 0
	/**
     *  遍历整个数组
            遍历到某一项时, 假定这一项在未来(数组当前项的后续所有项)所有项中为最低值
                如果
                    当前项比之前缓存的历史最低值更低
                即
                    表示股价正在下跌, 需要缓存这一个更低的价格值
                也即
                    当未来股价上涨时, 有可能获得更大的利润
            同时遍历到当前项时, 需要求出已获得的利润
                如果
                    此利润值为非正数
                即
                    表示亏本
                则
                    继续往后遍历
                如果
                    此利润为正数
                则
                    比较当前的利润与历史缓存的利润的大小, 并缓存最大利润 
     */
	for (let i = 1; i < prices.length; i++) {
		minPrice = Math.min(prices[i], minPrice)
		const gotProfitValue = prices[i] - minPrice
		if (gotProfitValue <= 0) {
			continue
		}
		maxProfitValue = Math.max(gotProfitValue, maxProfitValue)
	}
	return maxProfitValue
}

function maxProfit(prices) {
	return maxCalc(prices)
}

const prices = [7, 1, 5, 3, 6, 4]
console.log(maxProfit(prices))
