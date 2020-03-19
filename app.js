const async = require('async')
const http = require('http')

function main() {
  async.auto(
    {
      pkg(cb) {
        cb(null, require('./package.json'))
      },
      config(cb) {
        cb(null, require('./config'))
      },
      logger: [
        'config',
        (scope, cb) => {
          const logger = require('./modules/logger')(scope.config)
          cb(null, logger)
        }
      ],
      getLogger: [
        'logger',
        (scope, cb) => {
          cb(null, require('./modules/getLogger')(scope.config))
        }
      ],
      redis: [
        'config',
        'logger',
        (scope, cb) => {
          const redis = require('./modules/redis')
          cb(null, redis)
        }
      ],
      util(cb) {
        cb(null, require('./modules/util'))
      },
      modules: [
        'util',
        'logger',
        'redis',
        (scope, cb) => {
          scope.logger.info('all modules are loaded')
          cb()
        }
      ],
      webApp: [
        'modules',
        'config',
        (scope, cb) => {
          try {
            const webApp = require('./apps/web')(scope)
            const server = http.createServer(webApp)
            cb(null, server)
          } catch (e) {
            cb(e)
          }
        }
      ],
      wssApp: [
        'webApp',
        (scope, cb) => {
          const wssApp = require('./apps/wss')(scope)
          wssApp.attach(scope.webApp)
          cb(null, wssApp)
        }
      ],
      apps: [
        'webApp',
        'wssApp',
        (scope, cb) => {
          scope.logger.info('all apps are loaded')
          cb()
        }
      ],
      ready: [
        'modules',
        'apps',
        (scope, cb) => {
          const logger = scope.logger
          const config = scope.config

          scope.webApp.listen(config.port, () => {
            logger.info(
              `webapp is running at ${config.hostName}:${config.port}`
            )
            cb()
          })
        }
      ]
    },
    function(err, scope) {
      const logger = scope.logger
      const pkg = scope.pkg

      if (err) {
        return logger.error(err)
      }

      logger.info(`${pkg.name} is running`)

      process
        .on('unhandledRejection', (reason, p) => {
          logger.error(reason, 'Unhandled Rejection at Promise', p)
        })
        .on('uncaughtException', err => {
          logger.error(err, 'Uncaught Exception thrown')
          process.exit(1)
        })
    }
  )
}

main()
