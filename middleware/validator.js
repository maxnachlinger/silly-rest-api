'use strict'
const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')

module.exports = (schema, options) => {
  const keys = Object.keys(schema)

  options = options || { convert: true, allowUnknown: true, abortEarly: false }

  return (req, res, next) => Joi.validate(
    _.pick(req, keys),
    schema,
    options,
    (err, result) => {
      if (err) {
        // give helpful errors in dev mode
        if (process.env.NODE_ENV === 'production') {
          return next(Boom.badRequest())
        }

        return next(Boom.badRequest(err.message, err))
      }

      // write back converted values
      keys.forEach((key) => {
        if (result[ key ] && req[ key ]) {
          req[ key ] = result[ key ]
        }
      })

      return next()
    })
}
