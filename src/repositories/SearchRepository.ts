import dynamodbClient from '../aws/DynamodbClient'
import { failure } from '../aws/DynamodbResponse'
import * as uuid from 'uuid'
import { Currency } from '../models/Search'
import PriceHelper from '../utilities/PriceHelper'

export default {

  addSearchResults: async function(results: any, table: string, event: any, callback: any) {
    for(const result of results) {
      const params = {
        TableName: table,
        Item: {
          id: uuid.v4(),
          userId: event.requestContext.identity.cognitoIdentityId && event.requestContext.identity.cognitoIdentityId !== 'offlineContext_cognitoIdentityId' ? event.requestContext.identity.cognitoIdentityId : -1,
          searchPath: result.searchPath,
          name: result.name,
          price: PriceHelper.getPriceAsFloatNumber(result.price.toString()),
          itemUrl: result.itemUrl,
          imageUrl: result.imageUrl,
          currency: Currency.USD,
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

}