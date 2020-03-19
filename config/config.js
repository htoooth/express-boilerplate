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
  },

  // 7牛的access信息，用于文件上传
  qn_access: {
    accessKey: 'NQ1tWOMSVhiydo3JRsb4Pu6Jd1Yv0jRN6NFoW',
    secretKey: 'TMVRn7mXmhtLj385pD5oKJpiMyR61BrUTuKSY',
    bucket: 'cartrae',
    domain: 'http://api.rolandlau.net'
  }
}
