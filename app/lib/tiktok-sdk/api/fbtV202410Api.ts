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
import { Fbt202410SearchFBTInventoryRecordRequestBody } from '../model/fbt/V202410/SearchFBTInventoryRecordRequestBody';
import { Fbt202410SearchFBTInventoryRecordResponse } from '../model/fbt/V202410/SearchFBTInventoryRecordResponse';

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://open-api.tiktokglobalshop.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum FbtV202410ApiApiKeys {
}

export class FbtV202410Api {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    static readonly apiName = 'FbtV202410Api' as const;

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

    public setApiKey(key: FbtV202410ApiApiKeys, value: string) {
        (this.authentications as any)[FbtV202410ApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * This API is used to retrieve detailed inventory change records for goods at the warehouse level.
     * @summary SearchFBTInventoryRecord
     * @param pageSize The number of results to be returned per page.  Valid range: [1-100].
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param pageToken Pagination page token. It should be empty for the first page.
     * @param shopCipher 
     * @param SearchFBTInventoryRecordRequestBody 
     */
    public async InventoryRecordsSearchPost (pageSize: number, xTtsAccessToken: string, contentType: string, pageToken?: string, shopCipher?: string, SearchFBTInventoryRecordRequestBody?: Fbt202410SearchFBTInventoryRecordRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Fbt202410SearchFBTInventoryRecordResponse;  }> {
        const localVarPath = this.basePath + '/fbt/202410/inventory_records/search';
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

        // verify required parameter 'pageSize' is not null or undefined
        if (pageSize === null || pageSize === undefined) {
            throw new Error('Required parameter pageSize was null or undefined when calling InventoryRecordsSearchPost.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling InventoryRecordsSearchPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling InventoryRecordsSearchPost.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['page_size'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (pageToken !== undefined) {
            localVarQueryParameters['page_token'] = ObjectSerializer.serialize(pageToken, "string");
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
            body: ObjectSerializer.serialize(SearchFBTInventoryRecordRequestBody, "Fbt202410SearchFBTInventoryRecordRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Fbt202410SearchFBTInventoryRecordResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Fbt202410SearchFBTInventoryRecordResponse");
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

export const FbtV202410ApiOperationNames = {
    InventoryRecordsSearchPost: 'InventoryRecordsSearchPost',
} as const


export type FbtV202410ApiOperationTypes = {
    InventoryRecordsSearchPost: FbtV202410Api['InventoryRecordsSearchPost'];
};

