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
import { Promotion202309CreateActivityRequestBodyDiscountBmsmDiscount } from './CreateActivityRequestBodyDiscountBmsmDiscount';
import { Promotion202309CreateActivityRequestBodyDiscountShippingDiscount } from './CreateActivityRequestBodyDiscountShippingDiscount';

export class Promotion202309CreateActivityRequestBodyDiscount {
    'bmsmDiscount'?: Promotion202309CreateActivityRequestBodyDiscountBmsmDiscount;
    'shippingDiscount'?: Promotion202309CreateActivityRequestBodyDiscountShippingDiscount;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "bmsmDiscount",
            "baseName": "bmsm_discount",
            "type": "Promotion202309CreateActivityRequestBodyDiscountBmsmDiscount"
        },
        {
            "name": "shippingDiscount",
            "baseName": "shipping_discount",
            "type": "Promotion202309CreateActivityRequestBodyDiscountShippingDiscount"
        }    ];

    static getAttributeTypeMap() {
        return Promotion202309CreateActivityRequestBodyDiscount.attributeTypeMap;
    }
}

