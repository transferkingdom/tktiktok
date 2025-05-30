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
import { Product202409CreateManufacturerRequestBody } from '../model/product/V202409/CreateManufacturerRequestBody';
import { Product202409CreateManufacturerResponse } from '../model/product/V202409/CreateManufacturerResponse';
import { Product202409CreateResponsiblePersonRequestBody } from '../model/product/V202409/CreateResponsiblePersonRequestBody';
import { Product202409CreateResponsiblePersonResponse } from '../model/product/V202409/CreateResponsiblePersonResponse';
import { Product202409PartialEditManufacturerRequestBody } from '../model/product/V202409/PartialEditManufacturerRequestBody';
import { Product202409PartialEditManufacturerResponse } from '../model/product/V202409/PartialEditManufacturerResponse';
import { Product202409PartialEditResponsiblePersonRequestBody } from '../model/product/V202409/PartialEditResponsiblePersonRequestBody';
import { Product202409PartialEditResponsiblePersonResponse } from '../model/product/V202409/PartialEditResponsiblePersonResponse';
import { Product202409SearchManufacturersRequestBody } from '../model/product/V202409/SearchManufacturersRequestBody';
import { Product202409SearchManufacturersResponse } from '../model/product/V202409/SearchManufacturersResponse';
import { Product202409SearchResponsiblePersonsRequestBody } from '../model/product/V202409/SearchResponsiblePersonsRequestBody';
import { Product202409SearchResponsiblePersonsResponse } from '../model/product/V202409/SearchResponsiblePersonsResponse';

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://open-api.tiktokglobalshop.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum ProductV202409ApiApiKeys {
}

export class ProductV202409Api {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    static readonly apiName = 'ProductV202409Api' as const;

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

    public setApiKey(key: ProductV202409ApiApiKeys, value: string) {
        (this.authentications as any)[ProductV202409ApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * Edit the details of a manufacturer in the EU languages supported by TikTok Shop. Include the locale code to edit the responsible person\'s information in a particular language. Target seller: Local sellers operating in EU countries **Note**: - Updates are handled per top-level property, so all non-empty fields within an updated object must be supplied to prevent overwriting with blanks. - For top-level properties (e.g. `name`, `email`) that are not nested in an object, you can update them individually. Omitting these properties in the request will leave them unchanged. - If you need to edit any nested property within an object, you must provide values for all nested properties of that object. Any omitted nested properties will be overwritten with blanks. For example, if you want to update `phone_number.local_number`, you must also include the `country_code` property to avoid data loss for that property.
     * @summary PartialEditManufacturer
     * @param manufacturerId The manufacturer ID in TikTok Shop.
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param PartialEditManufacturerRequestBody 
     */
    public async ComplianceManufacturersManufacturerIdPartialEditPost (manufacturerId: string, xTtsAccessToken: string, contentType: string, PartialEditManufacturerRequestBody?: Product202409PartialEditManufacturerRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409PartialEditManufacturerResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/manufacturers/{manufacturer_id}/partial_edit'
            .replace('{' + 'manufacturer_id' + '}', encodeURIComponent(String(manufacturerId)));
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

        // verify required parameter 'manufacturerId' is not null or undefined
        if (manufacturerId === null || manufacturerId === undefined) {
            throw new Error('Required parameter manufacturerId was null or undefined when calling ComplianceManufacturersManufacturerIdPartialEditPost.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceManufacturersManufacturerIdPartialEditPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceManufacturersManufacturerIdPartialEditPost.');
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
            body: ObjectSerializer.serialize(PartialEditManufacturerRequestBody, "Product202409PartialEditManufacturerRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409PartialEditManufacturerResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409PartialEditManufacturerResponse");
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
     * Add a manufacturer for a seller. The provided information will be automatically translated into all EU languages supported by TikTok Shop. - Use the [Search Manufacturers API](67066a580dcee902fa03ccf9) to obtain the translations. - Use the [Partial Edit Manufacturer API](67066a55c55b3a03044eea29) to edit the translations, if necessary. - When creating a product, pass the returned `manufacturer_id` to associate the product with the manufacturer. Target seller: Local sellers operating in EU countries
     * @summary CreateManufacturer
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param CreateManufacturerRequestBody 
     */
    public async ComplianceManufacturersPost (xTtsAccessToken: string, contentType: string, CreateManufacturerRequestBody?: Product202409CreateManufacturerRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409CreateManufacturerResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/manufacturers';
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
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceManufacturersPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceManufacturersPost.');
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
            body: ObjectSerializer.serialize(CreateManufacturerRequestBody, "Product202409CreateManufacturerRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409CreateManufacturerResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409CreateManufacturerResponse");
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
     * Retrieve a list of manufacturers based on their ID or keywords. When creating a product, pass the returned `manufacturer_id` to associate the product with the manufacturer. Target seller: Local sellers operating in EU countries
     * @summary SearchManufacturers
     * @param pageSize The number of results to be returned per page.  Valid range: [1-100]
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param pageToken An opaque token used to retrieve the next page of a paginated result set. Retrieve this value from the result of the &#x60;next_page_token&#x60; from a previous response. It is not needed for the first page.
     * @param SearchManufacturersRequestBody 
     */
    public async ComplianceManufacturersSearchPost (pageSize: number, xTtsAccessToken: string, contentType: string, pageToken?: string, SearchManufacturersRequestBody?: Product202409SearchManufacturersRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409SearchManufacturersResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/manufacturers/search';
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
            throw new Error('Required parameter pageSize was null or undefined when calling ComplianceManufacturersSearchPost.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceManufacturersSearchPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceManufacturersSearchPost.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['page_size'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (pageToken !== undefined) {
            localVarQueryParameters['page_token'] = ObjectSerializer.serialize(pageToken, "string");
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
            body: ObjectSerializer.serialize(SearchManufacturersRequestBody, "Product202409SearchManufacturersRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409SearchManufacturersResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409SearchManufacturersResponse");
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
     * Add a new EU responsible person who ensures a seller\'s products comply with EU regulations. The provided information will be automatically translated into all EU languages supported by TikTok Shop. - Use the [Search Responsible Persons API](67066a55f17b7d02f95d2fb1) to obtain the translations. - Use the [Partial Edit Responsible Person API](67066a5587019802fdce19b3) to edit the translations, if necessary. - When creating a product, pass the returned `responsible_person_id` to associate the product with the responsible person.  Target seller: Local sellers operating in EU countries
     * @summary CreateResponsiblePerson
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param CreateResponsiblePersonRequestBody 
     */
    public async ComplianceResponsiblePersonsPost (xTtsAccessToken: string, contentType: string, CreateResponsiblePersonRequestBody?: Product202409CreateResponsiblePersonRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409CreateResponsiblePersonResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/responsible_persons';
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
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceResponsiblePersonsPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceResponsiblePersonsPost.');
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
            body: ObjectSerializer.serialize(CreateResponsiblePersonRequestBody, "Product202409CreateResponsiblePersonRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409CreateResponsiblePersonResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409CreateResponsiblePersonResponse");
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
     * Edit the details of an EU responsible person in the EU languages supported by TikTok Shop. Include the locale code to edit the responsible person\'s information in a particular language. Target seller: Local sellers operating in EU countries **Note**: - Updates are handled per top-level property, so all non-empty fields within an updated object must be supplied to prevent overwriting with blanks. - For top-level properties (e.g. `name`, `email`) that are not nested in an object, you can update them individually. Omitting these properties in the request will leave them unchanged. - If you need to edit any nested property within an object, you must provide values for all nested properties of that object. Any omitted nested properties will be overwritten with blanks. For example, if you want to update `phone_number.local_number`, you must also include the `country_code` property to avoid data loss for that property.
     * @summary PartialEditResponsiblePerson
     * @param responsiblePersonId The responsible person ID in TikTok Shop.
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param PartialEditResponsiblePersonRequestBody 
     */
    public async ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost (responsiblePersonId: string, xTtsAccessToken: string, contentType: string, PartialEditResponsiblePersonRequestBody?: Product202409PartialEditResponsiblePersonRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409PartialEditResponsiblePersonResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/responsible_persons/{responsible_person_id}/partial_edit'
            .replace('{' + 'responsible_person_id' + '}', encodeURIComponent(String(responsiblePersonId)));
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

        // verify required parameter 'responsiblePersonId' is not null or undefined
        if (responsiblePersonId === null || responsiblePersonId === undefined) {
            throw new Error('Required parameter responsiblePersonId was null or undefined when calling ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost.');
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
            body: ObjectSerializer.serialize(PartialEditResponsiblePersonRequestBody, "Product202409PartialEditResponsiblePersonRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409PartialEditResponsiblePersonResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409PartialEditResponsiblePersonResponse");
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
     * Retrieve a list of responsible persons based on their ID or keywords. When creating a product, pass the returned `responsible_person_id` to associate the product with the responsible person. Target seller: Local sellers operating in EU countries
     * @summary SearchResponsiblePersons
     * @param pageSize The number of results to be returned per page.  Valid range: [1-100]
     * @param xTtsAccessToken 
     * @param contentType Allowed type: application/json
     * @param pageToken An opaque token used to retrieve the next page of a paginated result set. Retrieve this value from the result of the &#x60;next_page_token&#x60; from a previous response. It is not needed for the first page.
     * @param SearchResponsiblePersonsRequestBody 
     */
    public async ComplianceResponsiblePersonsSearchPost (pageSize: number, xTtsAccessToken: string, contentType: string, pageToken?: string, SearchResponsiblePersonsRequestBody?: Product202409SearchResponsiblePersonsRequestBody, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: Product202409SearchResponsiblePersonsResponse;  }> {
        const localVarPath = this.basePath + '/product/202409/compliance/responsible_persons/search';
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
            throw new Error('Required parameter pageSize was null or undefined when calling ComplianceResponsiblePersonsSearchPost.');
        }

        // verify required parameter 'xTtsAccessToken' is not null or undefined
        if (xTtsAccessToken === null || xTtsAccessToken === undefined) {
            throw new Error('Required parameter xTtsAccessToken was null or undefined when calling ComplianceResponsiblePersonsSearchPost.');
        }

        // verify required parameter 'contentType' is not null or undefined
        if (contentType === null || contentType === undefined) {
            throw new Error('Required parameter contentType was null or undefined when calling ComplianceResponsiblePersonsSearchPost.');
        }

        if (pageSize !== undefined) {
            localVarQueryParameters['page_size'] = ObjectSerializer.serialize(pageSize, "number");
        }

        if (pageToken !== undefined) {
            localVarQueryParameters['page_token'] = ObjectSerializer.serialize(pageToken, "string");
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
            body: ObjectSerializer.serialize(SearchResponsiblePersonsRequestBody, "Product202409SearchResponsiblePersonsRequestBody")
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
            return new Promise<{ response: http.IncomingMessage; body: Product202409SearchResponsiblePersonsResponse;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "Product202409SearchResponsiblePersonsResponse");
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

export const ProductV202409ApiOperationNames = {
    ComplianceManufacturersManufacturerIdPartialEditPost: 'ComplianceManufacturersManufacturerIdPartialEditPost',ComplianceManufacturersPost: 'ComplianceManufacturersPost',ComplianceManufacturersSearchPost: 'ComplianceManufacturersSearchPost',ComplianceResponsiblePersonsPost: 'ComplianceResponsiblePersonsPost',ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost: 'ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost',ComplianceResponsiblePersonsSearchPost: 'ComplianceResponsiblePersonsSearchPost',
} as const


export type ProductV202409ApiOperationTypes = {
    ComplianceManufacturersManufacturerIdPartialEditPost: ProductV202409Api['ComplianceManufacturersManufacturerIdPartialEditPost'];ComplianceManufacturersPost: ProductV202409Api['ComplianceManufacturersPost'];ComplianceManufacturersSearchPost: ProductV202409Api['ComplianceManufacturersSearchPost'];ComplianceResponsiblePersonsPost: ProductV202409Api['ComplianceResponsiblePersonsPost'];ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost: ProductV202409Api['ComplianceResponsiblePersonsResponsiblePersonIdPartialEditPost'];ComplianceResponsiblePersonsSearchPost: ProductV202409Api['ComplianceResponsiblePersonsSearchPost'];
};

