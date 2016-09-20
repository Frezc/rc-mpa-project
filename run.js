/**
 * Created by ypc on 2016/9/18.
 */
const del = require('del')
const webpack = require('webpack')

const tasks = new Map()

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

function runWebpack(config) {
  return new Promise((res, rej) => {
    webpack(config).run((err, stats) => {
      if (err) rej(err)
      else {
        console.log(stats.toString(config.stats))
        res()
      }
    })
  })
}

tasks.set('clean', () => del(['dist/*']))

tasks.set('bundle', () => {
  const Configs = require('./utils/makeWebpackConfigs')
  // console.log(runWebpack(Configs.getMainConfig(['index'], true)))
  return Promise.resolve()
      .then(() => runWebpack(Configs.getDllConfig(true)))
      .then(() => runWebpack(Configs.getMainConfig(['index'], true)))
})

tasks.set('build', () => {
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('bundle'))
})

tasks.set('list', () => {
  console.log('Available command list:');
  [
    'clean: del dist/*',
    'bundle: bundle asset by webpack using production mode'
  ].map(msg => console.log(msg));
})

run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'list' /* default */)