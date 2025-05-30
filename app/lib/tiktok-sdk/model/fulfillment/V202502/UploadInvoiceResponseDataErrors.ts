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
import { Fulfillment202502UploadInvoiceResponseDataErrorsDetail } from './UploadInvoiceResponseDataErrorsDetail';

export class Fulfillment202502UploadInvoiceResponseDataErrors {
    /**
    * The error code.
    */
    'code'?: number;
    'detail'?: Fulfillment202502UploadInvoiceResponseDataErrorsDetail;
    /**
    * The error message.
    */
    'message'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "code",
            "baseName": "code",
            "type": "number"
        },
        {
            "name": "detail",
            "baseName": "detail",
            "type": "Fulfillment202502UploadInvoiceResponseDataErrorsDetail"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202502UploadInvoiceResponseDataErrors.attributeTypeMap;
    }
}

