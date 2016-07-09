'use strict'
const app = require('express')()
const bodyParser = require('body-parser')
const expressLogger = require('express-bunyan-logger')
const config = require('./../config')
const widgetRoutes = require('./widgetRoutes')
const logger = require('./helpers/logger')

app.use(expressLogger({logger: logger}))
app.use(expressLogger.errorLogger({logger: logger}))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
  console.error(err.stack || err)
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send()
})

app.use(widgetRoutes)

module.exports.start = (cb) => app.listen(config.api.port, cb)
