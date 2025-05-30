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

export class Fulfillment202502UploadInvoiceResponseDataErrorsDetail {
    /**
    * The order IDs where errors occurred.
    */
    'orderIds'?: Array<string>;
    /**
    * The package ID where the error occurred.
    */
    'packageId'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "orderIds",
            "baseName": "order_ids",
            "type": "Array<string>"
        },
        {
            "name": "packageId",
            "baseName": "package_id",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202502UploadInvoiceResponseDataErrorsDetail.attributeTypeMap;
    }
}

