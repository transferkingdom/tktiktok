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

export class Logistics202309GetGlobalSellerWarehouseResponseDataGlobalWarehouses {
    /**
    * Global warehouse ID, a unique and immutable primary key, used for all global warehouse logistics.
    */
    'id'?: string;
    /**
    * Global warehouse name. This name is not unique across the TikTok Shop system.
    */
    'name'?: string;
    /**
    * Possible values: - SELLER: Warehouse owned by the seller.  - PLATFORM_COOPERATION: Warehouse owned by TikTok Shop.  
    */
    'ownership'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "ownership",
            "baseName": "ownership",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Logistics202309GetGlobalSellerWarehouseResponseDataGlobalWarehouses.attributeTypeMap;
    }
}

