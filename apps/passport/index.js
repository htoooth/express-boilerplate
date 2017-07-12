var express = require('express');
var router = require('./router');
var nunjucks = require('nunjucks');
var path = require('path');

var app = express();

app.on('mount', function(parent) {
    delete parent.locals.settings; // 不继承父 App 的设置
    Object.assign(app.locals, parent.locals);
});

var coreViewDir = path.join(__dirname, '../../core/views');

var env = nunjucks.configure([
  __dirname + '/views/actions',
  __dirname + '/views/partials',
  __dirname + '/views/macros',
  coreViewDir
], {
  autoescape: true,
  express: app
});

Object.entries(require('./views/filters')).forEach(([k, v])=> {
  env.addFilter(k, v);
});

app.use(router);

module.exports = app