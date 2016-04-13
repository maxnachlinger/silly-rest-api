'use strict'
const stream = require('stream')
const db = require('./db')

module.exports = (cb) => db.acquire((err, conn) => {
  if (err) { return cb(err) }

  const valueStream = conn.createValueStream()
  valueStream.once('error', () => db.release(conn))
  valueStream.once('end', () => db.release(conn))

  const ret = valueStream.pipe(new stream.Transform({
    transform: function (chunk, encoding, next) {
      chunk = JSON.parse(chunk)

      this.push(JSON.stringify({
        id: chunk.id,
        name: chunk.name
      }))

      next()
    }
  }))

  return cb(null, ret)
})
