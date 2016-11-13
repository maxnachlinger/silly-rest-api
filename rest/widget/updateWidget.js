'use strict'
const db = require('../helpers/db')

module.exports = (req, res, next) => {
  const widget = req.body
  const id = req.params.id

  return db.acquire().then((conn) => {
    return conn.put(id, JSON.stringify(widget), (err) => {
      db.release(conn)

      if (err) { return next(err) }
      return res.status(200).send({ id: id })
    })
  }).catch((err) => next(err))
}
