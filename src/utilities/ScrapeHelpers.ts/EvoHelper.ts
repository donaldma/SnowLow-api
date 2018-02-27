import PriceHelper from '../../utilities/PriceHelper'
import { failure } from '../../aws/DynamodbResponse'

const cheerio = require('cheerio')
const request = require('request-promise')

export default {

  evoScrape: async function(searchTerm: string, genderPath: string, table: string, event: any, callback: any): Promise<any> {
    const results = [] as object[]

    const searchTermSplit = searchTerm.toLowerCase().split('-')

    const evoSearchCategory = searchTermSplit[0]
    let evoSearchKeyword
    if(searchTermSplit[3]) {
      evoSearchKeyword = `${searchTermSplit[1]}-${searchTermSplit[2]}-${searchTermSplit[3]}`
    } else if(searchTermSplit[2]) {
      evoSearchKeyword = `${searchTermSplit[1]}-${searchTermSplit[2]}`
    } else {
      evoSearchKeyword = searchTermSplit[1]
    }

    const evoSearchUrl = `https://www.evo.com/shop/sale/${evoSearchCategory}/${evoSearchKeyword}${genderPath}/s_average-rating-desc/rpp_200`

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
          results[index]['itemUrl'] = 'https://www.evo.com' + itemUrl
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