/**
 * Created by ypc on 2016/9/18.
 */
const devConfig = require('./makeWebpackConfigs')
module.exports = devConfig.getMainConfig(['index'])