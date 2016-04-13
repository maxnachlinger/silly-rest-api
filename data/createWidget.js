'use strict'
const uuid = require('node-uuid')
const db = require('./db')

module.exports = (widget, cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  widget = Object.assign({id: uuid.v4()}, widget)

  return conn.put(widget.id, JSON.stringify(widget), (err) => {
    db.release(conn)
    cb(err, { id: widget.id })
  })
})
