'use strict'
const async = require('async')
const server = require('./server')
const config = require('./config')
const db = require('./data/db')

async.parallel([
  server.start,
  db.start
], (err) => {
  if (err) {
    console.error(err.stack || err)
    process.exit(1)
  }
  console.log('Server listening on port: ', config.api.port)
})
