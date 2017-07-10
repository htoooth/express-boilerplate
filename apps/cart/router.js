
var router = require('express').Router();
var cart = require('./controllers/cart');

router.get(['/', '/index.html'], cart.index);

module.exports = router;