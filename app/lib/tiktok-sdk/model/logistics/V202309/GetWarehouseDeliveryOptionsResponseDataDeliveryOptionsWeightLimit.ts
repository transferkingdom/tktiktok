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

export class Logistics202309GetWarehouseDeliveryOptionsResponseDataDeliveryOptionsWeightLimit {
    /**
    * Maximum weight limit.
    */
    'maxWeight'?: number;
    /**
    * Minimum weight limit.
    */
    'minWeight'?: number;
    /**
    * The unit of measurement for the weight, with possible values: - GRAM - POUND
    */
    'unit'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "maxWeight",
            "baseName": "max_weight",
            "type": "number"
        },
        {
            "name": "minWeight",
            "baseName": "min_weight",
            "type": "number"
        },
        {
            "name": "unit",
            "baseName": "unit",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Logistics202309GetWarehouseDeliveryOptionsResponseDataDeliveryOptionsWeightLimit.attributeTypeMap;
    }
}

