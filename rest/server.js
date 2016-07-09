'use strict'
const app = require('express')()
const bodyParser = require('body-parser')
const expressLogger = require('express-bunyan-logger')
const config = require('./../config')
const widgetRoutes = require('./widgetRoutes')
const logger = require('./helpers/logger')

app.use(expressLogger({logger}))
app.use(expressLogger.errorLogger({logger}))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send()
})

app.use(widgetRoutes)

module.exports.start = (callback) => app.listen(config.api.port, callback)
