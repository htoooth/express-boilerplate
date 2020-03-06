
module.exports = {
  appName: 'main-app',
  hostName: 'http://localhost',
  port: 3000,
  logger: {
    appenders: {
      out: {
        type: 'console'
      }
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'debug'
      }
    },
    disableClustering: true
  }
}
