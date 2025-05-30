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
import { Product202309GetProductResponseDataGlobalProductAssociationSkuMappingsSalesAttributeMappings } from './GetProductResponseDataGlobalProductAssociationSkuMappingsSalesAttributeMappings';

export class Product202309GetProductResponseDataGlobalProductAssociationSkuMappings {
    /**
    * The global SKU ID in TikTok Shop.
    */
    'globalSkuId'?: string;
    /**
    * The local SKU ID in TikTok Shop.
    */
    'localSkuId'?: string;
    /**
    * The list of sales attribute mappings between the global and local SKUs.
    */
    'salesAttributeMappings'?: Array<Product202309GetProductResponseDataGlobalProductAssociationSkuMappingsSalesAttributeMappings>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "globalSkuId",
            "baseName": "global_sku_id",
            "type": "string"
        },
        {
            "name": "localSkuId",
            "baseName": "local_sku_id",
            "type": "string"
        },
        {
            "name": "salesAttributeMappings",
            "baseName": "sales_attribute_mappings",
            "type": "Array<Product202309GetProductResponseDataGlobalProductAssociationSkuMappingsSalesAttributeMappings>"
        }    ];

    static getAttributeTypeMap() {
        return Product202309GetProductResponseDataGlobalProductAssociationSkuMappings.attributeTypeMap;
    }
}

