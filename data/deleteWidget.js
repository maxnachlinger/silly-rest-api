'use strict'
const db = require('./db')

module.exports = (id, cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  return conn.del(id, (err) => {
    db.release(conn)
    return cb(err)
  })
})
