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
import { Authorization202401GetWidgetTokenResponseDataWidgetToken } from './GetWidgetTokenResponseDataWidgetToken';

export class Authorization202401GetWidgetTokenResponseData {
    'widgetToken'?: Authorization202401GetWidgetTokenResponseDataWidgetToken;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "widgetToken",
            "baseName": "widget_token",
            "type": "Authorization202401GetWidgetTokenResponseDataWidgetToken"
        }    ];

    static getAttributeTypeMap() {
        return Authorization202401GetWidgetTokenResponseData.attributeTypeMap;
    }
}

