'use strict'

import * as uuid from 'uuid'
import dynamodb from '../../config/database'

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the todo item.'
    })
    return
  }
  
  const params = {
    TableName: process.env.USER_TABLE!,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  dynamodb.put(params, (error) => {
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.'
      })
      return
    }

    const response = {
      body: JSON.stringify(params.Item)
    }
    callback(null, response)
  })
}