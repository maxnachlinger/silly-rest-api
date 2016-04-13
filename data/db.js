'use strict'
const multilevel = require('multilevel')
const net = require('net')
const level = require('level')
const Pool = require('generic-pool').Pool
const config = require('../config')

let server = {}
let db = {}
let pool = {}

function setupPool () {
  pool = new Pool({
    name: 'multilevel-pool',
    create: (callback) => {
      const client = multilevel.client()
      var connection = net.connect(config.db.port)
      connection.pipe(client.createRpcStream()).pipe(connection)
      return callback(null, client)
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
  db = level(config.db.path)

  server = net.createServer((connection) =>
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
module.exports.stop = (cb) => pool.drain(
  () => pool.destroyAllNow(
    () => server.close(cb)
  )
)
