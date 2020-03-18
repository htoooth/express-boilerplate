const multer = require('multer')

// https://github.com/expressjs/multer

module.exports = options => {
  const upload = multer(options)
  return upload.any()
}
