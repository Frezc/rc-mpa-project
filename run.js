/**
 * Created by ypc on 2016/9/18.
 */
const del = require('del')
const webpack = require('webpack')
const configs = require('./utils/configs')
const Configs = require('./utils/makeWebpackConfigs');
const WebpackDevServer = require('webpack-dev-server');

const tasks = new Map()

function run(task, argus) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)(argus)).then(() => {
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

tasks.set('clean', () => del(['dist/*']));

tasks.set('bundle', () => {
  const pages = configs.pages;
  return Promise.resolve()
    .then(() => runWebpack(Configs.getDllConfig(configs.libs, true)))
    .then(() => Promise.all(Object.keys(pages).map((key) =>
      runWebpack(Configs.getMainConfig(pages[key], true))
    )))
    .then(() => del(Object.keys(configs.libs).map(lib => `dist/${lib}.json`)))
});

tasks.set('build', () => {
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('bundle'))
});

tasks.set('dev', page => {
  const config = Configs.getMainConfig(configs.pages[page]);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    stats: config.stats,
    proxy: {
      '/api_proxy': {
        target: 'http://tjz.frezc.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api_proxy': '' }
      }
    }
  });
  server.listen(7991);
});

tasks.set('debug', page => {
  return runWebpack(Configs.getMainConfig(configs.pages[page]));
})

tasks.set('list', () => {
  console.log('Available command list:');
  [
    'clean: del dist/*',
    'bundle: bundle asset by webpack using production mode',
    'dev {page-name}: run the webpack-dev-server for this page',
    'debug {page-name}: generate debug file'
  ].map(msg => console.log(msg));
})

run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'list' /* default */, process.argv.slice(3))