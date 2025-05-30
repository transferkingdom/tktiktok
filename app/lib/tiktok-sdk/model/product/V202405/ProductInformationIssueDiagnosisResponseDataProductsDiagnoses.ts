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
import { Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesDiagnosisResults } from './ProductInformationIssueDiagnosisResponseDataProductsDiagnosesDiagnosisResults';
import { Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesSuggestion } from './ProductInformationIssueDiagnosisResponseDataProductsDiagnosesSuggestion';

export class Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnoses {
    /**
    * The results of diagnosing the specified field.
    */
    'diagnosisResults'?: Array<Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesDiagnosisResults>;
    /**
    * The product field being diagnosed.  Possible values:  - TITLE: Product title - DESCRIPTION: Product description - IMAGE: Product image (`main_images` in the product entity) - ATTRIBUTE: Product attribute - SIZE_CHART: Product size chart
    */
    'field'?: string;
    'suggestion'?: Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesSuggestion;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "diagnosisResults",
            "baseName": "diagnosis_results",
            "type": "Array<Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesDiagnosisResults>"
        },
        {
            "name": "field",
            "baseName": "field",
            "type": "string"
        },
        {
            "name": "suggestion",
            "baseName": "suggestion",
            "type": "Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnosesSuggestion"
        }    ];

    static getAttributeTypeMap() {
        return Product202405ProductInformationIssueDiagnosisResponseDataProductsDiagnoses.attributeTypeMap;
    }
}

