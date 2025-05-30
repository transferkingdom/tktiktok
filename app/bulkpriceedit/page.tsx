'use client'

import { useState, useEffect } from 'react'
import ProductTable from '../components/ProductTable'
import styles from './page.module.css'

interface SearchParams {
  attributeName?: string;
  attributeValue?: string;
}

export default function BulkPriceEdit() {
  const [products, setProducts] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useState<SearchParams>({
    attributeName: 'Size',
    attributeValue: ''
  })

  const fetchProducts = async (pageToken?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (pageToken) {
        params.append('page_token', pageToken)
      }
      if (searchParams.attributeName && searchParams.attributeValue) {
        params.append('attribute_name', searchParams.attributeName)
        params.append('attribute_value', searchParams.attributeValue)
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
      <h1 className={styles.title}>Toplu Fiyat Güncelleme</h1>
      
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Özellik
          </label>
          <select 
            value={searchParams.attributeName}
            onChange={(e) => setSearchParams(prev => ({ ...prev, attributeName: e.target.value }))}
            className={styles.select}
          >
            <option value="Size">Size</option>
            <option value="Style">Style</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Değer
          </label>
          <input
            type="text"
            value={searchParams.attributeValue}
            onChange={(e) => setSearchParams(prev => ({ ...prev, attributeValue: e.target.value }))}
            placeholder='Örn: Unisex - S & M ( 10" )'
            className={styles.input}
          />
        </div>

        <button 
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Aranıyor...' : 'Ara'}
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