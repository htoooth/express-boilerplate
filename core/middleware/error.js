
exports.pageNotFound = (req, res, next) => {
  if (req.xhr) {
    return res.json({
      code: 404,
      message: 'error'
    });
  }

  res.render('error-404.njk');
}

exports.serverError = (err, req, res, next) => {
  if (req.xhr) {
    return res.json({
      code: 500,
      message: 'server error'
    });
  }

  res.render('error-404.njk');
}