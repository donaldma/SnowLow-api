import dynamodb from '../config/database'
import * as createError from 'http-errors'
import { ICreateUserParams } from '../models/User'
import dynamodbClient from '../aws/DynamodbClient'
import { failure, success } from '../aws/DynamodbResponse'

export default {

  create: async function(table, createRequest: ICreateUserParams, callback: any) {
    dynamodbClient.put(table, createRequest, callback)
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

  findById: async function(table: string, event: any, callback: any) {
    const params = {
      TableName: table,
      Key: {
        id: event.pathParameters.id
      }
    }

    try {
      const result = await dynamodbClient.call('get', params)
      if (result.Item) {
        callback(null, success(result.Item))
      } else {
        callback(null, failure({ status: false, error: 'User not found.' }))
      }
    } catch (e) {
      callback(null, failure({ status: false }))
    }
  },

  findAll: async function(table: string, event: any, callback: any) {
    const params = {
      TableName: process.env.USER_TABLE!
    }

    try {
      const result = await dynamodbClient.call('scan', params)
      callback(null, success(result.Items))
    } catch (e) {
      callback(null, failure({ status: false }))
    }
  }

}
