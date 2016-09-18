/**
 * Created by ypc on 2016/9/18.
 */
const del = require('del')

const tasks = new Map()

tasks.set('clean', () => del(['../dist/*']))

tasks.set('bundle', () => {

})
