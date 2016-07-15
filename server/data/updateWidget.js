'use strict'
const db = require('./db')

module.exports = (id, widget, callback) => db.acquire((err, conn) => {
  if (err) { return callback(err) }

  return conn.put(id, JSON.stringify(widget), (err) => {
    db.release(conn)
    return callback(err)
  })
})
