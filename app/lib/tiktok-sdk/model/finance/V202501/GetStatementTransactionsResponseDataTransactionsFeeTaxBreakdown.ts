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
import { Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownFee } from './GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownFee';
import { Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownTax } from './GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownTax';

export class Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdown {
    'fee'?: Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownFee;
    'tax'?: Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownTax;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "fee",
            "baseName": "fee",
            "type": "Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownFee"
        },
        {
            "name": "tax",
            "baseName": "tax",
            "type": "Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdownTax"
        }    ];

    static getAttributeTypeMap() {
        return Finance202501GetStatementTransactionsResponseDataTransactionsFeeTaxBreakdown.attributeTypeMap;
    }
}

