var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('winston');
var nunjucks = require('nunjucks');

var pkg = require('./package.json');
var config = require('./config/common');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

nunjucks.configure('./core/views', {
    autoescape: true,
    express: app
});

try {
  const errHandle = require('./core/middleware/error');
  const context = require('./core/middleware/context');

  app.use(context);
  require('./router')(app);

  app.all('*', errHandle.pageNotFound);
  app.use(errHandle.serverError);
} catch(e) {
  logger.error(e);
}

app.listen(config.port, () => {
  logger.info(`${pkg.name} start at ${config.port}`);
});
