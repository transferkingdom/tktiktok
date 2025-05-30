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

export class Fulfillment202309GetPackageDetailResponseDataPickupSlot {
    /**
    * End of time slot when a package is scheduled to be picked up by carrier. Unix timestamp.
    */
    'endTime'?: number;
    /**
    * Start of the time slot when a package is scheduled to be picked up by carrier. Unix timestamp.
    */
    'startTime'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "endTime",
            "baseName": "end_time",
            "type": "number"
        },
        {
            "name": "startTime",
            "baseName": "start_time",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309GetPackageDetailResponseDataPickupSlot.attributeTypeMap;
    }
}

