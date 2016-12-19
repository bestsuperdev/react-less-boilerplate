var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var es3ifyPlugin = require('es3ify-webpack-plugin')

module.exports = {
	context: path.join(__dirname,'./src/entries'),
	entry: {
		main : './main.js',
		commons : ['react','react-dom']
	},
	output: {
		path: path.join(__dirname,'dist'),
		// publicPath: "/bundles/",
		filename: '[name].[hash].bundle.js',
		chunkFilename: '[id].[chunkhash].chunk.js'
	},
	externals : {
		'react' : 'React',
		'react-dom' : 'ReactDOM'
	},
	module: {
		loaders: [
			{ test : /\.less$/, loader : ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader!less-loader',{publicPath : ''}) },
			{ test : /\.css$/,  loader : ExtractTextPlugin.extract('style-loader','css-loader',{publicPath : ''}) },
			// { test: /\.jsx?$/, loader : 'uglify-loader!babel-loader?presets[]=react,presets[]=es2015' , exclude: /(node_modules|bower_components)/},
			{ test : /\.jsx?$/ ,loader : 'babel' , exclude: /(node_modules|bower_components)/},
			{ test : /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=30000' },
			{ test : /\.(svg|ttf|eot|svg|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/, loader : 'file-loader'}
		]
	},

	resolve : {
		root : path.resolve('./src')
	},
	postcss: function () {
		return [require('autoprefixer'),require('postcss-filter-gradient')]
	},
	plugins : [
		new es3ifyPlugin(),		
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				properties  : false
			},
			mangle: {
				except: ['$super', '$', 'exports', 'require'],
			},
			output : {
				keep_quoted_props: true
			}
		}),
		new webpack.DefinePlugin({
			'process.env' : {
				NODE_ENV : JSON.stringify('production')
			}
		}),
		new webpack.optimize.CommonsChunkPlugin('commons', '[name].[hash].bundle.js'),
		new ExtractTextPlugin('[name].[hash].bundle.css',{allChunks: true}),
		new HtmlWebpackPlugin({
			template : path.join(__dirname,'src/dist.html'),
			inject: true,
			chunks : ['commons','main']
		})
	]

}