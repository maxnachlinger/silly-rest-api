'use strict'
const path = require('path')

module.exports = {
  api: {
    port: 8000
  },
  db: {
    port: 3000,
    path: path.join(__dirname, '/data/widget-db')
  }
}
