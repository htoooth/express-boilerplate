const multer = require('multer')
const qiniuStorage = require('./storage/qiniu.storage')

// https://github.com/expressjs/multer

let instance = null

module.exports.getInstance = options => {
  if (!instance) {
    instance = multer(options)
  }

  return instance
}

module.exports.create = options => {
  return multer(options)
}

module.exports.qiniuStorage = qiniuStorage
