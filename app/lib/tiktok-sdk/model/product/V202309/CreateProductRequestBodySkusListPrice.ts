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

export class Product202309CreateProductRequestBodySkusListPrice {
    /**
    * The price amount. Valid range: [0.01, 7600]   **Note**:  - The value must be equal to or greater than `skus.price.amount`. Otherwise, it will be discarded. - If the value is verified to be legitimate by the audit team, it will be stored and returned in the [Get Product API](6509d85b4a0bb702c057fdda).
    */
    'amount'?: string;
    /**
    * The currency. Possible values: USD
    */
    'currency'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "amount",
            "baseName": "amount",
            "type": "string"
        },
        {
            "name": "currency",
            "baseName": "currency",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Product202309CreateProductRequestBodySkusListPrice.attributeTypeMap;
    }
}

