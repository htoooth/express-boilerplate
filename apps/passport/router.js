
var router = require('express').Router();
var passport = require('./controllers/passport');

router.get(['/', '/login.html'], passport.index);
router.post('login', passport.login);
router.get('/logout', passport.logout);

module.exports = router;