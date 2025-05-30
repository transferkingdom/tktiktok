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
import { Logistics202309GetWarehouseListResponseDataWarehouses } from './GetWarehouseListResponseDataWarehouses';

export class Logistics202309GetWarehouseListResponseData {
    /**
    * All the warehouses associated with the seller.
    */
    'warehouses'?: Array<Logistics202309GetWarehouseListResponseDataWarehouses>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "warehouses",
            "baseName": "warehouses",
            "type": "Array<Logistics202309GetWarehouseListResponseDataWarehouses>"
        }    ];

    static getAttributeTypeMap() {
        return Logistics202309GetWarehouseListResponseData.attributeTypeMap;
    }
}

