import 'source-map-support/register';
import { Key } from 'aws-sdk/clients/dynamodb';
import { StreamRecord } from 'aws-lambda';
import * as createHttpError from 'http-errors';

/**
 * Validate if the maximum limit DynamoDB search parameter exists and
 * it's positive.
 * @param limit The maximum number of items for DB search operation.
 * @returns An error in case of negative limit, undefined if doesn't
 * exists, or the validated limit otherwise.
 */
export function validateLimitParam(limit: string) {
    // Validate the limit search parameter
    if (!limit) return undefined;

    if (+limit <= 0) {
        throw new createHttpError.BadRequest('The pagination limit should be a positive number.');
    } else {
        return +limit;
    }
}

/**
 * Encode the last item evaluated key from DynamoDB search.
 * @param lastEvaluatedKey A JS object that represents last item
 * evaluated key.
 * @return The URI encoded last evaluated item key or undefined if the
 * key doesn't exists.
 */
export function encodeNextKey(lastEvaluatedKey: Key): string {
    if (!lastEvaluatedKey) return undefined;

    return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}

/**
 * Decode the last item evaluated key from DynamoDB search.
 * @param lastEvaluatedKey A JS object that represents last item
 * evaluated key.
 * @return The decoded URI last evaluated item key or undefined if the
 * key doesn't exists.
 */
export function decodeNextKey(lastEvaluatedKey: string): Key {
    if (!lastEvaluatedKey) return undefined;

    return JSON.parse(decodeURIComponent(lastEvaluatedKey));
}

/**
 * Validate the DynamoDB scan or query search pagination options
 * params.
 * @param limit The maximum number of returned items per call.
 * @param exclusiveStartKey The database album item key to start the
 * scan or query from.
 * @returns The validated limit and exclusiveStartKey if OK or
 * undefined otherwise.
 */
export function validatePaginationParams(limit?: string, exclusiveStartKey?: string) {
    return {
        searchLimit: validateLimitParam(limit),
        searchStartKey: decodeNextKey(exclusiveStartKey),
    };
}

/**
 * Automatically detects according to DynamoDB stream record ID key if
 * it belongs to an album or art item.
 * @param recordKey The DynamoDB stream record key.
 */
export function detectRecordType(recordKey: StreamRecord['Keys']) {
    if (recordKey.hasOwnProperty('albumId') && recordKey.hasOwnProperty('artId')) {
        // Art item have both albumId and artId
        return 'art';
    } else if (recordKey.hasOwnProperty('albumId') && !recordKey.hasOwnProperty('artId')) {
        // Album item has only albumId
        return 'album';
    }
}
