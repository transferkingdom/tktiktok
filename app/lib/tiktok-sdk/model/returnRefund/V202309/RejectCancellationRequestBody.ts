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
import { ReturnRefund202309RejectCancellationRequestBodyImages } from './RejectCancellationRequestBodyImages';

export class ReturnRefund202309RejectCancellationRequestBody {
    /**
    * Seller\'s comment on rejection decision. This is where a seller will provide more information about rejecting the request. 
    */
    'comment'?: string;
    /**
    * List of images provided by the seller to support seller\'s decision to reject the order cancellation request. 
    */
    'images'?: Array<ReturnRefund202309RejectCancellationRequestBodyImages>;
    /**
    * Seller\'s reason to reject buyer\'s order cancellation request.   Please visit our [cancel reason appendix ](650b28280fcef602bf435096) to see a list of possible rejection reasons.
    */
    'rejectReason'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "comment",
            "baseName": "comment",
            "type": "string"
        },
        {
            "name": "images",
            "baseName": "images",
            "type": "Array<ReturnRefund202309RejectCancellationRequestBodyImages>"
        },
        {
            "name": "rejectReason",
            "baseName": "reject_reason",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return ReturnRefund202309RejectCancellationRequestBody.attributeTypeMap;
    }
}

