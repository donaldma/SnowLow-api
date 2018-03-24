import dynamodbClient from '../aws/DynamodbClient'
import { failure } from '../aws/DynamodbResponse'
import * as uuid from 'uuid'
import { Currency } from '../models/Search'

export default {

  addPcPrice: async function(price: string, table: string, event: any, callback: any) {
    const params = {
      TableName: table,
      Item: {
        id: uuid.v4(),
        price: price,
        currency: Currency.CAD,
        createdAt: new Date().toISOString()
      }
    }
    try {
      await dynamodbClient.call('put', params)
    } catch (e) {
      callback(null, failure({ status: false }))
    }
  }

}