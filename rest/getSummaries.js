'use strict'
const getSummaries = require('../data/getSummaries')

module.exports = (req, res, next) => {
  return getSummaries((err, stream) => {
    if (err) { return next(err) }
    stream.once('error', next)

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return stream.pipe(res)
  })
}
