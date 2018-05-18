module.exports = (scope, cb) => {
  const express = require('express')
  const path = require('path')
  const cookieParser = require('cookie-parser')
  const bodyParser = require('body-parser')
  const nunjucks = require('nunjucks')
  const onRender = require('on-rendered')

  const logger = scope.logger
  const config = scope.config

  const pkg = require('./package.json')
  const webApp = express()

  webApp.scope = scope
  webApp.use(bodyParser.json())
  webApp.use(bodyParser.urlencoded({
    extended: false
  }))
  webApp.use(cookieParser())
  webApp.use(express.static(path.join(__dirname, 'public')))

  nunjucks.configure('./extension/view', {
    autoescape: true,
    express: webApp
  })

  webApp.use(onRender())

  try {
    const errHandle = require('./extension/error')
    const requestExtension = require('./extension/request')
    const responseExtension = require('./extension/response')
    const contextExtension = require('./extension/context')
    const applicationExtension = require('./extension/application')

    applicationExtension(webApp)
    webApp.use(contextExtension)
    webApp.use(requestExtension)
    webApp.use(responseExtension)

    require('./dispatch')(webApp)

    webApp.all('*', errHandle.notFound)
    webApp.use(errHandle.serverError)

  } catch (e) {
    logger.error(e)
  }

  webApp.listen(config.port, () => {
    logger.info(`${pkg.name} start at http://localhost:${config.port}/`)
    cb(null, webApp)
  })

}