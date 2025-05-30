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
        setError(data.error || 'Ürünler yüklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePrices = async (updates: Array<{productId: string, skuId: string, variantName: string, newPrice: string}>) => {
    try {
      setUpdateStatus('Fiyatlar güncelleniyor...')
      
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
        setUpdateStatus(`Başarılı! ${data.results.success} ürün güncellendi.`)
        // Refresh products list
        fetchProducts()
      } else {
        setUpdateStatus(`Hata: ${data.error}`)
      }
    } catch (err) {
      setUpdateStatus('Fiyat güncellenirken bir hata oluştu')
      console.error('Error updating prices:', err)
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  if (error) {
    return <div>Hata: {error}</div>
  }

  return (
    <div>
      <h1>TikTok Shop Fiyat Güncelleme</h1>
      
      {updateStatus && (
        <div style={{ 
          padding: '12px', 
          margin: '12px 0', 
          background: updateStatus.includes('Başarılı') ? '#d4edda' : '#f8d7da',
          border: '1px solid ' + (updateStatus.includes('Başarılı') ? '#c3e6cb' : '#f5c6cb'),
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
} 