import dynamodb from '../config/database'
import { ICreateUserParams } from '../models/User'

export class DynamodbClient {

  call(action, params) {
    return dynamodb[action](params).promise()
  }

  // TODO: REMOVE THIS
  put(table: string, createRequest: ICreateUserParams, callback: any) {
    const params = {
      TableName: table,
      Item: createRequest
    }

    dynamodb.put(params, (error, result) => {
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
        body: JSON.stringify({ status: 200, message: 'User succesfully created.', id: createRequest.id })
      }
      callback(null, response)
    })
  }

}

const dynamodbClient = new DynamodbClient()

export default dynamodbClient
