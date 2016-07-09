'use strict'
const uuid = require('node-uuid')
const db = require('./db')

module.exports = (widget, callback) => db.acquire((err, conn) => {
  if (err) { return callback(err) }

  widget = Object.assign({id: uuid.v4()}, widget)

  return conn.put(widget.id, JSON.stringify(widget), (err) => {
    db.release(conn)
    return callback(err, { id: widget.id })
  })
})
