import dynamodb from '../config/database'
import { ICreateUserParams } from '../models/User'

export class DynamodbClient {

  get(table: string, id: string, callback: any) {
    const params = {
      TableName: table,
      Key: {
        id: id
      }
    }

    dynamodb.get(params, (error, result) => {
      if (error) {
        console.error(error)
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Error in get request.'
        })
        return
      }

      const response = {
        body: JSON.stringify(result.Item)
      }
      callback(null, response)
    })
  }

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
        body: JSON.stringify('User succesfully created.')
      }
      callback(null, response)
    })
  }

  scanPromise(table: string, createRequest: ICreateUserParams, callback: any) {
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
        body: JSON.stringify('User succesfully created.')
      }
      callback(null, response)
    })
  }

}

const dynamodbClient = new DynamodbClient()

export default dynamodbClient
