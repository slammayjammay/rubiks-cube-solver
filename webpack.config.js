const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname + '/lib/',
		filename: 'index.js',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new UglifyJSPlugin()
	]
};
