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

export class SupplyChain202309ConfirmPackageShipmentRequestBodyPackagesWeight {
    /**
    * Package weight unit Possible values: - KILOGRAM - GRAM - MILLIGRAM - POUND - OUNCE
    */
    'unit'?: string;
    /**
    * Package weight value
    */
    'value'?: number;

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
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return SupplyChain202309ConfirmPackageShipmentRequestBodyPackagesWeight.attributeTypeMap;
    }
}

