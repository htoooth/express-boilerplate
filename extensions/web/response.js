
const _ = require('lodash')

module.exports = (req, res, next) => {
  res.ok = (result) => {
    if (result.data || result.code) {
      return res.json(result)
    }

    return res.json({
      result,
      code: 200,
      message: 'ok'
    })
  }

  res.error = (result) => {
    if (_.isString(result)) {
      return res.json({
        code: 400,
        message: result
      })
    }

    if (result instanceof Error) {
      return res.json({
        code: result.status,
        message: result.message
      })
    }

    if (result.code) {
      return res.json(result)
    }

    return res.json({
      code: 400,
      data: result,
      message
    })
  }

  res.return = (result) => {
    if (res.error) {
      return res.error(result.error)
    }

    return res.ok(result)
  }

  next()
}