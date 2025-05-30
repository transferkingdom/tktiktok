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
import { Product202309GetGlobalCategoriesResponseDataCategories } from './GetGlobalCategoriesResponseDataCategories';

export class Product202309GetGlobalCategoriesResponseData {
    /**
    * The list of categories that meet the query conditions.
    */
    'categories'?: Array<Product202309GetGlobalCategoriesResponseDataCategories>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "categories",
            "baseName": "categories",
            "type": "Array<Product202309GetGlobalCategoriesResponseDataCategories>"
        }    ];

    static getAttributeTypeMap() {
        return Product202309GetGlobalCategoriesResponseData.attributeTypeMap;
    }
}

