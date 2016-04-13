'use strict'
const getWidget = require('../data/getWidget')

module.exports = (req, res, next) => {
  const widgetId = req.params.id

  return getWidget(widgetId, (err, widget) => {
    if (err) { return next(err) }
    if (!widget) { return res.status(404).send() }

    return res.status(200).send(widget)
  })
}
