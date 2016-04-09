'use strict'
const db = require('../db')

module.exports = (cb) => {
  return db.acquire((err, conn) => {
    if (err) { return cb(err) }

    const valueStream = conn.widgetSummaries.createValueStream()
    valueStream.once('error', () => db.release(conn))
    valueStream.once('end', () => db.release(conn))

    return cb(null, valueStream)
  })
}
