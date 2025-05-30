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
import { Product202309EditProductRequestBodyCertifications } from './EditProductRequestBodyCertifications';
import { Product202309EditProductRequestBodyMainImages } from './EditProductRequestBodyMainImages';
import { Product202309EditProductRequestBodyPackageDimensions } from './EditProductRequestBodyPackageDimensions';
import { Product202309EditProductRequestBodyPackageWeight } from './EditProductRequestBodyPackageWeight';
import { Product202309EditProductRequestBodyProductAttributes } from './EditProductRequestBodyProductAttributes';
import { Product202309EditProductRequestBodySizeChart } from './EditProductRequestBodySizeChart';
import { Product202309EditProductRequestBodySkus } from './EditProductRequestBodySkus';
import { Product202309EditProductRequestBodyVideo } from './EditProductRequestBodyVideo';

export class Product202309EditProductRequestBody {
    /**
    * The ID of the brand of this product.  Use the [Get Brands API](https://partner.tiktokshop.com/docv2/page/6503075656e2bb0289dd5d01) to get the list of available brands for a shop.  **Note**: Unauthorized brands won\'t be displayed on TikTok Shop.
    */
    'brandId'?: string;
    /**
    * The ID of the category of this product. It must be a leaf category that corresponds to the category tree type specified in the `category_version` property. Use the [Get Categories API](https://partner.tiktokshop.com/docv2/page/6509c89d0fcef602bf1acd9b) to obtain the available categories.    **Note**: - Refer to TikTok Shop Academy for information on product category restrictions. - For the US market, if you change a product\'s category to an `INVITE_ONLY` category, you must submit a separate application through the Qualification Center on TikTok Shop Seller Center to gain access. Otherwise, even if the product audit is passed, the product will not be listed and made available to buyers. (The product status will be `PENDING` and the audit status will be `PRE_APPROVED`) - For the Indonesia market, to list a product on both TikTok Shop and Tokopedia, you must use only categories that are available on both platforms. 
    */
    'categoryId'?: string;
    /**
    * The category tree version to assign this product to. Possible values based on region: - US: `v2`, represents the 7-level category tree.   **Important**: For US shops, you must pass `v2` when using this API. - Other regions: `v1`, represents the 3-level category tree. Default: `v1`
    */
    'categoryVersion'?: string;
    /**
    * The list of certifications for your product. Max count: 10  As per TikTok Shop guidelines, certifications are required for certain restricted product categories. Retrieve the certification requirements for your product from the  [Get Category Rules API](https://partner.tiktokshop.com/docv2/page/6509c0febace3e02b74594a9). Refer to [TikTok Shop Restricted Products Policy](https://seller-us.tiktok.com/university/essay?identity=1&role=1&knowledge_id=3238037484275457&from=policy) for information on product category restrictions.
    */
    'certifications'?: Array<Product202309EditProductRequestBodyCertifications>;
    /**
    * The ID of the delivery options available for your product, delimited by commas. Retrieve the IDs from [Get Warehouse Delivery Options](https://partner.tiktokshop.com/docv2/page/650aa46ebace3e02b75d9afa)
    */
    'deliveryOptionIds'?: Array<string>;
    /**
    * The product description in HTML format.  **Note**: - The content must conform to the [HTML syntax](https://html.spec.whatwg.org/). All HTML tags are accepted but to optimize display on the TikTok Shop product detail page, the system will automatically convert certain tags into alternative formats, such as rendering `<table>` tags as images. - Max length: 10,000 characters. - Image guidelines: You must use [TikTok Shop image URLs](6509df95defece02be598a22). Max 30 `<img>` tags, each under 4000px with `src`, `width`, and `height` attributes.  **Recommendations**:  - If you are syncing a pre-existing description from another platform, include the full HTML source description here. - Provide a detailed description, ideally over 300 characters. - Include 3-5 key selling points, each under 250 characters, with supporting images. - Use 1600x1600 px for the image dimensions.
    */
    'description'?: string;
    /**
    * An external identifier used in an external ecommerce platform. This is used to associate the product between TikTok Shop and the external ecommerce platform.  Max length: 999 characters
    */
    'externalProductId'?: string;
    /**
    * A flag indicating whether to show the Cash On Delivery (COD) payment option during checkout.  Use the [Get Category Rules API](https://partner.tiktokshop.com/docv2/page/6509c0febace3e02b74594a9) to check if COD is supported for your product category.  Applicable only for the following markets: - Global sellers: MY, PH, SA, TH, VN - Local sellers: ID, MY, PH, SA, TH, VN  **Note**: If COD is not supported, the listing will fail if you set this to `true`.
    */
    'isCodAllowed'?: boolean;
    /**
    * A flag to indicate if the product is pre-owned.  Applicable only if TOKOPEDIA is the sole listing platform. **Note**: To list pre-owned products on the TikTok Shop platform, please specify the ID of one of the designated pre-owned product categories (e.g. pre-owned luxury bags, luggage, and accessories) in `category_id`.
    */
    'isPreOwned'?: boolean;
    /**
    * The platforms for listing the product. Possible values: - TOKOPEDIA - TIKTOK_SHOP Applicable only for sellers that migrated from Tokopedia.  **IMPORTANT**: This field controls the product\'s visibility on the listing platforms. - If the product is live on both platforms but the request contains only 1 platform, the product will be deactivated and hidden from the omitted platform. - If the product is live on 1 platform but the request contains a different platform, the product will be deactivated and hidden from the omitted platform. - If you omit this array, the product will be sent for audit on the currently active platforms or on the platforms specified in the previous request. - If you want to deactivate the product on both platforms, use the Deactivate Product API.
    */
    'listingPlatforms'?: Array<string>;
    /**
    * A list of images to display in the product image gallery. - Max count: 9 - Arrange your image URIs in the sequence that they should appear on TikTok Shop. - Image dimensions: [300x300 px, 4000x4000 px]    **Recommendations**: - Use a minimum of 5 images. - The first image should have a white background. Use the [Optimize Images API](https://partner.tiktokshop.com/docv2/page/665692b35d39dc02deb49a97) to change the background to white
    */
    'mainImages'?: Array<Product202309EditProductRequestBodyMainImages>;
    /**
    * A comma-delimited list of manufacturer IDs. Retrieve the IDs from the [Search Manufacturers API](67066a580dcee902fa03ccf9).  **Note**: Applicable only for the EU market in certain categories. Use the [Get Category Rules API](6509c0febace3e02b74594a9) to check the requirements.
    */
    'manufacturerIds'?: Array<string>;
    /**
    * The minimum order quantity for the product. Valid range: [1, 20]  Applicable only for the Indonesia market and selected sellers in other SEA markets. Contact your account manager for more information about gaining access to this field.
    */
    'minimumOrderQuantity'?: number;
    'packageDimensions'?: Product202309EditProductRequestBodyPackageDimensions;
    'packageWeight'?: Product202309EditProductRequestBodyPackageWeight;
    /**
    * A list of general attributes (e.g. manufacturer, country of origin, materials used) that describe the product as a whole, regardless of variant.   **Important**: The attributes available for use are determined by the system based on the product\'s assigned category, with some being mandatory. You must provide the product attributes marked as `is_required` in the response of the [Get Attributes API](6509c5784a0bb702c0561cc8) to avoid listing failure.
    */
    'productAttributes'?: Array<Product202309EditProductRequestBodyProductAttributes>;
    /**
    * A comma-delimited list of responsible person IDs. Retrieve the IDs from the [Search Responsible Persons API](67066a55f17b7d02f95d2fb1).  **Note**: Applicable only for the EU market in certain categories. Use the [Get Category Rules API](6509c0febace3e02b74594a9) to check the requirements.
    */
    'responsiblePersonIds'?: Array<string>;
    /**
    * The shipping insurance purchase requirement imposed on buyers for the product.  Possible values: - REQUIRED: Shipping insurance is mandatory and buyers can\'t opt out. - OPTIONAL: Buyers can choose to purchase shipping insurance through the platform. - NOT_SUPPORTED: Shipping insurance is not supported for the product. Default: OPTIONAL  Applicable only if the listing platforms include TOKOPEDIA.
    */
    'shippingInsuranceRequirement'?: string;
    'sizeChart'?: Product202309EditProductRequestBodySizeChart;
    /**
    * A list of Stock Keeping Units (SKUs) used to identify distinct variants of the product.  **Note**: - Max SKUs for BR, EU, MX, JP, UK, US: 300 - Max SKUs for other regions: 100  **Recommendations**: Place the most important variant at the beginning of the array.
    */
    'skus'?: Array<Product202309EditProductRequestBodySkus>;
    /**
    * The product title.  Title length: - DE, ES, FR, IE, IT, JP, UK, US: [1, 255]  - BR, MX: [1, 300]  - Other regions: [25, 255]
    */
    'title'?: string;
    'video'?: Product202309EditProductRequestBodyVideo;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "brandId",
            "baseName": "brand_id",
            "type": "string"
        },
        {
            "name": "categoryId",
            "baseName": "category_id",
            "type": "string"
        },
        {
            "name": "categoryVersion",
            "baseName": "category_version",
            "type": "string"
        },
        {
            "name": "certifications",
            "baseName": "certifications",
            "type": "Array<Product202309EditProductRequestBodyCertifications>"
        },
        {
            "name": "deliveryOptionIds",
            "baseName": "delivery_option_ids",
            "type": "Array<string>"
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string"
        },
        {
            "name": "externalProductId",
            "baseName": "external_product_id",
            "type": "string"
        },
        {
            "name": "isCodAllowed",
            "baseName": "is_cod_allowed",
            "type": "boolean"
        },
        {
            "name": "isPreOwned",
            "baseName": "is_pre_owned",
            "type": "boolean"
        },
        {
            "name": "listingPlatforms",
            "baseName": "listing_platforms",
            "type": "Array<string>"
        },
        {
            "name": "mainImages",
            "baseName": "main_images",
            "type": "Array<Product202309EditProductRequestBodyMainImages>"
        },
        {
            "name": "manufacturerIds",
            "baseName": "manufacturer_ids",
            "type": "Array<string>"
        },
        {
            "name": "minimumOrderQuantity",
            "baseName": "minimum_order_quantity",
            "type": "number"
        },
        {
            "name": "packageDimensions",
            "baseName": "package_dimensions",
            "type": "Product202309EditProductRequestBodyPackageDimensions"
        },
        {
            "name": "packageWeight",
            "baseName": "package_weight",
            "type": "Product202309EditProductRequestBodyPackageWeight"
        },
        {
            "name": "productAttributes",
            "baseName": "product_attributes",
            "type": "Array<Product202309EditProductRequestBodyProductAttributes>"
        },
        {
            "name": "responsiblePersonIds",
            "baseName": "responsible_person_ids",
            "type": "Array<string>"
        },
        {
            "name": "shippingInsuranceRequirement",
            "baseName": "shipping_insurance_requirement",
            "type": "string"
        },
        {
            "name": "sizeChart",
            "baseName": "size_chart",
            "type": "Product202309EditProductRequestBodySizeChart"
        },
        {
            "name": "skus",
            "baseName": "skus",
            "type": "Array<Product202309EditProductRequestBodySkus>"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "video",
            "baseName": "video",
            "type": "Product202309EditProductRequestBodyVideo"
        }    ];

    static getAttributeTypeMap() {
        return Product202309EditProductRequestBody.attributeTypeMap;
    }
}

