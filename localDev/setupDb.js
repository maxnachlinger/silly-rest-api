'use strict'
const rimraf = require('rimraf')
const async = require('async')
const uuid = require('node-uuid')
const db = require('../data/db')
const config = require('../config')

function fill (conn, cb) {
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

  conn.batch(widgets.map((w, idx) => {
    return { type: 'put', key: idx, value: JSON.stringify(w) }
  }), (err) => {
    db.release(conn)
    cb(err)
  })
}

async.waterfall([
  (cb) => rimraf(config.db.path + '/**', cb),
  (cb) => db.start(cb),
  (cb) => db.acquire(cb),
  (connection, cb) => fill(connection, cb)
], (err) => {
  db.close()
  if (err) {
    console.error('Could not acquire connection from pool', err.stack || err)
    return process.exit(1)
  }

  return process.exit(0)
})
