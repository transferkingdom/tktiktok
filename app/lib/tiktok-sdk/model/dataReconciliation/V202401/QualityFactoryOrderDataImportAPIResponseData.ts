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
import { DataReconciliation202401QualityFactoryOrderDataImportAPIResponseDataErrors } from './QualityFactoryOrderDataImportAPIResponseDataErrors';

export class DataReconciliation202401QualityFactoryOrderDataImportAPIResponseData {
    /**
    * The list of errors that occurred from executing the mutation, one failed order one element
    */
    'errors'?: Array<DataReconciliation202401QualityFactoryOrderDataImportAPIResponseDataErrors>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "errors",
            "baseName": "errors",
            "type": "Array<DataReconciliation202401QualityFactoryOrderDataImportAPIResponseDataErrors>"
        }    ];

    static getAttributeTypeMap() {
        return DataReconciliation202401QualityFactoryOrderDataImportAPIResponseData.attributeTypeMap;
    }
}

