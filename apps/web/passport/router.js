var router = require('express').Router()
var passport = require('./controller/passport')

router.get(['/', '/index.html'], passport.index)

module.exports = router
