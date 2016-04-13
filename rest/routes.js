'use strict'
const express = require('express')
const Joi = require('joi')
const validator = require('./middleware/validator')
const router = express.Router()

const idRequired = {
  params: {
    id: Joi.string().required()
  }
}
const nameDescriptionRequired = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required()
  }
}

router.get(
  '/widget/summary',
  require('./getSummaries')
)

router.get(
  '/widget/:id',
  validator(idRequired),
  require('./getWidget')
)

router.post(
  '/widget',
  validator(nameDescriptionRequired),
  require('./createWidget')
)

router.delete(
  '/widget/:id',
  validator(idRequired),
  require('./deleteWidget')
)

router.put(
  '/widget/:id',
  validator(Object.assign(idRequired, nameDescriptionRequired)),
  require('./updateWidget')
)

module.exports = router
