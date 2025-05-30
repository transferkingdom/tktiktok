/**
 * tiktok shop openapi
 * sdk for apis
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from '../../models';
import { Promotion202309UpdateActivityProductResponseData } from './UpdateActivityProductResponseData';

export class Promotion202309UpdateActivityProductResponse {
    /**
    * The success or failure status code returned in API response.
    */
    'code'?: number;
    'data'?: Promotion202309UpdateActivityProductResponseData;
    /**
    * The success or failure messages returned in API response. Reasons of failure will be described in the message.
    */
    'message'?: string;
    /**
    * Request log.
    */
    'requestId'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "code",
            "baseName": "code",
            "type": "number"
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "Promotion202309UpdateActivityProductResponseData"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        },
        {
            "name": "requestId",
            "baseName": "request_id",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Promotion202309UpdateActivityProductResponse.attributeTypeMap;
    }
}

