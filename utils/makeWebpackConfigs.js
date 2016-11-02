/**
 * Created by ypc on 2016/9/18.
 */
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v')

const BUILD_DIR = path.resolve(__dirname, '../dist')
const APP_DIR = path.resolve(__dirname, '../src')
const ROOT_DIR = path.resolve(__dirname, '..')

const AUTOPREFIXER_BROWSERS = [
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1'
]

/**
 * 设置webpack输出信息
 */
function getStats(isDebug) {
  return {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  }
}

function getBaseConfig(prod) {
  return {
    output: {
      path: BUILD_DIR,
      filename: '[name].js'
    },

    module: {
      loaders: [{
        test: /\.js?/,
        exclude: /node_modules/,
        loaders: prod ? ['babel'] : ['react-hot', 'babel']
      }, {
        test: /\.(scss|css)$/,
        loader: prod ? ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass']) : 'style!css!postcss!sass'
      }, {
        test: /\.(svg|woff([\?]?.*)|ttf([\?]?.*)|eot([\?]?.*)|svg([\?]?.*))$/i,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192'
      }]
    },

    postcss: [autoprefixer({ browsers: AUTOPREFIXER_BROWSERS })],

    plugins: [
      new webpack.NoErrorsPlugin(),

      new ExtractTextPlugin('[name].css')
    ]
  }
}

const prodPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false,
      drop_console: true
    },
    comments: false,
    mangle: true,
    minimize: true
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]

/**
 * 生成dll的配置
 */
function getDllConfig(libs, prod) {
  const plugins = [
    new webpack.DllPlugin({
      path: path.join(BUILD_DIR, '[name].json'),
      name: '[name]_[chunkhash]',
      context: ROOT_DIR
    })
  ]
  if (prod) {
    plugins.push(
      new webpack.NoErrorsPlugin()
    )
    prodPlugins.map(plugin => plugins.push(plugin))
  }
  return {
    devtool: false,
    entry: libs,
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      library: '[name]_[chunkhash]'
    },
    plugins: plugins,
    stats: getStats(!prod)
  }
}

function getMainConfig(entry, prod) {
  if (entry) {
    const baseConfig = getBaseConfig(prod)
    var c = Object.assign({}, baseConfig, {
      entry: { [entry.name]: [APP_DIR + `/${entry.name}/index.js`] },
      output: {
        path: BUILD_DIR + `/${entry.name}`,
        filename: 'index.js'
      },
      plugins: baseConfig.plugins.concat(
        new HtmlWebpackPlugin({
          filename: `index.html`,
          template: APP_DIR + `/${entry.name}/index.html`,
          hash: true,
          chunks: [entry.name],
          cache: true
        }),
        new webpack.DllReferencePlugin({
          context: ROOT_DIR,
          manifest: require(`../dist/${entry.vendor}.json`)
        }),
        new AddAssetHtmlPlugin({
          filepath: `dist/${entry.vendor}.js`,
          includeSourcemap: false,
          hash: true
        })
      ),
      stats: getStats(!prod)
    })
    if (prod) {
      Object.assign(c, {
        plugins: [
          ...c.plugins,
          ...prodPlugins
        ]
      });
    } else {
      c['devtool'] = 'eval';
      c.entry[entry.name].unshift("webpack-dev-server/client?http://localhost:7991/", "webpack/hot/dev-server");
      c.plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    return c
  } else {
    throw new TypeError('Entry cannot be empty')
  }
}

module.exports = {
  getDllConfig: getDllConfig,
  getMainConfig: getMainConfig
}