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
import { Fulfillment202309SplitOrdersResponseDataPackages } from './SplitOrdersResponseDataPackages';

export class Fulfillment202309SplitOrdersResponseData {
    /**
    * The number of packages returned is dependent on the number of `splittable_group_ids` you sent in the request.
    */
    'packages'?: Array<Fulfillment202309SplitOrdersResponseDataPackages>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "packages",
            "baseName": "packages",
            "type": "Array<Fulfillment202309SplitOrdersResponseDataPackages>"
        }    ];

    static getAttributeTypeMap() {
        return Fulfillment202309SplitOrdersResponseData.attributeTypeMap;
    }
}

