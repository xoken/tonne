
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./nipkow-sdk.cjs.production.min.js')
} else {
  module.exports = require('./nipkow-sdk.cjs.development.js')
}
