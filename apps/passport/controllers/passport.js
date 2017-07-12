
exports.index = function index(req, res, next) {
  res.render('passport.njk', {
    context: {
      test1: 'test1',
      test2: 'test2'
    }
  })
}