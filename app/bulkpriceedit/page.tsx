'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Sku {
  product_id: string
  product_name: string
  sku_id: string
  seller_sku: string
  price: string
}

export default function BulkPriceEdit() {
  const [searchPrice, setSearchPrice] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skus, setSkus] = useState<Sku[]>([])
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 40

  const handleSearch = async (e: React.FormEvent, page = 1) => {
    e.preventDefault()
    
    if (!searchPrice) {
      setError('Please enter a price to search')
      return
    }

    setError('')
    setLoading(true)

    try {
      const formattedPrice = Number(searchPrice).toFixed(2)
      
      const response = await fetch('/api/search-by-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          searchPrice: formattedPrice,
          page: page,
          pageSize: itemsPerPage
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during search')
      }

      if (data.skus.length === 0) {
        setError(`No SKUs found with price $${formattedPrice}`)
      }

      setSkus(data.skus)
      setCurrentPage(page)
      setTotalPages(Math.ceil(data.total / itemsPerPage))
      setSelectedSkus(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrices = async () => {
    if (!newPrice || selectedSkus.size === 0) return

    setError('')
    setLoading(true)

    try {
      // Format the new price to 2 decimal places
      const formattedNewPrice = Number(newPrice).toFixed(2)
      
      const skusToUpdate = skus.filter(sku => selectedSkus.has(sku.sku_id))
      const response = await fetch('/api/bulk-update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skusToUpdate: skusToUpdate.map(sku => ({
            productId: sku.product_id,
            skuId: sku.sku_id,
            newPrice: formattedNewPrice
          }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during price update')
      }

      // Show success message
      setError('Prices updated successfully!')
      
      // Clear selections
      setSelectedSkus(new Set())
      setNewPrice('')

      // Refresh the search results after a short delay
      setTimeout(() => {
        handleSearch(new Event('submit') as any)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSkus(new Set(skus.map(sku => sku.sku_id)))
    } else {
      setSelectedSkus(new Set())
    }
  }

  const toggleSelectSku = (skuId: string) => {
    const newSelected = new Set(selectedSkus)
    if (newSelected.has(skuId)) {
      newSelected.delete(skuId)
    } else {
      newSelected.add(skuId)
    }
    setSelectedSkus(newSelected)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bulk Price Update</h1>
      
      <div className={styles.actions}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Search Price:</label>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                step="0.01"
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                placeholder="e.g. 3.50"
                className={styles.input}
                min="0"
                required
              />
              <button type="submit" className={styles.button} disabled={loading || !searchPrice}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        <div className={styles.updateForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>New Price for Selected SKUs:</label>
            <div className={styles.inputGroup}>
              <input 
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="New price"
                className={styles.input}
                min="0"
              />
              <button 
                onClick={handleUpdatePrices} 
                className={styles.button} 
                disabled={loading || selectedSkus.size === 0 || !newPrice}
              >
                {loading ? 'Updating...' : 'Update Prices'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.results}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  checked={selectedSkus.size === skus.length && skus.length > 0}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Current Price</th>
            </tr>
          </thead>
          <tbody>
            {skus.map(sku => (
              <tr key={sku.sku_id}>
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedSkus.has(sku.sku_id)}
                    onChange={() => toggleSelectSku(sku.sku_id)}
                  />
                </td>
                <td>{sku.product_name}</td>
                <td>{sku.seller_sku}</td>
                <td>${Number(sku.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <button
                onClick={(e) => handleSearch(e, currentPage - 1)}
                className={styles.pageButton}
                disabled={loading}
              >
                Previous
              </button>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={(e) => handleSearch(e, page)}
                className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                disabled={loading}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={(e) => handleSearch(e, currentPage + 1)}
                className={styles.pageButton}
                disabled={loading}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 