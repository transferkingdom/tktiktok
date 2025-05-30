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
import { Product202404OptimizedImagesResponseDataImages } from './OptimizedImagesResponseDataImages';

export class Product202404OptimizedImagesResponseData {
    /**
    * The list of images to be optimized.
    */
    'images'?: Array<Product202404OptimizedImagesResponseDataImages>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "images",
            "baseName": "images",
            "type": "Array<Product202404OptimizedImagesResponseDataImages>"
        }    ];

    static getAttributeTypeMap() {
        return Product202404OptimizedImagesResponseData.attributeTypeMap;
    }
}

