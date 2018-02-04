'use strict'

import dynamodb from '../../config/database'

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE!,
    Key: {
      id: event.pathParameters.id
    }
  }

  dynamodb.get(params, (error, result) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.'
      })
      return
    }

    // create a response
    const response = {
      body: JSON.stringify(result.Item)
    }
    callback(null, response)
  })
}