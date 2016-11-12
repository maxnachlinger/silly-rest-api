'use strict'
const db = require('./db')

module.exports = (id, widget, callback) => db.acquire().then((conn) => {
  return conn.put(id, JSON.stringify(widget), (err) => {
    db.release(conn)
    return callback(err)
  })
}).catch((err) => callback(err))
