'use client'

import { useState, useEffect } from 'react'
import ProductTable from '../components/ProductTable'

export default function BulkEdit() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/get-products')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.error || 'Error loading products')
      }
    } catch (err) {
      setError('Error loading products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrices = async (updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}>) => {
    try {
      setUpdateStatus('Updating prices...')
      
      const response = await fetch('/api/bulk-update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setUpdateStatus(`Success! ${data.results.success} products updated.`)
        // Refresh products list
        fetchProducts()
      } else {
        setUpdateStatus(`Error: ${data.error}`)
      }
    } catch (err) {
      setUpdateStatus('Error updating prices')
      console.error('Error updating prices:', err)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>TikTok Shop Price Updater</h1>
      
      {updateStatus && (
        <div style={{ 
          padding: '12px', 
          margin: '12px 0', 
          background: updateStatus.includes('Success') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (updateStatus.includes('Success') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: '4px'
        }}>
          {updateStatus}
        </div>
      )}

      <ProductTable 
        products={products} 
        onUpdatePrices={handleUpdatePrices}
      />
    </div>
  )
} 