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
import { Product202309PublishGlobalProductResponseDataProductsSkus } from './PublishGlobalProductResponseDataProductsSkus';

export class Product202309PublishGlobalProductResponseDataProducts {
    /**
    * The newly generated local product ID.
    */
    'id'?: string;
    /**
    * The market where the product is published. Possible values: - DE: Germany - ES: Spain - FR: France - GB: United Kingdom - ID: Indonesia - IE: Ireland - IT: Italy - JP: Japan - MY: Malaysia - PH: Philippines - SG: Singapore - TH: Thailand - US: United States - VN: Vietnam
    */
    'region'?: string;
    /**
    * The ID of the local shop in the specified market. One market can only have one local shop.
    */
    'shopId'?: string;
    /**
    * The newly created local SKUs in the specified market.
    */
    'skus'?: Array<Product202309PublishGlobalProductResponseDataProductsSkus>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "region",
            "baseName": "region",
            "type": "string"
        },
        {
            "name": "shopId",
            "baseName": "shop_id",
            "type": "string"
        },
        {
            "name": "skus",
            "baseName": "skus",
            "type": "Array<Product202309PublishGlobalProductResponseDataProductsSkus>"
        }    ];

    static getAttributeTypeMap() {
        return Product202309PublishGlobalProductResponseDataProducts.attributeTypeMap;
    }
}

