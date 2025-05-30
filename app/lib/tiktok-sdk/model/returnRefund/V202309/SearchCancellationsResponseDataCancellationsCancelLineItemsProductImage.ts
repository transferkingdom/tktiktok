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

export class ReturnRefund202309SearchCancellationsResponseDataCancellationsCancelLineItemsProductImage {
    /**
    * Product image height. Unit: px
    */
    'height'?: number;
    /**
    * Product image URL.
    */
    'url'?: string;
    /**
    * Product image width. Unit: px
    */
    'width'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "height",
            "baseName": "height",
            "type": "number"
        },
        {
            "name": "url",
            "baseName": "url",
            "type": "string"
        },
        {
            "name": "width",
            "baseName": "width",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return ReturnRefund202309SearchCancellationsResponseDataCancellationsCancelLineItemsProductImage.attributeTypeMap;
    }
}

