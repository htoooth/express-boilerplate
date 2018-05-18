
const async = require('async')

function main() {
  async.auto({
    config(cb) {
      cb(null, require('./config'))
    },
    logger: ['config', (scope, cb) => {
      const logger = require('./module/logger')(scope.config)
      cb(null, logger)
    }],
    redis: ['config', (scope, cb) => {
      const redis = require('./module/redis')
      cb(null, redis)
    }],
    util(cb) {
      cb(null, require('./module/util'))
    },
    module: ['util', 'logger', 'redis', (scope, cb) => {
      cb()
    }],
    web: ['config', 'module',(scope, cb) => {
      const web = require('./web')(scope, cb)
    }],
    ready: ['module', 'web', (scope, cb) => {
      cb()
    }]
  }, function(err, scope) {
    const logger = scope.logger

    logger.info('app running')
  })
}

main()