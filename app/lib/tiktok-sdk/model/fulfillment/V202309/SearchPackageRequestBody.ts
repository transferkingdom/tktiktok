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

export class Fulfillment202309SearchPackageRequestBody {
    /**
    * Filter the packages to show only those that are created after (or at) the specified date and time. Unix timestamp. 
    */
    'createTimeGe'?: number;
    /**
    * Filter the packages to show only those that are created before the specified date and time. Unix timestamp. 
    */
    'createTimeLt'?: number;
    /**
    * Possible values: - `PROCESSING`: Package has been arranged by seller. Waiting for carrier to collect the parcel. - `FULFILLING`: Package has been collected by carrier and in transit. - `COMPLETED`: Package has been delivered. - `CANCELLED`: Package has been canceled. Normally, the package is canceled due to the package being lost or damaged.
    */
    'packageStatus'?: string;
    /**
    * Filter the packages to show only those that are updated after (or at) the specified date and time. Unix timestamp. 
    */
    'updateTimeGe'?: number;
    /**
    * Filter the packages to show only those that are updated before the specified date and time. Unix timestamp. 
    */
    'updateTimeLt'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "createTimeGe",
            "baseName": "create_time_ge",
            "type": "number"
        },
        {
            "name": "createTimeLt",
            "baseName": "create_time_lt",
            "type": "number"
        },
        {
            "name": "packageStatus",
            "baseName": "package_status",
            "type": "string"
        },
        {
            "name": "updateTimeGe",
            "baseName": "update_time_ge",
            "type": "number"
        },
        {
            "name": "updateTimeLt",
            "baseName": "update_time_lt",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309SearchPackageRequestBody.attributeTypeMap;
    }
}

