
exports.index = function index(req, res, next) {
  res.on('beforeRender', function() {
    console.log('before');
  })

  res.on('render', function() {
    console.log('after');
  })

  res.render('passport.njk', {
    context: {
      test1: 'test1',
      test2: 'test2'
    }
  })
}