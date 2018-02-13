import PriceHelper from '../../utilities/PriceHelper'
import { failure } from '../../aws/DynamodbResponse'

const cheerio = require('cheerio')
const request = require('request-promise')

export default {

  evoScrape: async function(category: string, keyword: string, evoSearchUrl: string, searchTerm: string, genderPath: string, table: string, event: any, callback: any): Promise<any> {
    const results = [] as object[]

    await request(evoSearchUrl, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)

        // Handle no results
        if($('.results-header-none').length) {
          return results
        }

        $('span.product-thumb-title').each((index, element) => {
          const products = $(element)
          const name = products.text()
          const itemUrl = products.parent().attr('href')
          const imageUrl = products.parent().parent().prev().children().attr('src')

          const reviews = products.next().attr('class') === 'product-thumb-reviews'
          const priceSlash = products.next().next().attr('class') === 'product-thumb-price slash'
          const priceSlashNoReviews = products.next().attr('class') === 'product-thumb-price slash'

          let price
          if(reviews && priceSlash) {
            price = products.next().next().next().text()
          } else if(reviews || priceSlashNoReviews) {
            price = products.next().next().text()
          } else {
            price = products.next().text()
          }

          results[index] = {}
          results[index]['name'] = name
          results[index]['price'] = PriceHelper.getPriceAsFloatNumber(price)
          results[index]['itemUrl'] = evoSearchUrl + itemUrl
          results[index]['imageUrl'] = imageUrl
          results[index]['searchPath'] = searchTerm + genderPath
        })
      } else {
        callback(null, failure({ status: false, error: 'Error in request connection' }))
      }
    })

    // Only return the top 10 results from evo
    return results.slice(0,10)
  }

}