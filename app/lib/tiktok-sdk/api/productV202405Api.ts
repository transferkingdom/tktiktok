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
import { Product202405GetProductsSEOWordsResponse } from '../model/product/V202405/GetProductsSEOWordsResponse';
import { Product202405GetRecommendedProductTitleAndDescriptionResponse } from '../model/product/V202405/GetRecommendedProductTitleAndDescriptionResponse';
import { Product202405ProductInformationIssueDiagnosisResponse } from '../model/product/V202405/ProductInformationIssueDiagnosisResponse';

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://open-api.tiktokglobalshop.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum ProductV202405ApiApiKeys {
}

export class ProductV202405Api {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    static readonly apiName = 'ProductV202405Api' as const;

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

    public setApiKey(key: ProductV202405ApiApiKeys, value: string) {
        (this.authentications as any)[ProductV202405ApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * Diagnose multiple existing live (status: `ACTIVATE`) products to obtain information that helps you to improve the product content, enhancing product visibility and customer trust. The returned information includes: - Listing quality information (available only for the US market). - Issues with the current product details and the overall recommendations - Auto-generated optimization suggestions targeted for specific product fields, including the title, description, and image. **Note**: This API focuses solely on optimizing product visibility and does not evaluate whether your product meets listing requirements. Quality issues identified by this API do not block your product from being listed. To verify listing requirements, use the [Check Product Listing API](650a0ee8f1fd3102b91c6493).
     * @summary ProductInformationIssueDiagnosis
     * @param productIds The list of product IDs that you want to diagnose.  **Note**: - Max number of IDs: 200 - The product must be live (status: &#x60;ACTIVATE&#x60;)
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     */
    public async ProductsDiagnosesGet (productIds: Array<string>, xTtsAccessToken: string, contentType: string, shopCipher?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202405ProductInformationIssueDiagnosisResponse;  }> {
        const localVarPath = this.basePath + '/product/202405/products/diagnoses';
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

        // verify required parameter 'productIds' is not null or undefined
        if (productIds === null || productIds === undefined) {
            throw new Error('Required parameter productIds was null or undefined when calling ProductsDiagnosesGet.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ProductsDiagnosesGet.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ProductsDiagnosesGet.');
        }

        if (productIds !== undefined) {
            localVarQueryParameters['product_ids'] = ObjectSerializer.serialize(productIds, "Array<string>");
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
            return new Promise<{ response: http.IncomingMessage; body: Product202405ProductInformationIssueDiagnosisResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202405ProductInformationIssueDiagnosisResponse");
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
     * Obtain SEO suggestions for product titles of live products (status: `ACTIVATE`) to enhance product visibility.
     * @summary GetProductsSEOWords
     * @param productIds The product IDs for which you want to obtain SEO suggestions. - Max IDs: 20 - The product must be live (&#x60;ACTIVATE&#x60; status)
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     */
    public async ProductsSeoWordsGet (productIds: Array<string>, xTtsAccessToken: string, contentType: string, shopCipher?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202405GetProductsSEOWordsResponse;  }> {
        const localVarPath = this.basePath + '/product/202405/products/seo_words';
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

        // verify required parameter 'productIds' is not null or undefined
        if (productIds === null || productIds === undefined) {
            throw new Error('Required parameter productIds was null or undefined when calling ProductsSeoWordsGet.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ProductsSeoWordsGet.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ProductsSeoWordsGet.');
        }

        if (productIds !== undefined) {
            localVarQueryParameters['product_ids'] = ObjectSerializer.serialize(productIds, "Array<string>");
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
            return new Promise<{ response: http.IncomingMessage; body: Product202405GetProductsSEOWordsResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202405GetProductsSEOWordsResponse");
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
     * Obtain AI-optimized product titles and descriptions for live products (status: `ACTIVATE`).
     * @summary GetRecommendedProductTitleAndDescription
     * @param productIds The product IDs for which you want to optimize the information. - Max IDs: 20 - The product must be live (status: &#x60;ACTIVATE&#x60;)
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param shopCipher 
     */
    public async ProductsSuggestionsGet (productIds: Array<string>, xTtsAccessToken: string, contentType: string, shopCipher?: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202405GetRecommendedProductTitleAndDescriptionResponse;  }> {
        const localVarPath = this.basePath + '/product/202405/products/suggestions';
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

        // verify required parameter 'productIds' is not null or undefined
        if (productIds === null || productIds === undefined) {
            throw new Error('Required parameter productIds was null or undefined when calling ProductsSuggestionsGet.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ProductsSuggestionsGet.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ProductsSuggestionsGet.');
        }

        if (productIds !== undefined) {
            localVarQueryParameters['product_ids'] = ObjectSerializer.serialize(productIds, "Array<string>");
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
            return new Promise<{ response: http.IncomingMessage; body: Product202405GetRecommendedProductTitleAndDescriptionResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202405GetRecommendedProductTitleAndDescriptionResponse");
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

export const ProductV202405ApiOperationNames = {
    ProductsDiagnosesGet: 'ProductsDiagnosesGet',ProductsSeoWordsGet: 'ProductsSeoWordsGet',ProductsSuggestionsGet: 'ProductsSuggestionsGet',
} as const


export type ProductV202405ApiOperationTypes = {
    ProductsDiagnosesGet: ProductV202405Api['ProductsDiagnosesGet'];ProductsSeoWordsGet: ProductV202405Api['ProductsSeoWordsGet'];ProductsSuggestionsGet: ProductV202405Api['ProductsSuggestionsGet'];
};

