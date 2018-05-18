
const log4js = require('log4js')

module.exports = (config) => {
  const logger = log4js.getLogger()
  logger.level = 'debug'
  return logger
}