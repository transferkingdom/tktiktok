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
import { Product202309PartialEditProductRequestBodySkusExternalListPrices } from './PartialEditProductRequestBodySkusExternalListPrices';
import { Product202309PartialEditProductRequestBodySkusIdentifierCode } from './PartialEditProductRequestBodySkusIdentifierCode';
import { Product202309PartialEditProductRequestBodySkusInventory } from './PartialEditProductRequestBodySkusInventory';
import { Product202309PartialEditProductRequestBodySkusListPrice } from './PartialEditProductRequestBodySkusListPrice';
import { Product202309PartialEditProductRequestBodySkusPreSale } from './PartialEditProductRequestBodySkusPreSale';
import { Product202309PartialEditProductRequestBodySkusPrice } from './PartialEditProductRequestBodySkusPrice';
import { Product202309PartialEditProductRequestBodySkusSalesAttributes } from './PartialEditProductRequestBodySkusSalesAttributes';

export class Product202309PartialEditProductRequestBodySkus {
    /**
    * The SKU list price (e.g. MSRP, RRP) or original price information on external ecommerce platforms. Applicable only for selected sellers in the US market.  **Note**: This value may appear as the strikethrough price on the product page. However, whether the strikethrough price is shown and the amount shown are subject to the audit team\'s review and decision based on various pricing information.
    */
    'externalListPrices'?: Array<Product202309PartialEditProductRequestBodySkusExternalListPrices>;
    /**
    * An external identifier used in an external ecommerce platform. This is used to associate the SKU between TikTok Shop and the external ecommerce platform.  Max length: 999 characters
    */
    'externalSkuId'?: string;
    /**
    * If the SKU is a combined listing (in other words, a product bundle) containing multiple individual SKUs, you can add up to 10 additional identifier codes here for the SKUs included in the bundle. Delimit the codes with commas.  **Format**: GTIN: 14 digits  EAN: 8, 13, or 14 digits  UPC: 12 digits  ISBN: 13 digits (supports \'X\' in uppercase as the last digit)  **Note**:  - Applicable only for the EU market.  - The identifier code must be unique for each SKU, with no repetition allowed.
    */
    'extraIdentifierCodes'?: Array<string>;
    /**
    * The SKU ID generated by TikTok Shop. One product can contain multiple SKU IDs.  **Note**:  - To edit an existing SKU, include its SKU ID. - Any existing SKU IDs not listed here will result in the deletion of those SKUs. For example, if this product contains 5 SKUs and you only provide 2 SKU IDs, the remaining 3 will be deleted. - To create new SKUs, leave the SKU ID blank and complete the other fields.
    */
    'id'?: string;
    'identifierCode'?: Product202309PartialEditProductRequestBodySkusIdentifierCode;
    /**
    * SKU inventory information.
    */
    'inventory'?: Array<Product202309PartialEditProductRequestBodySkusInventory>;
    'listPrice'?: Product202309PartialEditProductRequestBodySkusListPrice;
    'preSale'?: Product202309PartialEditProductRequestBodySkusPreSale;
    'price'?: Product202309PartialEditProductRequestBodySkusPrice;
    /**
    * A list of attributes  (e.g. size, color, length) that define each variant of a product.  **Note**:  - If your product is straightforward without any sales attributes, you can omit this object. - You can only have up to 3 types of sales attributes per product. - Each SKU must include the same number and type of sales attributes. For example, you cannot have one SKU that has only a Color attribute, while another SKU has both Color and Size attributes. - Provide either a built-in ID or a custom name; if both are provided, the ID takes priority. - The `id/name` and `value_id/value_name` pairs must be unique in each SKU. For example, you cannot repeat `\"name\": \"Color\"`, `\"value_name\": \"Red\"` in different SKUs.
    */
    'salesAttributes'?: Array<Product202309PartialEditProductRequestBodySkusSalesAttributes>;
    /**
    * An internal code/name for managing SKUs, not visible to buyers.   - Valid length: 1-50 characters - Format: Text without spaces
    */
    'sellerSku'?: string;
    /**
    * The total quantity/volume of the product represented by the SKU. For example, if the SKU represents 500ml of water, this value would be 500 if the unit type is defined as ml. Valid range: [0.01, 99,999.9999]  Applicable only for the EU market.  **Note**:  - This is mainly used to calculate the unit price of the SKU, and is required only if you wish to display the unit price to facilitate easier price comparisons across different products and packaging sizes. - Unit price = Selling price/(SKU unit count/base unit count). Therefore if you want to obtain the unit price, you would also need to define the \"base unit count\" and the \"unit type\" product attributes. Retrieve the relevant information for these product attributes by using the [Get Attributes API](https://partner.tiktokshop.com/docv2/page/6509c5784a0bb702c0561cc8). The unit price would then be returned in the [Get Product API](https://partner.tiktokshop.com/docv2/page/6509d85b4a0bb702c057fdda).
    */
    'skuUnitCount'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "externalListPrices",
            "baseName": "external_list_prices",
            "type": "Array<Product202309PartialEditProductRequestBodySkusExternalListPrices>"
        },
        {
            "name": "externalSkuId",
            "baseName": "external_sku_id",
            "type": "string"
        },
        {
            "name": "extraIdentifierCodes",
            "baseName": "extra_identifier_codes",
            "type": "Array<string>"
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "identifierCode",
            "baseName": "identifier_code",
            "type": "Product202309PartialEditProductRequestBodySkusIdentifierCode"
        },
        {
            "name": "inventory",
            "baseName": "inventory",
            "type": "Array<Product202309PartialEditProductRequestBodySkusInventory>"
        },
        {
            "name": "listPrice",
            "baseName": "list_price",
            "type": "Product202309PartialEditProductRequestBodySkusListPrice"
        },
        {
            "name": "preSale",
            "baseName": "pre_sale",
            "type": "Product202309PartialEditProductRequestBodySkusPreSale"
        },
        {
            "name": "price",
            "baseName": "price",
            "type": "Product202309PartialEditProductRequestBodySkusPrice"
        },
        {
            "name": "salesAttributes",
            "baseName": "sales_attributes",
            "type": "Array<Product202309PartialEditProductRequestBodySkusSalesAttributes>"
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
        return Product202309PartialEditProductRequestBodySkus.attributeTypeMap;
    }
}

