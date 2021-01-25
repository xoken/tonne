const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    ['/v1/auth'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      secure: false,
    })
  );
  app.use(
    ['/v1'],
    createProxyMiddleware({
      target: 'https://localhost:9091',
      secure: false,
    })
  );
};
