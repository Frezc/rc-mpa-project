/**
 * Created by ypc on 2016/9/18.
 */
const devConfig = require('./makeWebpackConfigs')
const libs = require('./configs').libs
module.exports = devConfig.getDllConfig(libs)