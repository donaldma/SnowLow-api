'use strict'

import dynamodb from '../../config/database'

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE!,
    Key: {
      id: event.pathParameters.id
    }
  }

  dynamodb.delete(params, (error) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the todo item.'
      })
      return
    }

    const response = {
      body: JSON.stringify({})
    }
    callback(null, response)
  })
}