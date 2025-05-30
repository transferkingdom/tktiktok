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
import { DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBodyOrders } from './QualityFactoryOrderDataImportAPIRequestBodyOrders';

export class DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBody {
    /**
    * The exchange order list 
    */
    'orders'?: Array<DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBodyOrders>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "orders",
            "baseName": "orders",
            "type": "Array<DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBodyOrders>"
        }    ];

    static getAttributeTypeMap() {
        return DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBody.attributeTypeMap;
    }
}

