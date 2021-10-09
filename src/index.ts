import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult
} from "aws-lambda";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event.queryStringParameters);
  console.log(event)
  return {
    statusCode: 200,
    body: `Queries: ${queries}`
  }
}