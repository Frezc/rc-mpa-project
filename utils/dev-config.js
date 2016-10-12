/**
 * Created by ypc on 2016/9/18.
 */
const devConfig = require('./makeWebpackConfigs')
const pages = require('./configs').pages
module.exports = devConfig.getMainConfig(pages)