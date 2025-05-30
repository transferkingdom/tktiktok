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
      alert('Lütfen variant adı ve yeni fiyat değerini girin');
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
      alert('Seçili ürünlerde belirtilen variant bulunamadı');
      return;
    }

    onUpdatePrices(updates);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seç</th>
            <th>Ürün Adı</th>
            <th>Variantlar</th>
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
          Önceki
        </button>
        <span>
          Sayfa {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </button>
      </div>

      <div className={styles.updateForm}>
        <div>
          <label>Variant Adı:</label>
          <input
            type="text"
            value={targetVariant}
            onChange={(e) => setTargetVariant(e.target.value)}
            placeholder="Örn: Unisex - S & M ( 10\" )"
          />
        </div>
        <div>
          <label>Yeni Fiyat:</label>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Örn: 8.00"
            step="0.01"
          />
        </div>
        <button 
          onClick={handleUpdate}
          disabled={selectedItems.size === 0 || !targetVariant || !newPrice}
        >
          Seçili Ürünleri Güncelle ({selectedItems.size})
        </button>
      </div>
    </div>
  );
} 