module.exports = (req, res, next) => {
  req.ctx = {
    req,
    res
  }

  next()
}
