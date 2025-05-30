import { useState } from 'react';
import styles from './ProductTable.module.css';

interface Product {
  id: string;
  name: string;
  variants: Array<{
    id: string;
    seller_sku: string;
    title: string;
    price: {
      original: string;
      sale: string;
    }
  }>;
}

interface ProductTableProps {
  products: Product[];
  onUpdatePrices: (updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}>) => void;
}

export default function ProductTable({ products, onUpdatePrices }: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [targetVariant, setTargetVariant] = useState('');
  const [newPrice, setNewPrice] = useState('');
  
  const itemsPerPage = 40;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Get current page items
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Product Name</th>
            <th>Variants</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.has(product.id)}
                  onChange={(e) => handleSelect(product.id, e.target.checked)}
                />
              </td>
              <td>{product.name}</td>
              <td>
                <ul className={styles.variantList}>
                  {product.variants.map(variant => (
                    <li key={variant.id}>
                      {variant.title} - ${variant.price.sale}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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