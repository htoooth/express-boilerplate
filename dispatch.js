module.exports = (app) => {
  app.use('/passport', require('./app/passport'));
}