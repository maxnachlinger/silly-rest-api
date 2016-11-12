'use strict'
const deleteWidget = require('../../data/deleteWidget')

module.exports = (req, res, next) => {
  const widgetId = req.params.id

  return deleteWidget(widgetId, (err) => {
    if (err) { return next(err) }
    return res.status(200).send({ id: widgetId })
  })
}
