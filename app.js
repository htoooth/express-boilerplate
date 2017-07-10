var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('winston');

var pkg = require('./package.json');
var config = require('./config/common');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

try {
  require('./router')(app);
} catch(e) {
  logger.error(e);
}

app.listen(config.port, () => {
  logger.info(`${pkg.name} start at ${config.port}`);
});
