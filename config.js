'use strict'
const path = require('path')

module.exports = {
  api: {
    port: 8000
  },
  db: {
    port: 3000,
    path: path.join(__dirname, '/.db')
  },
  sessionSecret: '814e276b-52c7-47c5-9644-a1c411672978'
}
