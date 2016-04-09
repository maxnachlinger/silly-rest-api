'use strict'
const updateWidget = require('../data/widget/updateWidget')

module.exports = (req, res, next) => {
  const widget = req.body
  const id = req.params.id

  return updateWidget(id, widget, (err, result) => {
    if (err) { return next(err) }
    return res.status(200).send({ id: id })
  })
}
