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
import { Order202406AddExternalOrderReferencesRequestBody } from '../model/order/V202406/AddExternalOrderReferencesRequestBody';
import { Order202406AddExternalOrderReferencesResponse } from '../model/order/V202406/AddExternalOrderReferencesResponse';
import { Order202406GetExternalOrderReferencesResponse } from '../model/order/V202406/GetExternalOrderReferencesResponse';

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://open-api.tiktokglobalshop.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum OrderV202406ApiApiKeys {
}

export class OrderV202406Api {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    static readonly apiName = 'OrderV202406Api' as const;

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

    public setApiKey(key: OrderV202406ApiApiKeys, value: string) {
        (this.authentications as any)[OrderV202406ApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * If you are using your own external OMS (order management system) to manage TikTok Shop orders, the corresponding order IDs between your OMS and TikTok Shop may be different. Use this endpoint to attach the information in your OMS to the correct order(s) in TikTok Shop for further reference.
     * @summary AddExternalOrderReferences
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     * @param AddExternalOrderReferencesRequestBody 
     */
    public async OrdersExternalOrdersPost (xTtsAccessToken: string, contentType: string, shopCipher?: string, AddExternalOrderReferencesRequestBody?: Order202406AddExternalOrderReferencesRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Order202406AddExternalOrderReferencesResponse;  }> {
        const localVarPath = this.basePath + '/order/202406/orders/external_orders';
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
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling OrdersExternalOrdersPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling OrdersExternalOrdersPost.');
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
            body: ObjectSerializer.serialize(AddExternalOrderReferencesRequestBody, "Order202406AddExternalOrderReferencesRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Order202406AddExternalOrderReferencesResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Order202406AddExternalOrderReferencesResponse");
                            resolve({ response: response, body: body });
                        } else {
                            reject(new HttpError(response, body, response.statusCode));
                        }
                    }
                });
            });
        });
    }
    /**
     * If you have used the `Add External Order References` API to sync order information between your external order management system (OMS) and TikTok Shop, you may call this API to get information on the synced orders.
     * @summary GetExternalOrderReferences
     * @param orderId The unique identifier for a TikTok Shop order.
     * @param platform The alias of your external order management system (OMS).  Possible values: - SHOPIFY - WOOCOMMERCE - BIGCOMMERCE - MAGENTO - SALESFORCE_COMMERCE_CLOUD - CHANNEL_ADVISOR - AMAZON - ORDER_MANAGEMENT_SYSTEM - WAREHOUSE_MANAGEMENT_SYSTEM - ERP_SYSTEM
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     */
    public async OrdersOrderIdExternalOrdersGet (orderId: string, platform: string, xTtsAccessToken: string, contentType: string, shopCipher?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Order202406GetExternalOrderReferencesResponse;  }> {
        const localVarPath = this.basePath + '/order/202406/orders/{order_id}/external_orders'
            .replace('{' + 'order_id' + '}', encodeURIComponent(String(orderId)));
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

        // verify required parameter 'orderId' is not null or undefined
        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling OrdersOrderIdExternalOrdersGet.');
        }

        // verify required parameter 'platform' is not null or undefined
        if (platform === null || platform === undefined) {
            throw new Error('Required parameter platform was null or undefined when calling OrdersOrderIdExternalOrdersGet.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling OrdersOrderIdExternalOrdersGet.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling OrdersOrderIdExternalOrdersGet.');
        }

        if (platform !== undefined) {
            localVarQueryParameters['platform'] = ObjectSerializer.serialize(platform, "string");
        }

        if (shopCipher !== undefined) {
            localVarQueryParameters['shop_cipher'] = ObjectSerializer.serialize(shopCipher, "string");
        }

        localVarHeaderParams['x-tts-access-token'] = ObjectSerializer.serialize(xTtsAccessToken, "string");
        localVarHeaderParams['Content-Type'] = ObjectSerializer.serialize(contentType, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
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
            return new Promise<{ response: http.IncomingMessage; body: Order202406GetExternalOrderReferencesResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Order202406GetExternalOrderReferencesResponse");
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

export const OrderV202406ApiOperationNames = {
    OrdersExternalOrdersPost: 'OrdersExternalOrdersPost',OrdersOrderIdExternalOrdersGet: 'OrdersOrderIdExternalOrdersGet',
} as const


export type OrderV202406ApiOperationTypes = {
    OrdersExternalOrdersPost: OrderV202406Api['OrdersExternalOrdersPost'];OrdersOrderIdExternalOrdersGet: OrderV202406Api['OrdersOrderIdExternalOrdersGet'];
};

