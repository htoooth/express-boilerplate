module.exports = (req, res, next) => {
  req.body = req.method.toLowerCase() === 'get' ? req.query : req.body

  next()
}
