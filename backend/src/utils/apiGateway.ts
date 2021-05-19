import 'source-map-support/register';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

/**
 * JSON schema validated type of API Gateway Proxy Handler Event.
 */
type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
    body: FromSchema<S>;
};

/**
 * JSON schema validated type of API Gateway Proxy Handler.
 */
export type ValidatedEventAPIGatewayProxyHandler<S> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResult
>;
