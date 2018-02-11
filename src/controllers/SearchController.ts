'use strict'

import SearchService from '../services/SearchService'
import SearchRepository from '../repositories/SearchRepository'

/**
 * Search based on search term
 */
module.exports.search = async (event, context, callback) => {
  await SearchService.scrapeBySearchTerm(event.pathParameters, process.env.SEARCH_HISTORY_TABLE!, event, callback)
}

/**
 * Clear search history
 */
module.exports.clearData = async (event, context, callback) => {
  await SearchRepository.clearData(process.env.SEARCH_HISTORY_TABLE!, event, callback)
}

/**
 * Get search history
 */
module.exports.getAll = async (event, context, callback) => {
  await SearchRepository.findAll(process.env.SEARCH_HISTORY_TABLE!, event, callback, false)
}