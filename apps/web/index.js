module.exports = scope => {
  const express = require('express')
  const path = require('path')
  const cookieParser = require('cookie-parser')
  const bodyParser = require('body-parser')
  const nunjucks = require('nunjucks')
  const onRender = require('on-rendered')
  const log4js = require('log4js')
  const helmet = require('helmet')
  const cookieSession = require('cookie-session')
  const upload = require('../../extensions/web/upload')

  const uploadInstance = upload.getInstance({
    storage: upload.qiniuStorage(scope.config.qn_access)
  })

  const webApp = express()
  webApp.scope = scope
  webApp.use(helmet())
  webApp.use(
    cookieSession({
      name: 'session',
      keys: ['1212', '1212fds']
    })
  )
  webApp.use(log4js.connectLogger(scope.getLogger('webApp'), { level: 'info' }))
  webApp.use(bodyParser.json())
  webApp.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  webApp.use(cookieParser())
  webApp.use(express.static(path.join(__dirname, '../..', './public')))

  nunjucks.configure(path.join(__dirname, '../..', './extensions/web/view'), {
    autoescape: true,
    express: webApp
  })

  webApp.use(onRender())

  const errHandle = require('../../extensions/web/error')
  const requestExtension = require('../../extensions/web/request')
  const responseExtension = require('../../extensions/web/response')
  const contextExtension = require('../../extensions/web/context')
  const applicationExtension = require('../../extensions/web/application')

  applicationExtension(webApp)
  webApp.use(contextExtension)
  webApp.use(requestExtension)
  webApp.use(responseExtension)

  require('./dispatch')(webApp)

  webApp.post('/upload', uploadInstance.any(), function(req, res) {
    return res.ok(req.files)
  })

  webApp.all('*', errHandle.notFound)
  webApp.use(errHandle.serverError)

  return webApp
}
