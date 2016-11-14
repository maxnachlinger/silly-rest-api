'use strict'
const db = require('../helpers/db')

module.exports = (req, res, next) => {
  const id = req.params.id.toString()

  return db.acquire().then((conn) => {
    return conn.get(id, (err, result) => {
      db.release(conn)
      if (err) {
        if (err.type === 'NotFoundError') {
          return res.status(404).send()
        }
        return next(err)
      }

      return res.status(200).send(JSON.parse(result))
    })
  }).catch((err) => next(err))
}
