'use strict'
const rimraf = require('rimraf')
const async = require('async')
const uuid = require('node-uuid')
const db = require('../data/db')
const config = require('../config')

function fill (conn, callback) {
  const widgets = Array.from(new Array(1000), (x, idx) => idx)
    .map((i) => {
      return {
        id: uuid.v4(),
        name: 'Test Widget: ' + i,
        description: 'Test Widget: ' + i + ' Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ' +
        'do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
        'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ' +
        'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat ' +
        'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        metadata: {
          created: new Date(),
          updated: new Date()
        }
      }
    })

  return conn.batch(widgets.map((w) => {
    return { type: 'put', key: w.id, value: JSON.stringify(w) }
  }), (err) => {
    db.release(conn)
    return callback(err)
  })
}

async.waterfall([
  (wCallback) => rimraf(config.db.path + '/**', wCallback),
  (wCallback) => db.start(wCallback),
  (wCallback) => db.acquire(wCallback),
  (connection, wCallback) => fill(connection, wCallback)
], (err) => {
  db.stop()
  if (err) {
    console.error('Could not acquire connection from pool', err.stack || err)
    return process.exit(1)
  }

  return process.exit(0)
})
