'use client'

import { useState, useCallback } from 'react'
import styles from './page.module.css'

interface Sku {
  product_id: string
  sku_id: string
  seller_sku: string
  title: string
  price: string
}

const MAX_SELECTION = 100 // Maximum number of SKUs that can be selected at once

export default function BulkPriceEdit() {
  const [searchPrice, setSearchPrice] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [error, setError] = useState('')
  const [skus, setSkus] = useState<Sku[]>([])
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set())
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleSearch = async (e: React.FormEvent, isLoadMore = false) => {
    e.preventDefault()
    
    if (!searchPrice) {
      setError('Please enter a price to search')
      return
    }

    setError('')
    setSearching(true)

    try {
      const formattedPrice = Number(searchPrice).toFixed(2)
      
      const response = await fetch('/api/search-by-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchPrice: formattedPrice,
          pageToken: isLoadMore ? nextPageToken : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during search')
      }

      if (!isLoadMore) {
        setSkus(data.skus)
        setSelectedSkus(new Set()) // Clear selections on new search
      } else {
        setSkus(prev => [...prev, ...data.skus])
      }
      
      setTotalCount(data.total)
      setHasNextPage(data.hasNextPage)
      setNextPageToken(data.nextPageToken)
    } catch (error) {
      console.error('Search error:', error)
      setError(error instanceof Error ? error.message : 'Failed to search')
      setSkus([])
      setHasNextPage(false)
      setNextPageToken(null)
    } finally {
      setSearching(false)
    }
  }

  const loadMore = useCallback((e: React.MouseEvent) => {
    if (!hasNextPage || searching) return
    handleSearch(e as any, true)
  }, [hasNextPage, searching, nextPageToken])

  const handleUpdatePrices = async () => {
    if (!newPrice || selectedSkus.size === 0) return

    setError('')
    setUpdating(true)

    try {
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

      setError('✅ Prices updated successfully!')
      setSelectedSkus(new Set())
      setNewPrice('')

      // Refresh the search results after a short delay
      setTimeout(() => {
        handleSearch(new Event('submit') as any)
      }, 2000)
    } catch (error) {
      console.error('Update error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update prices')
    } finally {
      setUpdating(false)
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (skus.length > MAX_SELECTION) {
        setError(`You can select maximum ${MAX_SELECTION} SKUs at once`)
        return
      }
      setSelectedSkus(new Set(skus.map(sku => sku.sku_id)))
    } else {
      setSelectedSkus(new Set())
    }
  }

  const handleSelectSku = (skuId: string) => {
    const newSelected = new Set(selectedSkus)
    if (newSelected.has(skuId)) {
      newSelected.delete(skuId)
      setSelectedSkus(newSelected)
    } else {
      if (newSelected.size >= MAX_SELECTION) {
        setError(`You can select maximum ${MAX_SELECTION} SKUs at once`)
        return
      }
      newSelected.add(skuId)
      setSelectedSkus(newSelected)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TikTok Shop Price Updater</h1>
      
      <div className={styles.section}>
        <h2 className={styles.subtitle}>Bulk Price Update</h2>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Search Price:</label>
            <input
              type="number"
              step="0.01"
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              placeholder="e.g. 4.25"
              className={styles.input}
              min="0"
              required
            />
            <button type="submit" className={styles.button} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className={styles.inputGroup}>
          <label className={styles.label}>New Price for Selected SKUs:</label>
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
            disabled={updating || selectedSkus.size === 0 || !newPrice}
          >
            {updating ? 'Updating...' : 'Update Prices'}
          </button>
        </div>

        {error && (
          <div className={error.startsWith('✅') ? styles.success : styles.error}>
            {error}
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={skus.length > 0 && selectedSkus.size === skus.length}
                    disabled={skus.length > MAX_SELECTION}
                  />
                </th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Current Price</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={sku.sku_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSkus.has(sku.sku_id)}
                      onChange={() => handleSelectSku(sku.sku_id)}
                      disabled={!selectedSkus.has(sku.sku_id) && selectedSkus.size >= MAX_SELECTION}
                    />
                  </td>
                  <td>{sku.title}</td>
                  <td>{sku.seller_sku}</td>
                  <td>${sku.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasNextPage && (
          <div className={styles.loadMore}>
            <button onClick={loadMore} className={styles.loadMoreButton} disabled={searching}>
              {searching ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {skus.length > 0 && (
          <div className={styles.summary}>
            Found {totalCount} total SKUs with price ${searchPrice}
            {selectedSkus.size > 0 && ` (${selectedSkus.size} selected)`}
          </div>
        )}
      </div>
    </div>
  )
} 