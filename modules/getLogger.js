const log4js = require('log4js')

module.exports = scope => {
  return module => log4js.getLogger(module)
}
