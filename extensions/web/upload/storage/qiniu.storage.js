const qiniu = require('qiniu')
const crypto = require('crypto')
const path = require('path')

function getFilename(req, file, cb) {
  crypto.randomBytes(16, function(err, raw) {
    cb(err, err ? undefined : raw.toString('hex'))
  })
}

/**
 * opts:
 * bucket
 * accessKey
 * secretKey
 * domain
 * getFilename not include extname
 */
function QiniuStorage(opts) {
  this.opts = opts
  this.getFilename = opts.getFilename || getFilename
}

QiniuStorage.prototype._getInstance = function _getInstance() {
  const bucket = this.opts.bucket
  const accessKey = this.opts.accessKey
  const secretKey = this.opts.secretKey

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const options = {
    scope: bucket,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize)}'
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)

  const uploadToken = putPolicy.uploadToken(mac)
  const config = new qiniu.conf.Config()

  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()

  const bucketManager = new qiniu.rs.BucketManager(mac, config)

  return {
    upload: (key, file, cb) => {
      putExtra.fname = file.originalname
      return formUploader.putStream(uploadToken, key, file.stream, putExtra, cb)
    },
    del(key, cb) {
      bucketManager.delete(bucket, key, cb)
    }
  }
}

QiniuStorage.prototype._getResourceUrl = function _getResourceUrl(key) {
  return this.opts.domain.endsWith('/')
    ? this.opts.domain + key
    : this.opts.domain + '/' + key
}

QiniuStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  const qiNiuUpload = this._getInstance()

  this.getFilename(req, file, (err, filename) => {
    if (err) return cb(err)

    filename += path.extname(file.originalname)
    qiNiuUpload.upload(filename, file, (respErr, respBody, respInfo) => {
      if (respErr) return cb(respErr)

      if (respInfo.statusCode === 200) {
        cb(null, {
          filename: file.originalname,
          key: filename,
          url: this._getResourceUrl(respBody.key),
          size: respBody.fsize
        })
      } else {
        cb(respBody)
      }
    })
  })
}

QiniuStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  this._getInstance().del(file.key, cb)
}

module.exports = function(opts) {
  return new QiniuStorage(opts)
}
