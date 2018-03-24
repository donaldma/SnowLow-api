import * as moment from 'moment-timezone'
import { success, failure } from '../aws/DynamodbResponse'
import BotRepository from '../repositories/BotRepository'
import CommonRepository from '../repositories/CommonRepository'
const cheerio = require('cheerio')
const request = require('request-promise')

const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export default {

  checkTickets: async function(pathParams: any, callback: any) {
    const date = pathParams.date.split('-').join('/')
    const movieName = pathParams.movieTitle.split('-').join(' ')
    const url = `https://www.cineplex.com/Showtimes/${pathParams.movieTitle}/${pathParams.location}?Date=${date}`
    await request(url, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)
        const ticketText = $('div#showtimes-partial-update').last().text()
        const numbersToNotify = ['7788653098', '7789529922']
        if(ticketText.replace(/\s/g, '') === 'ThemovieAvengers:InfinityWarisnotplayingatthelocationSilverCityRiverportCinemason4/26/2018') {
          console.log('not available')
          return
        }

        numbersToNotify.forEach(x => {
          client.messages.create({
              body: `Movie tickets for ${movieName} now available`,
              to: x,
              from: '7784000527'
          })
        })
        console.log('available')
      } else {
        callback(null, failure({ status: false, error: 'Error in request connection' }))
      }
    })
    callback(null, success({ status: true }))
  },

  checkPrice: async function(pathParams: any, event: any, callback: any, table: string) {
    const url = `https://ca.pcpartpicker.com/list/${pathParams.listId}`
    const currentMoment = moment().tz('America/Los_Angeles').format('YYYY-MM-DD')
    const allPrices = await CommonRepository.findAll(table, event, callback, true)
    const sortedPrices = allPrices.sort((a,b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    const lastCheckedPrice = sortedPrices[sortedPrices.length - 1]

    await request(url, async (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)
        const totalPrice: string[] = []

        $('tr.total-price').each((index, element) => {
          const data = $(element)
          totalPrice.push(data.children().text().substring(6))
        })
        await BotRepository.addPcPrice(totalPrice[0], table, event, callback)

        if(lastCheckedPrice && lastCheckedPrice.price === totalPrice[0]) {
          return
        }

        const numbersToNotify = [process.env.PHONE_NUMBER]

        numbersToNotify.forEach(num => {
          client.messages.create({
              body: `Price on ${currentMoment}: ${totalPrice[0]}`,
              to: num,
              from: '7784000527'
          })
        })
        console.log(`Price on ${currentMoment}: ${totalPrice[0]}`)
      } else {
        callback(null, failure({ status: false, error: 'Error in request connection' }))
      }
    })
    callback(null, success({ status: true }))
  }

}
