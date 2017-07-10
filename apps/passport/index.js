var router = require('./router');
var express = require('express');

app = express();

app.on('mount', function(parent) {
    delete parent.locals.settings; // 不继承父 App 的设置
    Object.assign(app.locals, parent.locals);
});

app.use(router);

module.exports = app;