'use strict'
const testDb = require('../testDb')
const test = require('tape')
const createWidget = require('../../data/createWidget')
const deleteWidget = require('../../data/deleteWidget')

const testWidget = {
  name: 'test-widget name',
  description: 'test-widget description',
  metadata: {
    created: new Date(),
    updated: new Date()
  }
}

test('Setup Db, creates a widget', (t) => testDb.setup(() => createWidget(testWidget, (err, id) => {
  testWidget.id = id;
  t.end()
})))

test('Deletes a widget', (t) => {
  deleteWidget(testWidget.id, (err) => {
    t.notOk(err)
    t.end()
  })
})

test('Shutdown Db', (t) => testDb.tearDown(t.end))
