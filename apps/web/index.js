module.exports = scope => {
  const express = require('express')
  const path = require('path')
  const cookieParser = require('cookie-parser')
  const bodyParser = require('body-parser')
  const nunjucks = require('nunjucks')
  const onRender = require('on-rendered')
  const log4js = require('log4js')

  const webApp = express()
  webApp.scope = scope
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

  webApp.all('*', errHandle.notFound)
  webApp.use(errHandle.serverError)

  return webApp
}
