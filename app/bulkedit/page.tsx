'use client'

import { useState, useEffect } from 'react'
import ProductTable from '../components/ProductTable'

interface Product {
  id: string;
  name: string;
  status: string;
  create_time: number;
  update_time: number;
  variants: Array<{
    id: string;
    seller_sku: string;
    title: string;
    sales_attributes: Array<{
      name: string;
      value_name: string;
    }>;
    price: {
      currency: string;
      original: string;
      sale: string;
    };
    inventory: number;
  }>;
}

export default function BulkEdit() {
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [nextPageToken, setNextPageToken] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (pageToken?: string) => {
    try {
      const url = new URL('/api/get-products', window.location.origin)
      if (pageToken) {
        url.searchParams.set('page_token', pageToken)
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        if (pageToken) {
          // Append new products to existing list
          setProducts(prev => [...prev, ...data.products])
        } else {
          // Replace products list
          setProducts(data.products)
        }
        setTotalCount(data.total_count)
        setNextPageToken(data.next_page_token)
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

  const handleLoadMore = async (pageToken: string) => {
    await fetchProducts(pageToken)
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

  if (loading && products.length === 0) {
    return <div>Loading...</div>
  }

  if (error && products.length === 0) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">TikTok Shop Price Updater</h1>
      
      {updateStatus && (
        <div className={`p-4 mb-6 rounded-lg ${
          updateStatus.includes('Success') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {updateStatus}
        </div>
      )}

      <ProductTable 
        products={products}
        totalCount={totalCount}
        nextPageToken={nextPageToken}
        onUpdatePrices={handleUpdatePrices}
        onLoadMore={handleLoadMore}
      />
    </div>
  )
} 