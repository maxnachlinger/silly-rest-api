'use strict'
const async = require('async')
const db = require('../db')

const deleteWidget = (conn, id, cb) => async.parallel([
  pCb => conn.widgetSummaries.del(id, pCb),
  pCb => conn.widgets.del(id, pCb)
], cb)

module.exports = (id, cb) => {
  id = id.toString()

  return db.acquire((err, conn) => {
    if (err) { return cb(err) }

    return deleteWidget(conn, id, (err) => {
      db.release(conn)
      return cb(err)
    })
  })
}
