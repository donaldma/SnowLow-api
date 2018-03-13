'use strict'

import BotService from '../services/BotService'

module.exports.movieBot = async (event, context, callback) => {
  await BotService.checkTickets(event.pathParameters, callback)
}

module.exports.pcPriceBot = async (event, context, callback) => {
  await BotService.checkPrice(event.pathParameters, callback)
}