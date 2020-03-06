const log4js = require('log4js')

module.exports = config => {
  log4js.configure(config.logger)

  const logger = log4js.getLogger('app')
  logger.level = 'debug'
  return logger
}
