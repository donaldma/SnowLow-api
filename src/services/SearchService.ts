import SearchRepository from '../repositories/SearchRepository'
import * as moment from 'moment'
import { success, failure } from '../aws/DynamodbResponse'
import EvoHelper from '../utilities/ScrapeHelpers.ts/EvoHelper'
import { IDatabaseResults } from '../models/Search'
import CommonRepository from '../repositories/CommonRepository'


export default {

  scrapeBySearchTerm: async function(pathParams: any, table: string, event: any, callback: any) {
    const genderPath = event.queryStringParameters && 'gender' in event.queryStringParameters ? `/${event.queryStringParameters.gender}` : ''

    const resultsFromDb: IDatabaseResults[] = []
    const resultsFromScrape = [] as object[]

    /**
     * If search term is already in database, and createdAt is not more than 1 days
     * return all the items that match
     */

    const searches = await CommonRepository.findAll(table, event, callback, true)
    for(const search of searches) {
      if(search.searchPath === pathParams.searchTerm + genderPath && moment().diff(moment(search.createdAt), 'days') <= 1) {
        resultsFromDb.push(search)
      }
    }

    if(resultsFromDb.length > 0) {
      callback(null, success({ status: 200, fromDb: true, results: resultsFromDb }))
      return
    }

    // First scrape target: https://www.evo.com/shop/sale/{category}/{item}/{gender}/s_average-rating-desc/rpp_200
    const evoResults = await EvoHelper.evoScrape(pathParams.searchTerm, genderPath, table, event, callback)
    resultsFromScrape.push(...evoResults)

    if(resultsFromScrape.length === 0) {
      callback(null, failure({ status: false, error: `${resultsFromScrape.length} results` }))
      return
    }

    await SearchRepository.addSearchResults(resultsFromScrape, table, event, callback)
    callback(null, success({ status: 200, fromDb: false, results: resultsFromScrape }))
  }

}
