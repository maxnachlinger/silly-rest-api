'use strict'
const stream = require('stream')
const db = require('./db')

const summaryTransform = () => new stream.Transform({
  transform (chunk, encoding, next) {
    chunk = JSON.parse(chunk)
    next(null, JSON.stringify({
      id: chunk.id,
      name: chunk.name
    }))
  }
})

module.exports = (callback) => db.acquire().then((conn) => {
  const valueStream = conn.createValueStream()
  valueStream.once('error', () => db.release(conn))
  valueStream.once('end', () => db.release(conn))

  return callback(null, valueStream.pipe(summaryTransform()))
}).catch((err) => callback(err))
