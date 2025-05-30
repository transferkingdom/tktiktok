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


import localVarRequest from 'request';
import http from 'http';

/* tslint:disable:no-unused-locals */
import { DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBody } from '../model/dataReconciliation/V202310/QualityFactoryOrderDataImportAPIRequestBody';
import { DataReconciliation202310QualityFactoryOrderDataImportAPIResponse } from '../model/dataReconciliation/V202310/QualityFactoryOrderDataImportAPIResponse';

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://open-api.tiktokglobalshop.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum DataReconciliationV202310ApiApiKeys {
}

export class DataReconciliationV202310Api {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    static readonly apiName = 'DataReconciliationV202310Api' as const;

    protected authentications = {
        'default': <Authentication>new VoidAuth(),
    }

    protected interceptors: Interceptor[] = [];

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    set defaultHeaders(defaultHeaders: any) {
        this._defaultHeaders = defaultHeaders;
    }

    get defaultHeaders() {
        return this._defaultHeaders;
    }

    get basePath() {
        return this._basePath;
    }

    public setDefaultAuthentication(auth: Authentication) {
        this.authentications.default = auth;
    }

    public setApiKey(key: DataReconciliationV202310ApiApiKeys, value: string) {
        (this.authentications as any)[DataReconciliationV202310ApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * TikTok Shop-Connector exchange order data from DTC(Direct To Consumer) platform to Tiktok Shop-QE system to compare the order data of DTC platform and Tiktok Shop. Which systems of users are involved with the API? For example, DTC platform Connector App, Shipping App, WMS, PIM, Multi Channel App, etc.
     * @summary QualityFactoryOrderDataImportAPI
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     * @param QualityFactoryOrderDataImportAPIRequestBody 
     */
    public async OrdersImportPost (xTtsAccessToken: string, contentType: string, shopCipher?: string, QualityFactoryOrderDataImportAPIRequestBody?: DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: DataReconciliation202310QualityFactoryOrderDataImportAPIResponse;  }> {
        const localVarPath = this.basePath + '/data_reconciliation/202310/orders/import';
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this._defaultHeaders);
        const produces = ['application/json'];
        // give precedence to 'application/json'
        if (produces.indexOf('application/json') >= 0) {
            localVarHeaderParams.Accept = 'application/json';
        } else {
            localVarHeaderParams.Accept = produces.join(',');
        }
        let localVarFormParams: any = {};

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling OrdersImportPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling OrdersImportPost.');
        }

        if (shopCipher !== undefined) {
            localVarQueryParameters['shop_cipher'] = ObjectSerializer.serialize(shopCipher, "string");
        }

        localVarHeaderParams['x-tts-access-token'] = ObjectSerializer.serialize(xTtsAccessToken, "string");
        localVarHeaderParams['Content-Type'] = ObjectSerializer.serialize(contentType, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(QualityFactoryOrderDataImportAPIRequestBody, "DataReconciliation202310QualityFactoryOrderDataImportAPIRequestBody")
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));

        let interceptorPromise = authenticationPromise;
        for (const interceptor of this.interceptors) {
            interceptorPromise = interceptorPromise.then(() => interceptor(localVarRequestOptions));
        }

        return interceptorPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.IncomingMessage; body: DataReconciliation202310QualityFactoryOrderDataImportAPIResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "DataReconciliation202310QualityFactoryOrderDataImportAPIResponse");
                            resolve({ response: response, body: body });
                        } else {
                            reject(new HttpError(response, body, response.statusCode));
                        }
                    }
                });
            });
        });
    }
}

export const DataReconciliationV202310ApiOperationNames = {
    OrdersImportPost: 'OrdersImportPost',
} as const


export type DataReconciliationV202310ApiOperationTypes = {
    OrdersImportPost: DataReconciliationV202310Api['OrdersImportPost'];
};

