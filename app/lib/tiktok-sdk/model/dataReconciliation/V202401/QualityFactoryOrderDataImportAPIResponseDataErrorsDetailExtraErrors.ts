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

export class DataReconciliation202401QualityFactoryOrderDataImportAPIResponseDataErrorsDetailExtraErrors {
    /**
    * Business err code 
    */
    'code'?: string;
    /**
    * Business err message 
    */
    'message'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "code",
            "baseName": "code",
            "type": "string"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return DataReconciliation202401QualityFactoryOrderDataImportAPIResponseDataErrorsDetailExtraErrors.attributeTypeMap;
    }
}

