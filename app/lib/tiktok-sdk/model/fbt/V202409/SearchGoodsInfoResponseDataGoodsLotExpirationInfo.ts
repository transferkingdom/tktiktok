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
import { Fbt202409SearchGoodsInfoResponseDataGoodsLotExpirationInfoAddresses } from './SearchGoodsInfoResponseDataGoodsLotExpirationInfoAddresses';

export class Fbt202409SearchGoodsInfoResponseDataGoodsLotExpirationInfo {
    'addresses'?: Fbt202409SearchGoodsInfoResponseDataGoodsLotExpirationInfoAddresses;
    /**
    * The goods alert days before expired, represent the period of time before platform send expiration reminder alerts to the merchant.
    */
    'expirationAlertDays'?: number;
    /**
    * The handling method for expired inventory.  Possible values: - TURN_INTO_DEFECTIVE_INVENTORY  - RETURN_TO_SUPPLIER  - DISPOSE
    */
    'handlingMethod'?: string;
    /**
    * The goods inbound cutoff days before expiration, represent the time period before the product\'s expiration when the warehouse will no longer accept inbound shipments. 
    */
    'inboundCutoffDays'?: number;
    /**
    * A flag indicating whether the goods is under expiration managment.  True: Under expiration managment. False: Not under expiration managment.
    */
    'isExpirationManagement'?: boolean;
    /**
    * A flag indicating whether the goods is under lot control.  True: Under lot control. False: Not under lot control. Note: Lot code and expiration date management information is mandatory for these [product categories](https://bytedance.us.larkoffice.com/sheets/OoT2sKH7jhykXCtHEseuzkGYsod) according to Fulfilled by TikTok guidelines.
    */
    'isLotControl'?: boolean;
    /**
    * The return cycle applied when the handling method is set to RETURN_TO_SUPPLIER. In this case, the automatic creation of exit inventory orders will follow one of return cycle rules. Possible values: - ONCE_A_WEEK - ONCE_A_MONTH - ONCE_A_QUARTER
    */
    'returnCycle'?: string;
    /**
    * The goods sales cut off days before expired, represent the period of time before expiration in which the goods will no longer be available for sale.
    */
    'salesCutoffDays'?: number;
    /**
    * The goods shelf life days input by merchant, represent the total number of days the product remains usable or sellable from the time it is manufactured until its expiration.
    */
    'shelfLifeDays'?: number;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "addresses",
            "baseName": "addresses",
            "type": "Fbt202409SearchGoodsInfoResponseDataGoodsLotExpirationInfoAddresses"
        },
        {
            "name": "expirationAlertDays",
            "baseName": "expiration_alert_days",
            "type": "number"
        },
        {
            "name": "handlingMethod",
            "baseName": "handling_method",
            "type": "string"
        },
        {
            "name": "inboundCutoffDays",
            "baseName": "inbound_cutoff_days",
            "type": "number"
        },
        {
            "name": "isExpirationManagement",
            "baseName": "is_expiration_management",
            "type": "boolean"
        },
        {
            "name": "isLotControl",
            "baseName": "is_lot_control",
            "type": "boolean"
        },
        {
            "name": "returnCycle",
            "baseName": "return_cycle",
            "type": "string"
        },
        {
            "name": "salesCutoffDays",
            "baseName": "sales_cutoff_days",
            "type": "number"
        },
        {
            "name": "shelfLifeDays",
            "baseName": "shelf_life_days",
            "type": "number"
        }    ];

    static getAttributeTypeMap() {
        return Fbt202409SearchGoodsInfoResponseDataGoodsLotExpirationInfo.attributeTypeMap;
    }
}

