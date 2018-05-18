const isProd = process.env.NODE_ENV === 'production'; // 生产
const isStage = process.env.NODE_ENV === 'stage'; // 灰度
const isTest = process.env.NODE_ENV === 'test'; // 测试
const isDev = process.env.NODE_ENV === 'develop'; // 开发
const _ = require('lodash');

const config = require('./config')

if (isProd) {
  _.merge(config, require('./config.prod'))
} else if (isStage) {
  _.merge(config, require('./config.stage'))
} else if (isTest) {
  _.merge(config, require('./config.test'))
} else if (isDev) {
  _.merge(config, require('./config.dev'))
}

module.exports = config