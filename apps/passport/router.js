
var router = require('express').Router();
var passport = require('./controllers/passport');

router.get(['/', '/index.html'], passport.index);

module.exports = router;