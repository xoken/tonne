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
      target: 'https://3.238.95.71:9091',
      secure: false,
    })
  );
};
