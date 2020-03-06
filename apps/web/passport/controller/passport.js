exports.index = function index(req, res, next) {
  res.on('beforeRender', function() {
    req.app.scope.logger.info('before')
  })

  res.on('render', function() {
    req.app.scope.logger.info('after')
  })

  res.render('passport.njk', {
    context: {
      test1: 'test1',
      test2: 'test2'
    }
  })
}
