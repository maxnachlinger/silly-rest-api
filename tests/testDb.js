'use strict'
const path = require('path')
const proxyquire = require('proxyquire')

const db = proxyquire('../data/db', {
  '../config': {
    db: {
      port: 3000,
      path: path.join(__dirname, '/.db')
    }
  }
})

module.exports.setup = db.start
module.exports.tearDown = db.stop
