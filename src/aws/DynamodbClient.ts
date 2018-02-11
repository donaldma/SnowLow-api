import dynamodb from '../config/database'

export class DynamodbClient {

  call(action, params) {
    return dynamodb[action](params).promise()
  }

}

const dynamodbClient = new DynamodbClient()

export default dynamodbClient
