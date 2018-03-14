import * as moment from 'moment-timezone'
import { success, failure } from '../aws/DynamodbResponse'
const cheerio = require('cheerio')
const request = require('request-promise')

const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export default {

  checkTickets: async function(pathParams: any, callback: any) {
    const url = `https://www.cineplex.com/Movie/${pathParams.movieTitle}`

    await request(url, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)
        const ticketText = $('div.md-qt-widget-container').children().children().text()
        const numbersToNotify = ['7788653098', '7789529922']

        if(ticketText === 'Tickets for this movie are not available at this moment') {
          console.log('not available')
          return
        }

        numbersToNotify.forEach(num => {
          client.messages.create({
              body: `Tickets for infinity war now available at https://www.cineplex.com/Movie/${pathParams.movieTitle}`,
              to: num,
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

  checkPrice: async function(pathParams: any, callback: any) {
    const url = `https://ca.pcpartpicker.com/list/${pathParams.listId}`

    await request(url, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)
        const totalPrice: string[] = []

        $('tr.total-price').each((index, element) => {
          const data = $(element)
          totalPrice.push(data.children().text().substring(6))
        })
        const numbersToNotify = ['7788653098']
        const currentMoment = moment().tz('America/Los_Angeles').format('YYYY-MM-DD')

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
