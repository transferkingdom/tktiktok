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
import { Product202309GetProductResponseDataAudit } from './GetProductResponseDataAudit';
import { Product202309GetProductResponseDataAuditFailedReasons } from './GetProductResponseDataAuditFailedReasons';
import { Product202309GetProductResponseDataBrand } from './GetProductResponseDataBrand';
import { Product202309GetProductResponseDataCategoryChains } from './GetProductResponseDataCategoryChains';
import { Product202309GetProductResponseDataCertifications } from './GetProductResponseDataCertifications';
import { Product202309GetProductResponseDataDeliveryOptions } from './GetProductResponseDataDeliveryOptions';
import { Product202309GetProductResponseDataGlobalProductAssociation } from './GetProductResponseDataGlobalProductAssociation';
import { Product202309GetProductResponseDataIntegratedPlatformStatuses } from './GetProductResponseDataIntegratedPlatformStatuses';
import { Product202309GetProductResponseDataMainImages } from './GetProductResponseDataMainImages';
import { Product202309GetProductResponseDataPackageDimensions } from './GetProductResponseDataPackageDimensions';
import { Product202309GetProductResponseDataPackageWeight } from './GetProductResponseDataPackageWeight';
import { Product202309GetProductResponseDataPrescriptionRequirement } from './GetProductResponseDataPrescriptionRequirement';
import { Product202309GetProductResponseDataProductAttributes } from './GetProductResponseDataProductAttributes';
import { Product202309GetProductResponseDataProductFamilies } from './GetProductResponseDataProductFamilies';
import { Product202309GetProductResponseDataRecommendedCategories } from './GetProductResponseDataRecommendedCategories';
import { Product202309GetProductResponseDataSizeChart } from './GetProductResponseDataSizeChart';
import { Product202309GetProductResponseDataSkus } from './GetProductResponseDataSkus';
import { Product202309GetProductResponseDataVideo } from './GetProductResponseDataVideo';

export class Product202309GetProductResponseData {
    'audit'?: Product202309GetProductResponseDataAudit;
    /**
    * TikTok Shop audit failure information.
    */
    'auditFailedReasons'?: Array<Product202309GetProductResponseDataAuditFailedReasons>;
    'brand'?: Product202309GetProductResponseDataBrand;
    /**
    * Product category tree information.
    */
    'categoryChains'?: Array<Product202309GetProductResponseDataCategoryChains>;
    /**
    * The list of certifications for your product.
    */
    'certifications'?: Array<Product202309GetProductResponseDataCertifications>;
    /**
    * The time when the product is created. Unix timestamp.
    */
    'createTime'?: number;
    /**
    * Delivery option information.
    */
    'deliveryOptions'?: Array<Product202309GetProductResponseDataDeliveryOptions>;
    /**
    * The product description in HTML format.
    */
    'description'?: string;
    /**
    * An external identifier used in an external ecommerce platform. This is used to associate the product between TikTok Shop and the external ecommerce platform. 
    */
    'externalProductId'?: string;
    'globalProductAssociation'?: Product202309GetProductResponseDataGlobalProductAssociation;
    /**
    * The product ID generated by TikTok Shop.
    */
    'id'?: string;
    /**
    * The current status of the product on platforms that are natively integrated with TikTok Shop (e.g. TOKOPEDIA).  **Note**: For Indonesia sellers, if you did not set the listing platform as `TOKOPEDIA` when creating or editing a product, this will be omitted.
    */
    'integratedPlatformStatuses'?: Array<Product202309GetProductResponseDataIntegratedPlatformStatuses>;
    /**
    * A flag indicating whether to show the Cash On Delivery (COD) payment option during checkout. Applicable only for the following markets: - Global sellers: MY, PH, SA, TH, VN - Local sellers: ID, MY, PH, SA, TH, VN
    */
    'isCodAllowed'?: boolean;
    /**
    * A flag indicating whether the product is not for sale and only available through Gift with Purchase (GWP) promotions. Such products won\'t appear in searches or recommendations True: Not for sale False: For sale
    */
    'isNotForSale'?: boolean;
    /**
    * A flag to indicate if the product is pre-owned. Applicable only if TOKOPEDIA is the sole listing platform.  **Note**: Pre-owned products on the TikTok Shop platform are identified by the `category_id`, which must belong to one of the designated pre-owned product categories (e.g. pre-owned luxury bags, luggage, and accessories).
    */
    'isPreOwned'?: boolean;
    /**
    * The current quality tier of this product listing. The quality tier of a product listing depends on the quality of the content in its product fields such as the title, image, attributes etc.  Possible values: - POOR - FAIR - GOOD  **Note**: Available only for the US market.
    */
    'listingQualityTier'?: string;
    /**
    * A list of images to display in the product image gallery.
    */
    'mainImages'?: Array<Product202309GetProductResponseDataMainImages>;
    /**
    * The list of manufacturer IDs.  Pass this value to the `manufacturer_id` field in the [Search Manufacturers API](67066a580dcee902fa03ccf9) to obtain more information about a manufacturer.  **Note**: Applicable only for the EU market in certain categories
    */
    'manufacturerIds'?: Array<string>;
    /**
    * The minimum order quantity for the product. Valid range: [1, 20]  Applicable only for the Indonesia market and selected sellers in other SEA markets. Contact your account manager for more information about gaining access to this field.
    */
    'minimumOrderQuantity'?: number;
    'packageDimensions'?: Product202309GetProductResponseDataPackageDimensions;
    'packageWeight'?: Product202309GetProductResponseDataPackageWeight;
    'prescriptionRequirement'?: Product202309GetProductResponseDataPrescriptionRequirement;
    /**
    * A list of general attributes (e.g. manufacturer, country of origin, materials used) that describe the product as a whole, regardless of variant.
    */
    'productAttributes'?: Array<Product202309GetProductResponseDataProductAttributes>;
    /**
    * The **live** product family that this product belongs to. A product family is a virtual group of products that share common characteristics (such as flavor, version, or size), allowing them to appear as selectable variations on the product page. **Note**:  - Applicable only for US local sellers. - Omitted if this product does not belong to any product family.
    */
    'productFamilies'?: Array<Product202309GetProductResponseDataProductFamilies>;
    /**
    * The product type. Possible values: - COMBINED_PRODUCT: Indicates this is a combined listing product. - IN_COMBINED_PRODUCT: Indicates this product is part of a combined listing. - GPR_TARGET_PRODUCT: Indicates this product is synchronized to global listings. Applicable only for the EU market.
    */
    'productTypes'?: Array<string>;
    /**
    * Recommended categories for the product based on the product title, description, and images.
    */
    'recommendedCategories'?: Array<Product202309GetProductResponseDataRecommendedCategories>;
    /**
    * The list of responsible person IDs.  Pass this value to the `responsible_person_id` field in the [Search Responsible Persons API](67066a55f17b7d02f95d2fb1) to obtain more information about a responsible person.  **Note**: Applicable only for the EU market in certain categories
    */
    'responsiblePersonIds'?: Array<string>;
    /**
    * The shipping insurance purchase requirement imposed on buyers for the product.  Possible values: - REQUIRED: Shipping insurance is mandatory and buyers can\'t opt out. - OPTIONAL: Buyers can choose to purchase shipping insurance through the platform. - NOT_SUPPORTED: Shipping insurance is not supported for the product. Default: OPTIONAL  Applicable only if the listing platforms include TOKOPEDIA.
    */
    'shippingInsuranceRequirement'?: string;
    'sizeChart'?: Product202309GetProductResponseDataSizeChart;
    /**
    * A list of Stock Keeping Units (SKUs) used to identify distinct variants of the product.
    */
    'skus'?: Array<Product202309GetProductResponseDataSkus>;
    /**
    * The product status in TikTok Shop. Possible values:  - DRAFT - PENDING - FAILED - ACTIVATE - SELLER_DEACTIVATED - PLATFORM_DEACTIVATED - FREEZE - DELETED  **Note**: For Indonesia sellers, if you did not set the listing platform as `TIKTOK_SHOP` when creating or editing a product, this will be omitted.
    */
    'status'?: string;
    /**
    * The product title.
    */
    'title'?: string;
    /**
    * The time when the product is last updated. Unix timestamp.
    */
    'updateTime'?: number;
    'video'?: Product202309GetProductResponseDataVideo;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "audit",
            "baseName": "audit",
            "type": "Product202309GetProductResponseDataAudit"
        },
        {
            "name": "auditFailedReasons",
            "baseName": "audit_failed_reasons",
            "type": "Array<Product202309GetProductResponseDataAuditFailedReasons>"
        },
        {
            "name": "brand",
            "baseName": "brand",
            "type": "Product202309GetProductResponseDataBrand"
        },
        {
            "name": "categoryChains",
            "baseName": "category_chains",
            "type": "Array<Product202309GetProductResponseDataCategoryChains>"
        },
        {
            "name": "certifications",
            "baseName": "certifications",
            "type": "Array<Product202309GetProductResponseDataCertifications>"
        },
        {
            "name": "createTime",
            "baseName": "create_time",
            "type": "number"
        },
        {
            "name": "deliveryOptions",
            "baseName": "delivery_options",
            "type": "Array<Product202309GetProductResponseDataDeliveryOptions>"
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
            "name": "globalProductAssociation",
            "baseName": "global_product_association",
            "type": "Product202309GetProductResponseDataGlobalProductAssociation"
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "integratedPlatformStatuses",
            "baseName": "integrated_platform_statuses",
            "type": "Array<Product202309GetProductResponseDataIntegratedPlatformStatuses>"
        },
        {
            "name": "isCodAllowed",
            "baseName": "is_cod_allowed",
            "type": "boolean"
        },
        {
            "name": "isNotForSale",
            "baseName": "is_not_for_sale",
            "type": "boolean"
        },
        {
            "name": "isPreOwned",
            "baseName": "is_pre_owned",
            "type": "boolean"
        },
        {
            "name": "listingQualityTier",
            "baseName": "listing_quality_tier",
            "type": "string"
        },
        {
            "name": "mainImages",
            "baseName": "main_images",
            "type": "Array<Product202309GetProductResponseDataMainImages>"
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
            "type": "Product202309GetProductResponseDataPackageDimensions"
        },
        {
            "name": "packageWeight",
            "baseName": "package_weight",
            "type": "Product202309GetProductResponseDataPackageWeight"
        },
        {
            "name": "prescriptionRequirement",
            "baseName": "prescription_requirement",
            "type": "Product202309GetProductResponseDataPrescriptionRequirement"
        },
        {
            "name": "productAttributes",
            "baseName": "product_attributes",
            "type": "Array<Product202309GetProductResponseDataProductAttributes>"
        },
        {
            "name": "productFamilies",
            "baseName": "product_families",
            "type": "Array<Product202309GetProductResponseDataProductFamilies>"
        },
        {
            "name": "productTypes",
            "baseName": "product_types",
            "type": "Array<string>"
        },
        {
            "name": "recommendedCategories",
            "baseName": "recommended_categories",
            "type": "Array<Product202309GetProductResponseDataRecommendedCategories>"
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
            "type": "Product202309GetProductResponseDataSizeChart"
        },
        {
            "name": "skus",
            "baseName": "skus",
            "type": "Array<Product202309GetProductResponseDataSkus>"
        },
        {
            "name": "status",
            "baseName": "status",
            "type": "string"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "updateTime",
            "baseName": "update_time",
            "type": "number"
        },
        {
            "name": "video",
            "baseName": "video",
            "type": "Product202309GetProductResponseDataVideo"
        }    ];

    static getAttributeTypeMap() {
        return Product202309GetProductResponseData.attributeTypeMap;
    }
}

