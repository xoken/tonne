const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    ['/api'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      secure: false,
    })
  );
  app.use(
    ['/v1'],
    createProxyMiddleware({
      target: 'https://65.108.78.154:9091',
      secure: false,
    })
  );
};
