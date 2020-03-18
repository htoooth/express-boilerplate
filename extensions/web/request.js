const _ = require('lodash')

module.exports = (req, res, next) => {
  req.body = _.merge({}, req.query, req.body, req.params)

  next()
}
