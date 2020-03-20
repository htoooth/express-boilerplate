const _ = require('lodash')

module.exports = (req, res, next) => {
  res.ok = result => {
    if (!result) {
      return res.json({
        code: 200,
        message: 'ok'
      })
    }

    if (result.data || result.code) {
      return res.json({
        code: 200,
        data: {},
        ...result
      })
    }

    return res.json({
      data: result,
      code: 200,
      message: 'ok'
    })
  }

  res.error = result => {
    if (!result) {
      return res.json({
        code: 400,
        message: 'wrong'
      })
    }

    if (_.isString(result)) {
      return res.json({
        code: 400,
        message: result
      })
    }

    if (result instanceof Error) {
      return res.json({
        code: result.code,
        message: result.message
      })
    }

    if (result.code) {
      return res.json(result)
    }

    return res.json({
      code: 400,
      data: result,
      message: 'wrong'
    })
  }

  res.return = result => {
    if (result.error) {
      return res.error(result.error)
    }

    return res.ok(result)
  }

  next()
}
