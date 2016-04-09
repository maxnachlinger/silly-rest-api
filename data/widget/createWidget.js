'use strict'
const _ = require('lodash')
const async = require('async')
const db = require('../db')

const getNewId = (conn, cb) => {
  return conn.sequences.get('widget-id', (err, id) => {
    if (err) { return cb(err) }

    return conn.sequences.put('widget-id', ++id, (err) => cb(err, id))
  })
}

const createWidget = (conn, id, widget, cb) => {
  id = id.toString()

  return async.parallel([
    pCb => conn.widgetSummaries.put(id.toString(), JSON.stringify(_.omit(widget, 'description')), pCb),
    pCb => conn.widgets.put(widget.id, JSON.stringify(widget), pCb)
  ], cb)
}

module.exports = (widget, cb) => {
  return db.acquire((err, conn) => {
    if (err) { return cb(err) }

    return async.waterfall([
      wCb => getNewId(conn, wCb),
      (id, wCb) => createWidget(conn, id, widget, wCb)
    ], (err) => {
      db.release(conn)
      if (err) { return cb(err) }

      return cb(null, { id: widget.id })
    })
  })
}
