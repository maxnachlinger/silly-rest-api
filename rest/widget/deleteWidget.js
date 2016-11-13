'use strict'
const db = require('../helpers/db')

module.exports = (req, res, next) => {
  const id = req.params.id

  return db.acquire().then((conn) => {
    return conn.del(id, (err) => {
      db.release(conn)
      if (err) { return next(err) }
      return res.status(200).send({ id })
    })
  }).catch((err) => next(err))
}
