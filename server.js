'use strict'
const app = require('express')()
const bodyParser = require('body-parser')
const config = require('./config')
const widgetRoutes = require('./widget')

app.use(bodyParser.json())

app.use((err, req, res, next) => {
  console.error(err.stack || err)
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send()
})

app.use('/widget', widgetRoutes)

module.exports.start = (cb) => app.listen(config.api.port, cb)
