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

export class Fbt202409SearchGoodsInfoResponseDataGoodsWarehouseConfirmationInfoWeight {
    /**
    * Weight unit. Possible values: - MILLIGRAM  - GRAM - KILOGRAM  - POUND  - OUNCE
    */
    'unit'?: string;
    /**
    * Weight value verified by warehouse, up to three decimal places.
    */
    'value'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "unit",
            "baseName": "unit",
            "type": "string"
        },
        {
            "name": "value",
            "baseName": "value",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Fbt202409SearchGoodsInfoResponseDataGoodsWarehouseConfirmationInfoWeight.attributeTypeMap;
    }
}

