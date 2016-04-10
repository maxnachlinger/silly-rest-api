'use strict'
const async = require('async')
const multilevel = require('multilevel')
const net = require('net')
const level = require('level')
const levelSubLevel = require('level-sublevel')
const Pool = require('generic-pool').Pool
const config = require('../config')

let server = {}
let db = {}
let pool = {}

function setupPool () {
  pool = new Pool({
    name: 'multilevel-pool',
    create: (callback) => {
      const dbClient = multilevel.client()

      var connection = net.connect(config.db.port)
      connection.pipe(dbClient.createRpcStream()).pipe(connection)

      dbClient.widgets = db.sublevel('widgets')
      dbClient.widgetSummaries = db.sublevel('widget_summaries')

      return callback(null, dbClient)
    },
    destroy: (client) => client.close(),
    min: 2,
    max: 10,
    idleTimeoutMillis: 30 * 1000
  })

  module.exports.acquire = pool.acquire.bind(pool)
  module.exports.release = pool.release.bind(pool)
}

module.exports.start = (cb) => {
  db = levelSubLevel(level(config.db.path))

  server = net.createServer(connection =>
    connection.pipe(multilevel.server(db)).pipe(connection)
  )

  server.listen(config.db.port, (err) => {
    if (err) { return cb(err) }
    setupPool()
    console.log('db listening on port:', config.db.port)
    cb()
  })
}

// for tests
module.exports.close = (cb) => pool.drain(
    () => pool.destroyAllNow(
      () => server.close(cb)
    )
)
