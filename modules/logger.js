
const log4js = require('log4js')


log4js.configure({
  appenders: {
    out: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'debug'
    }
  },
  disableClustering: true
})

module.exports = (config) => {
  const logger = log4js.getLogger('app')
  logger.level = 'debug'
  return logger
}