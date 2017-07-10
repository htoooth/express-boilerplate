
var express = require('express');
var router = require('./router');

var app = express();

app.use(router);

module.exports = app;