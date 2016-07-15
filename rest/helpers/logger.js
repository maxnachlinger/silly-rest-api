'use strict'
const bunyan = require('bunyan')

module.exports = bunyan.createLogger({
  name: 'silly-rest-api',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'warn',
      stream: process.stderr
    }
  ]
})
