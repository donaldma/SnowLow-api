import dynamodb from '../config/database'
import * as createError from 'http-errors'
import { ICreateUserParams } from '../models/User'
import dynamodbClient from '../aws/DynamodbClient'

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

  findById: function(table: string, id: string, callback: any) {
    dynamodbClient.get(table, id, callback)
  }

}
