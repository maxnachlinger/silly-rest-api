'use strict'
const _ = require('lodash')
const async = require('async')
const db = require('./../data/db')

function fill (conn, cb) {
  const widgets = Array.from(new Array(1000), (x, idx) => idx)
    .map(i => {
      return {
        id: i,
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

  const addSummaries = sCb => conn.widgetSummaries.batch(widgets.map((w, idx) => {
    return { type: 'put', key: idx, value: JSON.stringify(_.omit(w, 'description')) }
  }), sCb)

  const addWidgets = sCb => conn.widgets.batch(widgets.map((w, idx) => {
    return { type: 'put', key: idx, value: JSON.stringify(w) }
  }), sCb)

  const addIdSequence = sCb => conn.sequences.put('widget-id', widgets.length - 1, sCb)

  return async.series([
    addSummaries,
    addWidgets,
    addIdSequence
  ], err => {
    db.release(conn)
    cb()
  })
}

async.waterfall([
  (cb) => db.init(cb),
  (cb) => db.acquire(cb),
  (connection, cb) => fill(connection, cb)
], err => {
  db.close()
  if (err) {
    console.error('Could not acquire connection from pool', err.stack || err)
    return process.exit(1)
  }

  return process.exit(0)
})
