'use strict'
const db = require('./db')

module.exports = (id, callback) => db.acquire().then((conn) => {
  return conn.del(id, (err) => {
    db.release(conn)
    return callback(err)
  })
}).catch((err) => callback(err))
