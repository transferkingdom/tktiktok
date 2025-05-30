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
import { DataReconciliation202309OrderStatusDataExchangeRequestBodyOrdersPackages } from './OrderStatusDataExchangeRequestBodyOrdersPackages';

export class DataReconciliation202309OrderStatusDataExchangeRequestBodyOrders {
    /**
    * If \'channel_type\' is SHOPIFY,the financial status enumeration, data not in the following enumeration will return an error. shopify financial status: PENDING AUTHORIZED OVERDUE EXPIRING EXPIRED PAID REFUNDED PARTIALLY_REFUNDED PARTIALLY_PAID VOIDED UNPAID
    */
    'channelFinancialStatus'?: string;
    /**
    * If \'channel_type\' is SHOPIFY,the fulfillment status enumeration, data not in the following enumeration will return an error.  Shopify fulfillment status: FULFILLED ON_HOLD PARTIALLY_FULFILLED UNFULFILLED SCHEDULED
    */
    'channelFulfillmentStatus'?: string;
    /**
    * Direct To Consumer System order id
    */
    'channelOrderId'?: string;
    /**
    * The order status enumeration under the corresponding \'channel_type\', and an error will be returned for data outside the enumeration under the \'channel_type\'. The correspondence between \'channel_type\' and order status is as follows.  1. channel_type is \'SHOPIFY\' correspondence order status: OPEN ARCHIVED CANCELED  2. channel_type is \'WOOCOMMERCE\' correspondence order status: PENDING ON_HOLD PROCESSING COMPLETED REFUNDED  3. channel_type is \'BIGCOMMERCE\' correspondence order status: AWAITING_PAYMENT AWAITING_FULFILLMENT AWATING_SHIPMENT PARTIALLY_SHIPPED INCOMPLETE MANUAL_VERIFICATION_REQUIRED SHIPPED CANCELLED REFUND PENDING  4. channel_type is \'MAGENTO\' correspondence order status: NEW PROCESSING PENDING COMPLETE CLOSED PENDING_PAYMENT ON_HOLD
    */
    'channelOrderStatus'?: string;
    /**
    * The update timestamp of the order on the DTC, not the current api call time. Unit: second, the length must be 10. The value must less than current timestamp.
    */
    'channelOrderUpdateTime'?: string;
    /**
    * DTC channel type enumeration, data not in the following enumeration will return an error: SHOPIFY WOOCOMMERCE BIGCOMMERCE MAGENTO
    */
    'channelType'?: string;
    /**
    * The reason of that there is no matched order in channel platform 
    */
    'notExistReason'?: string;
    /**
    * Tiktok shop\'s order id, must be a pure numeric string.
    */
    'orderId'?: string;
    /**
    * the package information list of order
    */
    'packages'?: Array<DataReconciliation202309OrderStatusDataExchangeRequestBodyOrdersPackages>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "channelFinancialStatus",
            "baseName": "channel_financial_status",
            "type": "string"
        },
        {
            "name": "channelFulfillmentStatus",
            "baseName": "channel_fulfillment_status",
            "type": "string"
        },
        {
            "name": "channelOrderId",
            "baseName": "channel_order_id",
            "type": "string"
        },
        {
            "name": "channelOrderStatus",
            "baseName": "channel_order_status",
            "type": "string"
        },
        {
            "name": "channelOrderUpdateTime",
            "baseName": "channel_order_update_time",
            "type": "string"
        },
        {
            "name": "channelType",
            "baseName": "channel_type",
            "type": "string"
        },
        {
            "name": "notExistReason",
            "baseName": "not_exist_reason",
            "type": "string"
        },
        {
            "name": "orderId",
            "baseName": "order_id",
            "type": "string"
        },
        {
            "name": "packages",
            "baseName": "packages",
            "type": "Array<DataReconciliation202309OrderStatusDataExchangeRequestBodyOrdersPackages>"
        }    ];

    static getAttributeTypeMap() {
        return DataReconciliation202309OrderStatusDataExchangeRequestBodyOrders.attributeTypeMap;
    }
}

