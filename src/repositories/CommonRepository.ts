import dynamodbClient from '../aws/DynamodbClient'
import { failure, success } from '../aws/DynamodbResponse'

async function findAll(table: string, event: any, callback: any, promise: boolean) {
  const params = {
    TableName: table
  }
  if(promise) {
    try {
      const result = await dynamodbClient.call('scan', params)
      return result.Items
    } catch (e) {
      console.log('error',e)
      callback(null, failure({ status: false }))
    }
  }

  try {
    const result = await dynamodbClient.call('scan', params)
    if(result.Items.length > 0) {
      callback(null, success({ results: result.Items }))
    } else {
      callback(null, success({ status: true, message: 'No records in the database.' }))
    }
  } catch (e) {
    console.log('error',e)
    callback(null, failure({ status: false }))
  }
}

export default {

  findAll: findAll,

  clearData: async function(table: string, event: any, callback: any) {
    const records = await findAll(table, event, callback, true)

    for(const record of records) {
      const params = {
        TableName: table,
        Key: {
          id: record.id
        }
      }

      try {
        await dynamodbClient.call('delete', params)
      } catch (e) {
        callback(null, failure({ status: false }))
      }
    }
    callback(null, success({ status: true, message: `${records!.length} prices deleted` }))
  }

}