'use strict'

import SearchService from '../services/SearchService'
import { NotAuthorized } from '../aws/DynamodbResponse'
import CommonRepository from '../repositories/CommonRepository'

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
  const { requestContext } = event

  if(requestContext && requestContext.stage !== 'dev') {
    if(requestContext.identity.cognitoIdentityId !== process.env.ADMIN_COG_ID) {
      callback(null, NotAuthorized({ status: false, error: 'You are not an admin' }))
      return
    }
  }

  await CommonRepository.clearData(process.env.SEARCH_HISTORY_TABLE!, event, callback)
}

/**
 * Get search history
 */
module.exports.getAll = async (event: any, context, callback) => {
  const { requestContext } = event
  console.log('requestContext.identity.cognitoIdentityId', requestContext.identity.cognitoIdentityId)
  if(requestContext && requestContext.stage !== 'dev') {
    if(requestContext.identity.cognitoIdentityId !== process.env.ADMIN_COG_ID) {
      callback(null, NotAuthorized({ status: false, error: 'You are not an admin' }))
      return
    }
  }

  await CommonRepository.findAll(process.env.SEARCH_HISTORY_TABLE!, event, callback, false)
}