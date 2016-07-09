'use strict'
const db = require('./db')

module.exports = (id, callback) => db.acquire((err, conn) => {
  if (err) { return callback(err) }

  return conn.get(id.toString(), (err, result) => {
    db.release(conn)
    if (err) {
      if (err.type === 'NotFoundError') {
        return callback()
      }
      return callback(err)
    }

    return callback(null, JSON.parse(result))
  })
})
