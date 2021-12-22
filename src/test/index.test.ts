import axios from 'axios'

const event = {
  queryStringParameters: {
    search: 'myntra'
  },
  headers: {
    'Origin': 'github.com'
  }
}

axios.post('http://localhost:9000/2015-03-31/functions/function/invocations', event)
  .then(console.log)
  .then(console.error)

