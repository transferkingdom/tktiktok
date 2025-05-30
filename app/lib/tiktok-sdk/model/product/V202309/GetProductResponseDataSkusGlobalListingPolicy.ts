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
import { Product202309GetProductResponseDataSkusGlobalListingPolicyReplicateSource } from './GetProductResponseDataSkusGlobalListingPolicyReplicateSource';

export class Product202309GetProductResponseDataSkusGlobalListingPolicy {
    /**
    * The type of inventory to synchronize. Possible values: - SHARED: Inventory Area Sharing - EXCLUSIVE: Inventory Exclusive
    */
    'inventoryType'?: string;
    /**
    * A flag indicating whether the product price is synchronized.
    */
    'priceSync'?: boolean;
    'replicateSource'?: Product202309GetProductResponseDataSkusGlobalListingPolicyReplicateSource;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "inventoryType",
            "baseName": "inventory_type",
            "type": "string"
        },
        {
            "name": "priceSync",
            "baseName": "price_sync",
            "type": "boolean"
        },
        {
            "name": "replicateSource",
            "baseName": "replicate_source",
            "type": "Product202309GetProductResponseDataSkusGlobalListingPolicyReplicateSource"
        }    ];

    static getAttributeTypeMap() {
        return Product202309GetProductResponseDataSkusGlobalListingPolicy.attributeTypeMap;
    }
}

