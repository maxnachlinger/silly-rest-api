'use strict'
const db = require('./db')

module.exports = (id, cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  return conn.get(id.toString(), (err, result) => {
    db.release(conn)
    if (err) {
      if (err.type === 'NotFoundError') {
        return cb()
      }
      return cb(err)
    }

    return cb(null, result)
  })
})
