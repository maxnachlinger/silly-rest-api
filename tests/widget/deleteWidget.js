'use strict'
const testDb = require('../testDb')
const test = require('tape')
const testHelper = require('../testHelper')
const createWidget = require('./createWidget')
const deleteWidget = require('../../rest/widget/deleteWidget')

test('Setup Db', (t) => testDb.setup(t.end))

test('Deletes a widget', (t) => {
  return createWidget((err, results) => {
    t.notOk(err)
    t.ok(results)
    t.equal(results.status, 201)

    const id = results.payload.id
    t.ok(id)

    deleteWidget({params: {id}}, testHelper.mockRes((err, results) => {
      t.notOk(err)
      t.ok(results)
      t.equal(results.status, 200)
      t.ok(results.payload.id)
      t.equal(results.payload.id, id)
      t.end()
    }), (err) => t.end(err))
  })
})

test('Shutdown Db', (t) => testDb.tearDown(t.end))
