'use strict'
const app = require('express')()
const bodyParser = require('body-parser')
const expressLogger = require('express-bunyan-logger')
const helmet = require('helmet')
const compression = require('compression')  // for larger APIs do this via Nginx
const session = require('express-session')
const LevelStore = require('level-session-store')(session)
const config = require('../config')
const widgetRoutes = require('./widgetRoutes')
const logger = require('./helpers/logger')
const env = (process.env.NODE_ENV || 'development').toLowerCase();

app.use(expressLogger({logger}))
app.use(expressLogger.errorLogger({logger}))
app.use(bodyParser.json())
app.use(helmet())
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: env !== 'development' },
  store: new LevelStore() // for larger, distributed APIs use redis or something else instead
}))
app.use(compression()) // for larger APIs gzip via Nginx

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  logger.error({err})
  res.status(500).send()
})

app.use(widgetRoutes)

module.exports.start = (callback) => {
  app.listen(config.api.port, callback)
}
