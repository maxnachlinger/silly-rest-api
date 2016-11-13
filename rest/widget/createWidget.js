'use strict'
const uuid = require('node-uuid')
const db = require('../helpers/db')

module.exports = (req, res, next) => {
  const widget = Object.assign({ id: uuid.v4() }, req.body)

  return db.acquire().then((conn) => {
    return conn.put(widget.id, JSON.stringify(widget), (err) => {
      db.release(conn)
      if (err) { return next(err) }
      return res.status(201).send({ id: widget.id })
    })
  }).catch((err) => next(err))
}
