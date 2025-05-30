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

export class Seller202309GetSellerPermissionsResponseData {
    /**
    * The list of cross-border operations that the seller is permitted to perform.  Possible values: - MANAGE_GLOBAL_PRODUCT: Indicates the seller is permitted to manage global products listed in TikTok Shops across multiple countries. If this is empty, it means the seller does not have permission to conduct cross-border operations.
    */
    'permissions'?: Array<string>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "permissions",
            "baseName": "permissions",
            "type": "Array<string>"
        }    ];

    static getAttributeTypeMap() {
        return Seller202309GetSellerPermissionsResponseData.attributeTypeMap;
    }
}

