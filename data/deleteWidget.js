'use strict'
const db = require('./db')

module.exports = (id, callback) => db.acquire((err, conn) => {
  if (err) { return callback(err) }

  return conn.del(id, (err) => {
    db.release(conn)
    return callback(err)
  })
})
