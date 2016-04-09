'use strict'
const async = require('async')
const multilevel = require('multilevel')
const net = require('net')
const level = require('level')
const levelSubLevel = require('level-sublevel')
const Pool = require('generic-pool').Pool
const config = require('./../config')

const db = levelSubLevel(level(config.db.path))

const pool = new Pool({
  name: 'multilevel-pool',
  create: (callback) => {
    const dbClient = multilevel.client()

    var connection = net.connect(config.db.port)
    connection.pipe(dbClient.createRpcStream()).pipe(connection)

    dbClient.widgets = db.sublevel('widgets')
    dbClient.widgetSummaries = db.sublevel('widget_summaries')
    dbClient.sequences = db.sublevel('widget_sequences')

    return callback(null, dbClient)
  },
  destroy: (client) => {
    client.close()
  },
  min: 2,
  max: 10,
  idleTimeoutMillis: 30 * 1000
})

const stream = net.createServer(connection =>
  connection.pipe(multilevel.server(db)).pipe(connection)
)

module.exports.acquire = pool.acquire.bind(pool)
module.exports.release = pool.release.bind(pool)
module.exports.init = (cb) => stream.listen(config.db.port, cb)

// helper method to cut down on
module.exports.releaseCb = (conn, cb) => (err, result) => {
  exports.release(conn)
  return cb(err, result)
}

// for tests
module.exports.close = (cb) => pool.drain(() => pool.destroyAllNow(cb))
