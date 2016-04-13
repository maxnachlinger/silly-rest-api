'use strict'
const updateWidget = require('../data/updateWidget')

module.exports = (req, res, next) => {
  const widget = req.body
  const id = req.params.id

  return updateWidget(id, widget, (err) => {
    if (err) { return next(err) }
    return res.status(200).send({ id: id })
  })
}
