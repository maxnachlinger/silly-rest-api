'use strict'
const _ = require('lodash')
const async = require('async')
const db = require('../db')

const createWidget = (conn, widget, cb) => {
  widget = _.cloneDeep(widget)
  widget.id = uuid.v4()

  return async.parallel([
    pCb => conn.widgetSummaries.put(widget.id, JSON.stringify(_.omit(widget, 'description', 'metadata')), pCb),
    pCb => conn.widgets.put(widget.id, JSON.stringify(widget), pCb)
  ], cb)
}

module.exports = (widget, cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  createWidget(conn, id, widget, (err) => {
    db.release(conn)
    if (err) { return cb(err) }

    return cb(null, { id: widget.id })
  })
})
