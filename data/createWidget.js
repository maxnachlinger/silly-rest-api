'use strict'
const uuid = require('node-uuid')
const db = require('./db')

module.exports = (widget, callback) => db.acquire().then((conn) => {
  widget = Object.assign({id: uuid.v4()}, widget)

  return conn.put(widget.id, JSON.stringify(widget), (err) => {
    db.release(conn)
    return callback(err, { id: widget.id })
  })
}).catch((err) => callback(err))
