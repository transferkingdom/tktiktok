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
import { Product202309InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistribution } from './InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistribution';
import { Product202309InventorySearchResponseDataInventorySkusWarehouseInventory } from './InventorySearchResponseDataInventorySkusWarehouseInventory';

export class Product202309InventorySearchResponseDataInventorySkus {
    /**
    * The SKU ID generated by TikTok Shop.
    */
    'id'?: string;
    /**
    * An internal code/name for managing SKUs, not visible to buyers.
    */
    'sellerSku'?: string;
    'totalAvailableInventoryDistribution'?: Product202309InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistribution;
    /**
    * The total number of units available for ordering across all warehouses. It is the sum of the `warehouse_inventory.available_quantity` values in all warehouses. 
    */
    'totalAvailableQuantity'?: number;
    /**
    * The total number of units reserved by existing customer orders across all warehouses (and therefore not available for ordering). It is the sum of the `warehouse_inventory.committed_quantity` values in all warehouses.
    */
    'totalCommittedQuantity'?: number;
    /**
    * SKU warehouse inventory information.
    */
    'warehouseInventory'?: Array<Product202309InventorySearchResponseDataInventorySkusWarehouseInventory>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "sellerSku",
            "baseName": "seller_sku",
            "type": "string"
        },
        {
            "name": "totalAvailableInventoryDistribution",
            "baseName": "total_available_inventory_distribution",
            "type": "Product202309InventorySearchResponseDataInventorySkusTotalAvailableInventoryDistribution"
        },
        {
            "name": "totalAvailableQuantity",
            "baseName": "total_available_quantity",
            "type": "number"
        },
        {
            "name": "totalCommittedQuantity",
            "baseName": "total_committed_quantity",
            "type": "number"
        },
        {
            "name": "warehouseInventory",
            "baseName": "warehouse_inventory",
            "type": "Array<Product202309InventorySearchResponseDataInventorySkusWarehouseInventory>"
        }    ];

    static getAttributeTypeMap() {
        return Product202309InventorySearchResponseDataInventorySkus.attributeTypeMap;
    }
}

