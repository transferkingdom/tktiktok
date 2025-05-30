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

export class Promotion202309UpdateActivityResponseData {
    /**
    * A unique ID that identifies different activities.
    */
    'activityId'?: string;
    /**
    * Activity name set by the seller.
    */
    'title'?: string;
    /**
    * Last update time. UNIX timestamp.
    */
    'updateTime'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "activityId",
            "baseName": "activity_id",
            "type": "string"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "updateTime",
            "baseName": "update_time",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return Promotion202309UpdateActivityResponseData.attributeTypeMap;
    }
}

