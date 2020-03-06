exports.notFound = (req, res, next) => {
  if (req.xhr) {
    return res.error({
      code: 404,
      message: 'not found'
    })
  }

  res.render('error-404.njk')
}

exports.serverError = (err, req, res, next) => {
  if (req.xhr) {
    return res.error({
      code: 500,
      message: 'server error'
    })
  }

  res.render('error-500.njk', { err })
}
