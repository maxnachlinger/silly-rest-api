'use strict'
const db = require('../db')

module.exports = (id, cb) => {
  id = id.toString()

  return db.acquire((err, conn) => {
    if (err) { return cb(err) }

    return conn.widgets.get(id.toString(), (err, result) => {
      db.release(conn)
      if (err) {
        if (err.type === 'NotFoundError') {
          return cb()
        }
        return cb(err)
      }

      cb(null, result)
    })
  })
}
