'use strict'
const stream = require('stream')
const db = require('./db')

const summaryTransform = new stream.Transform({
  transform (chunk, encoding, next) {
    chunk = JSON.parse(chunk)
    next(null, JSON.stringify({
      id: chunk.id,
      name: chunk.name
    }))
  }
})

module.exports = (cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  const valueStream = conn.createValueStream()
  valueStream.once('error', () => db.release(conn))
  valueStream.once('end', () => db.release(conn))

  return cb(null, valueStream.pipe(summaryTransform))
})
