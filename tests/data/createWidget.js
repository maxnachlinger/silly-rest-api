'use strict'
const testDb = require('../testDb')
const test = require('tape')
const createWidget = require('../../data/createWidget')

test('Setup Db', (t) => testDb.setup(t.end))

test('Creates a widget', (t) => {
  const testWidget = {
    name: 'test-widget name',
    description: 'test-widget description',
    metadata: {
      created: new Date(),
      updated: new Date()
    }
  }

  createWidget(testWidget, (err, id) => {
    t.notOk(err)
    t.ok(id)
    t.end()
  })
})

test('Shutdown Db', (t) => testDb.tearDown(t.end))
