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

export class Fulfillment202309SearchCombinablePackagesResponseDataCombinablePackages {
    /**
    * A set of pre-generated package IDs after calling the Search Draft Package API. These package IDs will be used when the package combine is confirmed.
    */
    'id'?: string;
    /**
    * List of order IDs for this package.
    */
    'orderIds'?: Array<string>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "orderIds",
            "baseName": "order_ids",
            "type": "Array<string>"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309SearchCombinablePackagesResponseDataCombinablePackages.attributeTypeMap;
    }
}

