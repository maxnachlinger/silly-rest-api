'use strict'
const _ = require('lodash')
const async = require('async')
const db = require('../db')

module.exports = (id, widget, cb) => {
  id = id.toString()

  return db.acquire((err, conn) => {
    if (err) { return cb(err) }

    return async.series([
      sCb => async.parallel([
        pCb => conn.widgetSummaries.put(id, JSON.stringify(_.omit(widget, 'description')), pCb),
        pCb => conn.widgets.put(id, JSON.stringify(widget), pCb)
      ], sCb)
    ], (err) => {
      db.release(conn)
      return cb(err)
    })
  })
}
