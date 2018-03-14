'use strict'

import BotService from '../services/BotService'
import { NotAuthorized } from '../aws/DynamodbResponse'

module.exports.movieBot = async (event, context, callback) => {
  await BotService.checkTickets(event.pathParameters, callback)
}

module.exports.pcPriceBot = async (event, context, callback) => {
  if(event.headers.token !== process.env.AUTH_TOKEN) {
    callback(null, NotAuthorized({ status: false, error: 'Sorry not authorized, foh b' }))
    return
  }

  await BotService.checkPrice(event.pathParameters, callback)
}