'use strict'

module.exports.mockRes = (callback) => {
  return {
    status: (status) => {
      return {
        send: (payload) => {
          return callback(null, {status, payload})
        }
      }
    }
  }
}
