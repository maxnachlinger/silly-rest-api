'use strict'
const getSummaries = require('../data/widget/getSummaries')

module.exports = (req, res, next) => {
  return getSummaries((err, stream) => {
    if (err) { return next(err) }

    stream.once('error', next)

    res.setHeader('Content-Type', 'application/json')
    return stream.pipe(res)
  })
}
