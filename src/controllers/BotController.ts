'use strict'

import BotService from '../services/BotService'

/**
 * Search based on search term
 */
module.exports.run = async (event, context, callback) => {
  await BotService.checkTickets(callback)
}