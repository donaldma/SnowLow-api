'use strict'

import dynamodb from '../../config/database'

module.exports.getAll = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE!
  }

  dynamodb.scan(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.'
      })
      return
    }

    const response = {
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}