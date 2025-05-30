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
import { DataReconciliation202309OrderStatusDataExchangeResponseDataErrorsDetail } from './OrderStatusDataExchangeResponseDataErrorsDetail';

export class DataReconciliation202309OrderStatusDataExchangeResponseDataErrors {
    /**
    * Integartion err code
    */
    'code'?: string;
    'detail'?: DataReconciliation202309OrderStatusDataExchangeResponseDataErrorsDetail;
    /**
    * Integartion err message
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
            "name": "detail",
            "baseName": "detail",
            "type": "DataReconciliation202309OrderStatusDataExchangeResponseDataErrorsDetail"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return DataReconciliation202309OrderStatusDataExchangeResponseDataErrors.attributeTypeMap;
    }
}

