const fs = require('fs')
const path = require('path')

const webpackDevConfig = {
	name: `client`,
	target: `web`,
	mode: `production`,
	entry: {
		main: './web-sample/chrome-extends/performance/scripts/performance.source.js',
	},
	output: {
		path: path.resolve(fs.realpathSync(process.cwd()), './web-sample/chrome-extends/performance/scripts'),
		filename: 'performance.js',
	},
	resolve: {
		extensions: ['.js'],
		enforceExtension: false,
	},
	performance: {
		hints: `warning`,
		maxAssetSize: 40000000,
		maxEntrypointSize: 60000000,
	},
}

module.exports = webpackDevConfig
