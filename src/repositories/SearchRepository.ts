import dynamodbClient from '../aws/DynamodbClient'
import { failure, success } from '../aws/DynamodbResponse'
import * as uuid from 'uuid'
import { Currency } from '../models/Search'
import PriceHelper from '../utilities/PriceHelper'


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
      callback(null, success({ results: result.Items }))
    } else {
      callback(null, success({ status: true, message: 'No search history in the database.' }))
    }
  } catch (e) {
    callback(null, failure({ status: false }))
  }
}

export default {

  findAll: findAll,

  addSearchResults: async function(results: any, table: string, event: any, callback: any) {

    for(const result of results) {
      const params = {
        TableName: table,
        Item: {
          id: uuid.v4(),
          userId: event.requestContext.identity.cognitoIdentityId && event.requestContext.identity.cognitoIdentityId !== 'offlineContext_cognitoIdentityId' ? event.requestContext.identity.cognitoIdentityId : -1,
          searchTerm: result.searchTerm,
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

  },

  clearData: async function(table: string, event: any, callback: any) {
    const searches = await findAll(table, event, callback, true)

    for(const search of searches) {
      const params = {
        TableName: table,
        Key: {
          id: search.id
        }
      }

      try {
        await dynamodbClient.call('delete', params)
      } catch (e) {
        callback(null, failure({ status: false }))
      }
    }
    callback(null, success({ status: true, message: `${searches!.length} searches deleted` }))
  }

}