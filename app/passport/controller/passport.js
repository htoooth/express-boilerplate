
exports.index = function index(req, res, next) {
  res.on('beforeRender', function() {
    console.log('before');
  })

  res.on('render', function() {
    console.log('after');
  })

  console.log('route',req.route)
  console.log('path',req.path)
  console.log('originalUrl', req.originalUrl)
  console.log('url', req.url)
  console.log('hostname',req.hostname)
  console.log('mountpath',req.app.mountpath)
  console.log('baseurl',req.baseUrl)

  res.render('passport.njk', {
    context: {
      test1: 'test1',
      test2: 'test2'
    }
  })
}