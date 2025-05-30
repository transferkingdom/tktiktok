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
import { Fulfillment202309CombinePackageResponseDataErrorsDetail } from './CombinePackageResponseDataErrorsDetail';

export class Fulfillment202309CombinePackageResponseDataErrors {
    /**
    * The failure reason code.
    */
    'code'?: number;
    'detail'?: Fulfillment202309CombinePackageResponseDataErrorsDetail;
    /**
    * The failure reason of an unsuccessful combined package action.
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
            "type": "Fulfillment202309CombinePackageResponseDataErrorsDetail"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309CombinePackageResponseDataErrors.attributeTypeMap;
    }
}

