'use strict'
const multilevel = require('multilevel')
const net = require('net')
const level = require('level')
const genericPool = require('generic-pool')
const config = require('../../config')

let server = {}
let db = {}
let pool = {}

function setupPool () {
  const factory = {
    create: () => {
      return new Promise((resolve) => {
        const client = multilevel.client()
        const connection = net.connect(config.db.port)
        connection.pipe(client.createRpcStream()).pipe(connection)
        resolve(client)
      })
    },
    destroy: (client) => {
      return new Promise((resolve) => {
        client.close()
        resolve()
      })
    }
  }

  const opts = {
    max: 10, // maximum size of the pool
    min: 2 // minimum size of the pool
  }

  pool = genericPool.createPool(factory, opts)

  module.exports.acquire = pool.acquire.bind(pool)
  module.exports.release = pool.release.bind(pool)
}

module.exports.start = (callback) => {
  db = level(config.db.path)

  server = net.createServer((connection) =>
    connection.pipe(multilevel.server(db)).pipe(connection)
  )

  server.listen(config.db.port, (err) => {
    if (err) { return callback(err) }
    setupPool()
    callback()
  })
}

// for tests
module.exports.stop = (callback) => {
  pool.drain()
    .then(() => pool.clear())
    .then(() => server.close(() => db.close(callback)))
}
