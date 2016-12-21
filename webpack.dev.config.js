var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	context: path.join(__dirname,'./src/entries'),
	entry: {
		main : './main.js'
	},
	output: {
		path: path.join(__dirname,'hot'),
		// publicPath: "/bundles/",
		filename: '[name].bundle.js',
		chunkFilename: '[id].chunk.js'
	},
	module: {
		loaders: [
			{ test : /\.less$/, loader : 'style-loader!css-loader!postcss-loader!less-loader'},
			{ test : /\.css$/,  loader : 'style-loader!css-loader' },
			{ test : /\.jsx?$/, loader : 'babel' , exclude: /(node_modules|bower_components)/},
			// { test : /\.jsx?$/ , loader : 'babel-loader' , query:{ presets : ['es2015','react'] } , exclude: /(node_modules|bower_components)/},
			//如果不超过30000/1024kb,那么就直接采用dataUrl的形式,超过则返回链接,图片会复制到dist目录下
			{ test: /\.(png|jpg|jpeg|gif)$/, loader: "url-loader?limit=30000" },
			{ test: /\.(svg|ttf|eot|svg|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/, loader : 'file-loader'}
		]
	},

	resolve : {
		root : path.resolve('./src')
	},

	postcss: function () {
		return [require('autoprefixer'),require('postcss-filter-gradient')];
	},
	plugins : [ 
		new webpack.DefinePlugin({
			'process.env' : {
				NODE_ENV : JSON.stringify('development')
			}
		}),
		new webpack.optimize.CommonsChunkPlugin('commons', '[name].bundle.js'),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template : path.join(__dirname,'src/dev.html'),
			inject: true,
			chunks : ['commons','main']
		})
	],
	debug : true,
	devtool : '#inline-source-map'

	//devServer 配置在webpack.dev.server.js 中
}