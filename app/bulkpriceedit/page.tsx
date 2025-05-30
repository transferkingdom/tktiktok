'use client'

import { useState, useEffect } from 'react'
import ProductTable from '../components/ProductTable'
import styles from './page.module.css'

interface SearchParams {
  searchType: 'price' | 'sku';
  price?: string;
  sku?: string;
}

export default function BulkPriceEdit() {
  const [products, setProducts] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchType: 'price',
    price: '',
    sku: ''
  })

  const fetchProducts = async (pageToken?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (pageToken) {
        params.append('page_token', pageToken)
      }
      
      if (searchParams.searchType === 'price' && searchParams.price) {
        params.append('price', searchParams.price)
      } else if (searchParams.searchType === 'sku' && searchParams.sku) {
        params.append('sku', searchParams.sku)
      }

      const response = await fetch(`/api/get-products?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      if (pageToken) {
        setProducts(prev => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }
      
      setTotalCount(data.total_count)
      setNextPageToken(data.next_page_token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleUpdatePrices = async (updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}>) => {
    try {
      const response = await fetch('/api/bulk-update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to update prices')
      }

      // Refresh the product list
      fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prices')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bulk Price Update</h1>
      
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Search Type
          </label>
          <select 
            value={searchParams.searchType}
            onChange={(e) => setSearchParams(prev => ({ 
              ...prev, 
              searchType: e.target.value as 'price' | 'sku',
              price: '',
              sku: ''
            }))}
            className={styles.select}
          >
            <option value="price">Price</option>
            <option value="sku">SKU</option>
          </select>
        </div>
        
        {searchParams.searchType === 'price' ? (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={searchParams.price}
              onChange={(e) => setSearchParams(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g. 4.25"
              className={styles.input}
            />
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              SKU
            </label>
            <input
              type="text"
              value={searchParams.sku}
              onChange={(e) => setSearchParams(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="e.g. TKN1766"
              className={styles.input}
            />
          </div>
        )}

        <button 
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <ProductTable
        products={products}
        totalCount={totalCount}
        nextPageToken={nextPageToken}
        onUpdatePrices={handleUpdatePrices}
        onLoadMore={(pageToken) => fetchProducts(pageToken)}
      />
    </div>
  )
} 