import { success, failure } from '../aws/DynamodbResponse'
const cheerio = require('cheerio')
const request = require('request-promise')

const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export default {

  checkTickets: async function(callback: any) {
    const url = 'https://www.cineplex.com/Movie/avengers-infinity-war'

    await request(url, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html)
        const ticketText = $('div.md-qt-widget-container').children().children().text()
        const numbers = ['7788653098', '7789529922']

        if(ticketText === 'Tickets for this movie are not available at this moment') {
          return
        }

        numbers.forEach(num => {
          client.messages.create({
              body: 'Tickets for infinity war now available at https://www.cineplex.com/Movie/avengers-infinity-war',
              to: num,
              from: '7784000527'
          })
        })
      } else {
        callback(null, failure({ status: false, error: 'Error in request connection' }))
      }
    })
    callback(null, success({ status: true }))
  }

}
