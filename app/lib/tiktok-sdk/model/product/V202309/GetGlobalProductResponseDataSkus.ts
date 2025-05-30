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
import { Product202309GetGlobalProductResponseDataSkusIdentifierCode } from './GetGlobalProductResponseDataSkusIdentifierCode';
import { Product202309GetGlobalProductResponseDataSkusInventory } from './GetGlobalProductResponseDataSkusInventory';
import { Product202309GetGlobalProductResponseDataSkusPrice } from './GetGlobalProductResponseDataSkusPrice';
import { Product202309GetGlobalProductResponseDataSkusSalesAttributes } from './GetGlobalProductResponseDataSkusSalesAttributes';

export class Product202309GetGlobalProductResponseDataSkus {
    /**
    * An external identifier used in an external ecommerce platform. This is used to associate the SKU between TikTok Shop and the external ecommerce platform.
    */
    'externalGlobalSkuId'?: string;
    /**
    * If the SKU is a combined listing (in other words, a product bundle) containing multiple individual SKUs, you can add up to 10 additional identifier codes here for the SKUs included in the bundle. Delimit the codes with commas.  **Format**: GTIN: 14 digits  EAN: 8, 13, or 14 digits  UPC: 12 digits  ISBN: 13 digits (supports \'X\' in uppercase as the last digit)  **Note**:  - Applicable only for the EU market.  - The identifier code must be unique for each SKU, with no repetition allowed.
    */
    'extraIdentifierCodes'?: Array<string>;
    /**
    * The total SKU inventory quantity across all shops globally.   The inventory for each local shop is automatically calculated when a product is first published. After publishing, this global quantity cannot be manually changed. You can only modify the inventory quantity in each local shop.
    */
    'globalQuantity'?: number;
    /**
    * The global SKU ID in TikTok Shop.
    */
    'id'?: string;
    'identifierCode'?: Product202309GetGlobalProductResponseDataSkusIdentifierCode;
    /**
    * SKU inventory information per warehouse.
    */
    'inventory'?: Array<Product202309GetGlobalProductResponseDataSkusInventory>;
    'price'?: Product202309GetGlobalProductResponseDataSkusPrice;
    /**
    * A list of attributes  (e.g. size, color, length) that define each variant of a product.
    */
    'salesAttributes'?: Array<Product202309GetGlobalProductResponseDataSkusSalesAttributes>;
    /**
    * An internal code/name for managing SKUs, not visible to buyers. 
    */
    'sellerSku'?: string;
    /**
    * The total quantity/volume of the product represented by the SKU. For example, if the SKU represents 500ml of water, this value would be 500 if the unit type is defined as ml. Applicable only for the EU market.  **Note**:  - This is mainly used to calculate the unit price of the SKU, and is required only if you wish to display the unit price to facilitate easier price comparisons across different products and packaging sizes. - Unit price = Selling price/(SKU unit count/base unit count). Therefore if you want to obtain the unit price, you would also need to define the \"base unit count\" and the \"unit type\" product attributes. Retrieve the relevant information for these product attributes by using the [Get Global Attributes API](650a0483c16ffe02b8dfc80a).
    */
    'skuUnitCount'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "externalGlobalSkuId",
            "baseName": "external_global_sku_id",
            "type": "string"
        },
        {
            "name": "extraIdentifierCodes",
            "baseName": "extra_identifier_codes",
            "type": "Array<string>"
        },
        {
            "name": "globalQuantity",
            "baseName": "global_quantity",
            "type": "number"
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "identifierCode",
            "baseName": "identifier_code",
            "type": "Product202309GetGlobalProductResponseDataSkusIdentifierCode"
        },
        {
            "name": "inventory",
            "baseName": "inventory",
            "type": "Array<Product202309GetGlobalProductResponseDataSkusInventory>"
        },
        {
            "name": "price",
            "baseName": "price",
            "type": "Product202309GetGlobalProductResponseDataSkusPrice"
        },
        {
            "name": "salesAttributes",
            "baseName": "sales_attributes",
            "type": "Array<Product202309GetGlobalProductResponseDataSkusSalesAttributes>"
        },
        {
            "name": "sellerSku",
            "baseName": "seller_sku",
            "type": "string"
        },
        {
            "name": "skuUnitCount",
            "baseName": "sku_unit_count",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Product202309GetGlobalProductResponseDataSkus.attributeTypeMap;
    }
}

