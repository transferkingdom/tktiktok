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

export class Fulfillment202309UpdateShippingInfoRequestBody {
    /**
    * Identifies the carrier that will deliver the package. Please call [Get Shipping Providers API](https://partner.tiktokshop.com/docv2/page/650aa48d4a0bb702c06d85cd?external_id=650aa48d4a0bb702c06d85cd#Back%20To%20Top) to retrieve the available shipping provider(s).
    */
    'shippingProviderId'?: string;
    /**
    * The shipment tracking number provided by the carrier.
    */
    'trackingNumber'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "shippingProviderId",
            "baseName": "shipping_provider_id",
            "type": "string"
        },
        {
            "name": "trackingNumber",
            "baseName": "tracking_number",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309UpdateShippingInfoRequestBody.attributeTypeMap;
    }
}

