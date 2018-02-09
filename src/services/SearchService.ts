import SearchRepository from '../repositories/SearchRepository'


export default {

  scrapeBySearchTerm: async function(searchTerm: string, table: string, event: any, callback: any) {
    const searchTermSplit = searchTerm.toLowerCase().split('-')
    /**
     * If search term is already in database, and createdAt is not more than 3 days
     * return all the items that match
     */
    
    // First target: https://www.evo.com/shop/{category}/{item}
    const evoSearchCategory = searchTermSplit[0]
    const evoSearchKeyword = searchTermSplit[1]
    const evoSearchUrl = `https://www.evo.com/shop/${evoSearchCategory}/${evoSearchKeyword}`
    await SearchRepository.evoScrape(evoSearchCategory, evoSearchKeyword, evoSearchUrl, searchTerm, table, event, callback)

  }

}
