import { useState } from 'react';
import styles from './ProductTable.module.css';

interface Price {
  currency: string;
  original: string;
  sale: string;
}

interface Variant {
  id: string;
  seller_sku: string;
  title: string;
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
  onLoadMore: (pageToken: string) => Promise<void>;
}

export default function ProductTable({ 
  products, 
  totalCount,
  nextPageToken,
  onUpdatePrices,
  onLoadMore 
}: ProductTableProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [targetVariant, setTargetVariant] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handle checkbox changes
  const handleSelect = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedItems(newSelected);
  };

  // Handle bulk update
  const handleUpdate = () => {
    if (!targetVariant || !newPrice) {
      alert('Please enter variant name and new price');
      return;
    }

    const updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}> = [];
    
    selectedItems.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.variants.forEach(variant => {
          if (variant.title.includes(targetVariant)) {
            updates.push({
              productId: product.id,
              skuId: variant.id,
              variantName: variant.title,
              newPrice: newPrice
            });
          }
        });
      }
    });

    if (updates.length === 0) {
      alert('No matching variants found in selected products');
      return;
    }

    onUpdatePrices(updates);
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (!nextPageToken || loading) return;
    
    try {
      setLoading(true);
      await onLoadMore(nextPageToken);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Products ({totalCount})</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Product Name</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Variants</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.has(product.id)}
                  onChange={(e) => handleSelect(product.id, e.target.checked)}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.status}</td>
              <td>{new Date(product.update_time * 1000).toLocaleString()}</td>
              <td>
                <ul className={styles.variantList}>
                  {product.variants.map(variant => (
                    <li key={variant.id}>
                      {variant.title} - {variant.price.currency} {variant.price.sale} 
                      {variant.inventory !== undefined && ` (Stock: ${variant.inventory})`}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nextPageToken && (
        <div className={styles.loadMore}>
          <button 
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <div className={styles.updateForm}>
        <div>
          <label>Variant Name:</label>
          <input
            type="text"
            value={targetVariant}
            onChange={(e) => setTargetVariant(e.target.value)}
            placeholder={'Example: Unisex - S & M ( 10" )'}
          />
        </div>
        <div>
          <label>New Price:</label>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Example: 8.00"
            step="0.01"
          />
        </div>
        <button 
          onClick={handleUpdate}
          disabled={selectedItems.size === 0 || !targetVariant || !newPrice}
        >
          Update Selected Products ({selectedItems.size})
        </button>
      </div>
    </div>
  );
} 