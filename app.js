'use strict'
const async = require('async')
const server = require('./rest/server')
const config = require('./config')
const db = require('./data/db')
const logger = require('./rest/helpers/logger')

function start() {
  async.parallel([
    server.start,
    db.start
  ], (err) => {
    if (err) {
      logger.error({ err })
      process.exit(1)
    }
    logger.info(`Server listening on port: ${config.api.port}`)
  })
}
start();

process.on('uncaughtException', (err) => {
  console.error(err.stack)
  process.exit(1)
})
