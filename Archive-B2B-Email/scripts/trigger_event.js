const emAuth = require('./auth').emAuth
const dotenv = require('dotenv/config')
const request = require('request')
const fs = require('fs')

const event_id = process.env.npm_config_event_id
const uri = `https://api.emarsys.net/api/v2/event/${event_id}/trigger`
const payload = process.env.npm_config_payload

async function trigger_email() {
  let payloads = await new Promise((res, rej) => {
    fs.readFile('./temp/payloads.json', 'UTF8', (err, data) => {
      if(err) {rej(err)}
      res(JSON.parse(data))
    })
  })

  const options = {
    method: 'POST',
    url: uri,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'X-WSSE': emAuth(),
    },
    body: payloads[payload],
    json: true,
  }

  request(options, (err, response, body) => {
    if(err) throw err
    console.log(`${response.statusCode} - ${JSON.stringify(body)}`)
  })
}

trigger_email()
