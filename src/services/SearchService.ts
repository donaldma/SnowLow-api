import SearchRepository from '../repositories/SearchRepository'
import * as moment from 'moment'
import { success } from '../aws/DynamodbResponse'
import EvoHelper from '../utilities/ScrapeHelpers.ts/EvoHelper'
import { IDatabaseResults } from '../models/Search'


export default {

  scrapeBySearchTerm: async function(pathParams: any, table: string, event: any, callback: any) {
    const genderPath = event.queryStringParameters.gender ? `/${event.queryStringParameters.gender}` : ''
    const searchTermSplit = pathParams.searchTerm.toLowerCase().split('-')
    const evoSearchCategory = searchTermSplit[0]
    const evoSearchKeyword = searchTermSplit[1]

    const resultsFromDb: IDatabaseResults[] = []
    const resultsFromScrape = [] as object[]

    /**
     * If search term is already in database, and createdAt is not more than 1 days
     * return all the items that match
     */

    const searches = await SearchRepository.findAll(table, event, callback, true)
    for(const search of searches) {
      if(search.searchTerm === pathParams.searchTerm && moment().diff(moment(search.createdAt), 'days') <= 1) {
        resultsFromDb.push(search)
      }
    }

    if(resultsFromDb.length > 0) {
      callback(null, success({ status: 200, fromDb: true, results: resultsFromDb }))
      return
    }

    // First scrape target: https://www.evo.com/shop/sale/{category}/{item}/{gender}/s_average-rating-desc/rpp_200
    const evoSearchUrl = `https://www.evo.com/shop/sale/${evoSearchCategory}/${evoSearchKeyword}${genderPath}/s_average-rating-desc/rpp_200`
    const evoResults = await EvoHelper.evoScrape(evoSearchCategory, evoSearchKeyword, evoSearchUrl, pathParams.searchTerm, table, event, callback)
    resultsFromScrape.push(...evoResults)

    await SearchRepository.addSearchResults(resultsFromScrape, table, event, callback)
    callback(null, success({ status: 200, fromDb: false, results: resultsFromScrape }))
  }

}
