'use strict'
const testDb = require('../testDb')
const test = require('tape')
const testHelper = require('../testHelper')
const createWidget = require('../../rest/widget/createWidget')

test('Setup Db', (t) => testDb.setup(t.end))

const call = module.exports = (cb) => {
  return createWidget({body: {
    name: 'test-widget name',
    description: 'test-widget description',
    metadata: {
      created: new Date(),
      updated: new Date()
    }
  }}, testHelper.mockRes(cb), (err) => cb(err))
}

test('Creates a widget', (t) => {
  return call((err, results) => {
    t.notOk(err)
    t.ok(results)
    t.equal(results.status, 201)
    t.ok(results.payload.id)
    t.end()
  })
})

test('Shutdown Db', (t) => testDb.tearDown(t.end))
