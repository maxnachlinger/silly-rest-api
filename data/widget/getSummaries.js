'use strict'
const db = require('../db')

module.exports = (cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  const valueStream = conn.widgetSummaries.createValueStream()
  valueStream.once('error', () => db.release(conn))
  valueStream.once('end', () => db.release(conn))

  return cb(null, valueStream)
})
