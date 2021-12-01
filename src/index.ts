import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { cors } from "./utils/cors";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  cors(event, { origin: ['meribachat.in', 'smoketrees.in'] })
  const queries = JSON.stringify(event.queryStringParameters);
  console.log(event)
  return {
    statusCode: 200,
    body: `Queries: ${queries}`
  }
}