import { handler } from '../index'
import { APIGatewayProxyEvent } from 'aws-lambda'

const event = {
  queryStringParameters: {
    search: 'myntra'
  },
  headers: {
    'Origin': 'github.com'
  }
}

handler(event as unknown as APIGatewayProxyEvent)

console.log(event)