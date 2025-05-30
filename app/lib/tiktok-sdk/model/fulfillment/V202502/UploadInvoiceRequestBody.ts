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
import { Fulfillment202502UploadInvoiceRequestBodyInvoices } from './UploadInvoiceRequestBodyInvoices';

export class Fulfillment202502UploadInvoiceRequestBody {
    /**
    * The list of invoices to upload.
    */
    'invoices'?: Array<Fulfillment202502UploadInvoiceRequestBodyInvoices>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "invoices",
            "baseName": "invoices",
            "type": "Array<Fulfillment202502UploadInvoiceRequestBodyInvoices>"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202502UploadInvoiceRequestBody.attributeTypeMap;
    }
}

