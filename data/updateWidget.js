'use strict'
const db = require('./db')

module.exports = (id, widget, cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  return conn.put(id, JSON.stringify(widget), (err) => {
    db.release(conn)
    return cb(err)
  })
})
