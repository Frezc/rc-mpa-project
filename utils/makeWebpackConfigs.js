/**
 * Created by ypc on 2016/9/18.
 */
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

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

const baseConfig = {
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },

  module: {
    loaders: [{
      test: /\.js?/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel']
    }, {
      test: /\.(scss|css)$/,
      // exclude: /node_modules/,
      loaders: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass'])
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
    new webpack.DllReferencePlugin({
      context: ROOT_DIR,
      manifest: require('../dist/vendor.json')
    }),
    new AddAssetHtmlPlugin({
      filepath: 'maintain/dist/vendor.js',
      includeSourcemap: false,
      hash: true
    }),
    new ExtractTextPlugin('[name].css')
  ]
}

const prodPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    },
    comments: false
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  })
]

/**
 * 生成dll的配置
 */
function getDllConfig(prod) {
  const plugins = [
    new webpack.DllPlugin({
      path: path.join(BUILD_DIR, '[name].json'),
      name: '[name]_[chunkhash]',
      context: ROOT_DIR
    })
  ]
  if (prod) {
    plugins.push(
      new webpack.NoErrorsPlugin(),
      ...prodPlugins
    )
  }
  return {
    entry: {
      vendor: ['react', 'react-dom', 'babel-polyfill']
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      library: '[name]_[chunkhash]'
    },
    plugins: plugins
  }
}

function getMainConfig(pages, prod) {
  if (pages && pages.length > 0) {
    var c = Object.assign({}, baseConfig, {
      entry: pages.reduce(function (pre, cur) {
        pre[cur] = APP_DIR + `/${cur}.js`
        return pre
      }, {}),
      plugins: baseConfig.plugins.concat(pages.map(page =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: APP_DIR + `/templates/${page}.html`,
          hash: true,
          chunks: [page]
        })
      ))
    })
    if (prod) {
      Object.assign(c, {
        plugins: [
          ...c.plugins,
          ...prodPlugins
        ]
      })
    } else {
      c['devtool'] = 'eval'
    }
  }
}

module.exports = {
  getDllConfig: getDllConfig,
  getMainConfig: getMainConfig
}