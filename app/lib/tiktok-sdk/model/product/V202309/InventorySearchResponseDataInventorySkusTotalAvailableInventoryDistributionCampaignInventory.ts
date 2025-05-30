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

export class Product202309InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistributionCampaignInventory {
    /**
    * The name of the associated campaign.
    */
    'campaignName'?: string;
    /**
    * The number of units allocated.
    */
    'quantity'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "campaignName",
            "baseName": "campaign_name",
            "type": "string"
        },
        {
            "name": "quantity",
            "baseName": "quantity",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return Product202309InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistributionCampaignInventory.attributeTypeMap;
    }
}

