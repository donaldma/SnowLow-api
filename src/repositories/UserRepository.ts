import { ICreateUserParams } from '../models/User'
import dynamodbClient from '../aws/DynamodbClient'
import { failure, success } from '../aws/DynamodbResponse'

async function findAll(table: string, event: any, callback: any, promise: boolean) {
  const params = {
    TableName: table
  }
  if(promise) {
    const result = await dynamodbClient.call('scan', params)
    return result.Items
  } 
  
  try {
    const result = await dynamodbClient.call('scan', params)
    if(result.Items.length > 0) {
      callback(null, success(result.Items))
    } else {
      callback(null, success({ status: true, message: 'No users in the database.' }))
    }
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}


export default {

  findAll: findAll,

  create: async function(table, createRequest: ICreateUserParams, callback: any) {
    dynamodbClient.put(table, createRequest, callback)
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

  update: async function(table, event: any, callback: any) {
    const data = JSON.parse(event.body)
    const params = {
      TableName: table,
      Key: {
        id: event.pathParameters.id
      },
      UpdateExpression: 'SET content = :content, attachment = :attachment',
      ExpressionAttributeValues: {
        ':attachment': data.attachment ? data.attachment : null,
        ':content': data.content ? data.content : null,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }
  
    try {
      const result = await dynamodbClient.call('update', params)
      if(result.Attributes) {
        callback(null, success({ status: true }))
      } else {
        callback(null, failure({ status: false}))
      }
    } catch (e) {
      callback(null, failure({ status: false }))
    }
  },

  delete: async function(table, event: any, callback: any) {
    const params = {
      TableName: table,
      Key: {
        id: event.pathParameters.id
      }
    }
  
    try {
      await dynamodbClient.call('delete', params)
      callback(null, success({ status: true, message: `User with id ${event.pathParameters.id} has been deleted.` }))
    } catch (e) {
      callback(null, failure({ status: false }))
    }
  },

  deleteAll: async function(table, event: any, callback: any) {
    const users = await findAll(process.env.USER_TABLE!, event, callback, true)

    for(const user of users) {
      const params = {
        TableName: table,
        Key: {
          id: user.id
        }
      }

      try {
        await dynamodbClient.call('delete', params)
        callback(null, success({ status: true, message: `${users!.length} users deleted` }))
      } catch (e) {
        callback(null, failure({ status: false }))
      }
    }
  }

}
