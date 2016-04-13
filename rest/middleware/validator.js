'use strict'
const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')

const handleError = (err, next) => {
  if (process.env.NODE_ENV === 'production') {
    return next(Boom.badRequest())
  }
  return next(Boom.badRequest(err.message, err))
}

module.exports = (schema, options) => {
  options = options || { convert: true, allowUnknown: true, abortEarly: false }
  const keys = Object.keys(schema)

  return (req, res, next) => {
    return Joi.validate(
      _.pick(req, keys),
      schema,
      options,
      (err, result) => {
        if (err) { return handleError(err, next) }

        // write back converted values
        if (options.convert) {
          _.merge(req, result)
        }

        return next()
      })
  }
}
