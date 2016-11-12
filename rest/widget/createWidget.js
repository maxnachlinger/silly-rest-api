'use strict'
const createWidget = require('../../data/createWidget')

module.exports = (req, res, next) => {
  const widget = req.body

  return createWidget(widget, (err, result) => {
    if (err) { return next(err) }
    return res.status(201).send(result)
  })
}
