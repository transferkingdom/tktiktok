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
import { Product202405ProductInformationIssueDiagnosisResponseDataProducts } from './ProductInformationIssueDiagnosisResponseDataProducts';

export class Product202405ProductInformationIssueDiagnosisResponseData {
    /**
    * The list of requested products and the corresponding diagnosis results.
    */
    'products'?: Array<Product202405ProductInformationIssueDiagnosisResponseDataProducts>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "products",
            "baseName": "products",
            "type": "Array<Product202405ProductInformationIssueDiagnosisResponseDataProducts>"
        }    ];

    static getAttributeTypeMap() {
        return Product202405ProductInformationIssueDiagnosisResponseData.attributeTypeMap;
    }
}

