import { useState } from 'react';
import styles from './ProductTable.module.css';

interface Price {
  currency: string;
  original: string;
  sale: string;
}

interface SalesAttribute {
  name: string;
  value_name: string;
}

interface Variant {
  id: string;
  seller_sku: string;
  title: string;
  sales_attributes: SalesAttribute[];
  price: Price;
  inventory: number;
}

interface Product {
  id: string;
  name: string;
  status: string;
  create_time: number;
  update_time: number;
  variants: Variant[];
}

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  nextPageToken?: string;
  onUpdatePrices: (updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}>) => void;
  onLoadMore: (pageToken: string) => void;
}

export default function ProductTable({ products, totalCount, nextPageToken, onUpdatePrices, onLoadMore }: ProductTableProps) {
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [newPrice, setNewPrice] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVariants(new Set());
    } else {
      const allVariantIds = products.flatMap(product => 
        product.variants.map(variant => variant.id)
      );
      setSelectedVariants(new Set(allVariantIds));
    }
    setSelectAll(!selectAll);
  };

  const handleVariantSelect = (variantId: string) => {
    const newSelected = new Set(selectedVariants);
    if (newSelected.has(variantId)) {
      newSelected.delete(variantId);
      setSelectAll(false);
    } else {
      newSelected.add(variantId);
      // Check if all variants are now selected
      const allVariantIds = products.flatMap(product => 
        product.variants.map(variant => variant.id)
      );
      if (allVariantIds.every(id => newSelected.has(id))) {
        setSelectAll(true);
      }
    }
    setSelectedVariants(newSelected);
  };

  const handleUpdatePrices = () => {
    if (!newPrice || selectedVariants.size === 0) return;

    const updates = Array.from(selectedVariants).map(variantId => {
      const product = products.find(p => 
        p.variants.some(v => v.id === variantId)
      );
      const variant = product?.variants.find(v => v.id === variantId);
      
      return {
        productId: product!.id,
        skuId: variantId,
        variantName: variant!.title,
        newPrice: newPrice
      };
    });

    onUpdatePrices(updates);
    setNewPrice('');
    setSelectedVariants(new Set());
    setSelectAll(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getAttributeValue = (variant: Variant, name: string) => {
    return variant.sales_attributes.find(attr => attr.name === name)?.value_name || '-';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Ürünler ({totalCount})</h2>
        <div className={styles.actions}>
          <input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Yeni fiyat"
            className={styles.priceInput}
          />
          <button 
            onClick={handleUpdatePrices}
            disabled={!newPrice || selectedVariants.size === 0}
            className={styles.updateButton}
          >
            Fiyatları Güncelle ({selectedVariants.size})
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Ürün Adı</th>
              <th>Durum</th>
              <th>Son Güncelleme</th>
              <th>SKU</th>
              <th>Özellikler</th>
              <th>Fiyat</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              product.variants.map((variant, variantIndex) => (
                <tr key={variant.id} className={variantIndex === 0 ? styles.firstVariant : ''}>
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedVariants.has(variant.id)}
                      onChange={() => handleVariantSelect(variant.id)}
                    />
                  </td>
                  {variantIndex === 0 && (
                    <>
                      <td rowSpan={product.variants.length}>{product.name}</td>
                      <td rowSpan={product.variants.length}>{product.status}</td>
                      <td rowSpan={product.variants.length}>{formatDate(product.update_time)}</td>
                    </>
                  )}
                  <td>{variant.seller_sku}</td>
                  <td>
                    <ul className={styles.variantList}>
                      {variant.sales_attributes.map(attr => (
                        <li key={attr.name}>
                          <strong>{attr.name}:</strong> {attr.value_name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{variant.price.currency} {variant.price.sale}</td>
                  <td>{variant.inventory}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {nextPageToken && (
        <div className={styles.loadMore}>
          <button onClick={() => onLoadMore(nextPageToken)}>
            Daha Fazla Yükle
          </button>
        </div>
      )}
    </div>
  );
} 