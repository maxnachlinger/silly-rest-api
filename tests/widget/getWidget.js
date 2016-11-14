'use strict'
const testDb = require('../testDb')
const test = require('tape')
const testHelper = require('../testHelper')
const createWidget = require('./createWidget')
const getWidget = require('../../rest/widget/getWidget')

test('Setup Db', (t) => testDb.setup(t.end))

const call = module.exports = (id, cb) => getWidget({ params: { id } }, testHelper.mockRes(cb), (err) => cb(err))

test('Gets a widget', (t) => {
  const widget = {
    name: 'test-created-widget name',
    description: 'test-created-widget description',
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  }

  return createWidget(widget, (err, results) => {
    t.notOk(err)
    t.ok(results)
    t.equal(results.status, 201)

    const id = results.payload.id
    t.ok(id)
    widget.id = id

    call(id, (err, results) => {
      t.notOk(err)
      t.ok(results)
      t.equal(results.status, 200)
      t.ok(results.payload)
      t.deepEqual(results.payload, widget)

      t.end()
    })
  })
})

test('Shutdown Db', (t) => testDb.tearDown(t.end))
