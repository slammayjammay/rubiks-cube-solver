const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const output = {
	path: __dirname + '/lib/',
	library: 'rubiksCubeSolver',
	libraryTarget: 'umd'
};

const es5 = {
	entry: './src/index.common.js',
	output: Object.assign({}, output, {
		filename: 'index.common.js'
	}),
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: /\.js$/
			}
		]
	},
	plugins: [
		new UglifyJSPlugin()
	]
};

const es6 = {
	entry: './src/index.js',
	output: Object.assign({}, output, {
		filename: 'index.es6.js'
	})
};

module.exports = [es5, es6];
