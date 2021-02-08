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
      target: 'https://sb2.xoken.org:9091',
      secure: false,
    })
  );
};
