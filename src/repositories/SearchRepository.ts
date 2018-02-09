// import * as uuid from 'uuid'
// import dynamodbClient from '../aws/DynamodbClient'
// import { failure, success } from '../aws/DynamodbResponse'
const cheerio = require('cheerio')

export default {

  evoScrape: async function(category: string, keyword: string, evoSearchUrl: string, searchTerm: string, table: string, event: any, callback: any) {
    const $ = cheerio.load(evoSearchUrl)
    // let snowboards = []
    $('.product-thumb-details').each((index, element) => {
      console.log('1',element)
      // companiesList[index] = {}
      // var header = $(element).find('.header')
      // companiesList[index]['name'] = $(header).find('[itemprop=name]').text()
      // companiesList[index]['description'] = $(header).find('[rel=description]').text()
      // companiesList[index]['url'] = $(header).find('.header [itemprop=name] a').getAttribute('href')
      // var contact = $(element).find('.contact')
      // companiesList[index]['contact'] = {}
      // companiesList[index]['contact']['telephone'] = $(contact).find('[itemprop=telephone]').text()
      // companiesList[index]['contact']['employee'] = {}
      // companiesList[index]['contact']['employee']['name'] = $(contact).find('[itemprop=employeeName]').text()
      // companiesList[index]['contact']['employee']['jobTitle'] = $(contact).find('[itemprop=employeeJobTitle]').text()
      // companiesList[index]['contact']['employee']['email'] = $(contact).find('[itemprop=email]').text()
    })

    // console.log(snowboards)
    // const params = {
    //   TableName: table,
    //   Item: {
    //     id: uuid.v4(),
    //     userId: event.requestContext.identity.cognitoIdentityId,
    //     searchTerm: searchTerm,
    //     imageUrl: searchTerm,
    //     name: searchTerm,
    //     price: searchTerm,
    //     currency: searchTerm,
    //     itemUrl: searchTerm,
    //     createdAt: new Date().toISOString()
    //   }
    // }
  
    // try {
    //   await dynamodbClient.call('put', params)
    //   callback(null, success(params.Item))
    // } catch (e) {
    //   callback(null, failure({ status: false }))
    // }
  }

}
