import dynamodb from '../config/database'
import * as createError from 'http-errors'
import { ICreateUserParams } from '../models/User'

export default {

  create: async function(createRequest: ICreateUserParams, callback: any) {
    dynamodb.put(createRequest, (error) => {
      if (error) {
        console.error(error)
        callback(null, {
          statusCode: error.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create user.'
        })
        return
      }

      const response = {
        body: JSON.stringify('User succesfully created.')
      }
      callback(null, response)
    })
  },

  findAllUsers: async function(params: any) {
    const dynamodbPromise = await dynamodb.scan(params, (error, result) => {
      if (error) {
        throw createError(error.statusCode || 501, 'Error in fetching users')
      }
      
      return JSON.stringify(result.Items)
    }).promise()

    return dynamodbPromise.Items
  },

  findById: async function(params: any, callback: any) {
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

}
