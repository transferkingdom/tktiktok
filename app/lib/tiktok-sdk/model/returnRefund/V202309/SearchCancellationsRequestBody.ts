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

export class ReturnRefund202309SearchCancellationsRequestBody {
    /**
    * List of TikTok Shop buyer user IDs.
    */
    'buyerUserIds'?: Array<string>;
    /**
    * List of order cancellations IDs.
    */
    'cancelIds'?: Array<string>;
    /**
    * List of order cancellation statuses. Possible values: - CANCELLATION_REQUEST_PENDING - CANCELLATION_REQUEST_SUCCESS - CANCELLATION_REQUEST_CANCEL - CANCELLATION_REQUEST_COMPLETE  Please see \"API Overview\" for more information about these statuses.
    */
    'cancelStatus'?: Array<string>;
    /**
    * List of order cancellation types. Possible values: - CANCEL: Cancel by seller or system. - BUYER_CANCEL: Cancel by buyer. Need to be approved by seller or system.
    */
    'cancelTypes'?: Array<string>;
    /**
    * Filter cancellations to show only orders that have been created after a specified date and time. Unix timestamp. 
    */
    'createTimeGe'?: number;
    /**
    * Filter cancellations to show only orders that have been created before a specified date and time. Unix timestamp. 
    */
    'createTimeLt'?: number;
    /**
    * The BCP-47 locale codes for displaying the order, delimited by commas. Default: en-US Refer to [Locale codes](678e3a47bae28f030a8c7523) for the list of supported locale codes.
    */
    'locale'?: string;
    /**
    * List of TikTok Shop order IDs.
    */
    'orderIds'?: Array<string>;
    /**
    * Filter cancellations to show only orders that have been updated after a specified date and time. Unix timestamp.
    */
    'updateTimeGe'?: number;
    /**
    * Filter cancellations to show only orders that have been updated before a specified date and time. Unix timestamp.
    */
    'updateTimeLt'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "buyerUserIds",
            "baseName": "buyer_user_ids",
            "type": "Array<string>"
        },
        {
            "name": "cancelIds",
            "baseName": "cancel_ids",
            "type": "Array<string>"
        },
        {
            "name": "cancelStatus",
            "baseName": "cancel_status",
            "type": "Array<string>"
        },
        {
            "name": "cancelTypes",
            "baseName": "cancel_types",
            "type": "Array<string>"
        },
        {
            "name": "createTimeGe",
            "baseName": "create_time_ge",
            "type": "number"
        },
        {
            "name": "createTimeLt",
            "baseName": "create_time_lt",
            "type": "number"
        },
        {
            "name": "locale",
            "baseName": "locale",
            "type": "string"
        },
        {
            "name": "orderIds",
            "baseName": "order_ids",
            "type": "Array<string>"
        },
        {
            "name": "updateTimeGe",
            "baseName": "update_time_ge",
            "type": "number"
        },
        {
            "name": "updateTimeLt",
            "baseName": "update_time_lt",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return ReturnRefund202309SearchCancellationsRequestBody.attributeTypeMap;
    }
}

