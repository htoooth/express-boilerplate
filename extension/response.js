
module.exports = (req, res, next) => {
  res.ok = (data = {}, code = 200) => {
    return res.json({
      data,
      code,
      message: 'ok'
    })
  }

  res.err = (message = 'wrong', data = {}, code = 500) => {
    return res.json({
      code,
      data,
      message
    })
  }

  next()
}