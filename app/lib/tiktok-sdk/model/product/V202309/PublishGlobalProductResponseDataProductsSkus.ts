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
import { Product202309PublishGlobalProductResponseDataProductsSkusSaleAttributes } from './PublishGlobalProductResponseDataProductsSkusSaleAttributes';

export class Product202309PublishGlobalProductResponseDataProductsSkus {
    /**
    * The newly generated local SKU ID.
    */
    'id'?: string;
    /**
    * The associated global SKU ID.
    */
    'relatedGlobalSkuId'?: string;
    /**
    * A list of attributes  (e.g. size, color, length) that define each variant of a product.
    */
    'saleAttributes'?: Array<Product202309PublishGlobalProductResponseDataProductsSkusSaleAttributes>;
    /**
    * An internal code/name for managing SKUs, not visible to buyers.
    */
    'sellerSku'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "relatedGlobalSkuId",
            "baseName": "related_global_sku_id",
            "type": "string"
        },
        {
            "name": "saleAttributes",
            "baseName": "sale_attributes",
            "type": "Array<Product202309PublishGlobalProductResponseDataProductsSkusSaleAttributes>"
        },
        {
            "name": "sellerSku",
            "baseName": "seller_sku",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Product202309PublishGlobalProductResponseDataProductsSkus.attributeTypeMap;
    }
}

