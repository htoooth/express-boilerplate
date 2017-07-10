
module.exports = (app) => {
  app.use('/cart', require('./apps/cart'));
  app.use('/passport', require('./apps/passport'));
}