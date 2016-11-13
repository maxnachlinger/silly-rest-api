'use strict'
const stream = require('stream')
const db = require('../helpers/db')

const summaryTransform = () => new stream.Transform({
  transform (chunk, encoding, next) {
    chunk = JSON.parse(chunk)
    next(null, JSON.stringify({
      id: chunk.id,
      name: chunk.name
    }))
  }
})

module.exports = (req, res, next) => {
  return db.acquire().then((conn) => {
    const valueStream = conn.createValueStream()

    let error = false
    valueStream.once('error', (err) => {
      error = true
      db.release(conn)
      return next(err)
    })
    valueStream.once('end', () => db.release(conn))

    if (!error) {
      return valueStream.pipe(summaryTransform()).pipe(res)
    }
  }).catch((err) => next(err))
}
