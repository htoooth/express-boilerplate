const isProd = process.env.NODE_ENV === 'production' // 生产
const isStage = process.env.NODE_ENV === 'staging' // 灰度
const isTest = process.env.NODE_ENV === 'testing' // 测试
const isDev = process.env.NODE_ENV === 'development' // 开发
const _ = require('lodash')

const config = require('./config')

if (isProd) {
  _.merge(config, require('./config.production'))
} else if (isStage) {
  _.merge(config, require('./config.staging'))
} else if (isTest) {
  _.merge(config, require('./config.testing'))
} else if (isDev) {
  _.merge(config, require('./config.development'))
}

module.exports = config
