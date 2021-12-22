import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { cors } from "./utils/cors";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event, 'event')
  // cors(event, { origin: ['meribachat.in', 'smoketrees.in'] })
  const queries = JSON.stringify(event.queryStringParameters);
  return {
    statusCode: 200,
    body: `Queries: ${queries}`
  }
}