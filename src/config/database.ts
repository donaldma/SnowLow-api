'use strict'

import { DynamoDB } from 'aws-sdk'

let options = {}

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const dynamodb = new DynamoDB.DocumentClient(options)

export default dynamodb