'use client'

import { useState, useEffect } from 'react'

interface PriceRule {
  variant: string
  price: string
}

interface ProductVariant {
  id: string
  seller_sku: string
  title: string
  price: {
    original: string
    sale: string
  }
  quantity: number
  attributes: Array<{
    attribute_name: string
    value_name: string
  }>
}

interface Product {
  id: string
  name: string
  status: string
  description: string
  category: string
  variants: ProductVariant[]
}

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [priceRules, setPriceRules] = useState<PriceRule[]>([])
  const [refreshTokenLoading, setRefreshTokenLoading] = useState<boolean>(false)
  
  // Product management states
  const [productId, setProductId] = useState<string>('1730973647867908687')
  const [product, setProduct] = useState<Product | null>(null)
  const [productLoading, setProductLoading] = useState<boolean>(false)
  const [editingVariants, setEditingVariants] = useState<Record<string, string>>({})
  const [updatingPrices, setUpdatingPrices] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Check authorization status from server
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        console.log('Auth status check:', data)
        
        if (data.authorized) {
          console.log('✅ User is authorized')
          setIsAuthorized(true)
        } else {
          console.log('❌ User not authorized')
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthorized(false)
      }
    }
    
    // Log URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    console.log('=== Frontend URL Parameters ===')
    urlParams.forEach((value: string, key: string) => {
      console.log(`${key}: ${value}`)
    })
    
    // If success parameter exists, wait a bit and check auth status
    if (urlParams.get('success') === 'authorized') {
      console.log('✅ Authorization redirect detected, checking status...')
      setTimeout(checkAuthStatus, 1000) // Wait 1 second
    } else {
      checkAuthStatus()
    }
    
    // Error handling
    const error = urlParams.get('error')
    if (error) {
      console.log('Authorization error:', error)
      const debug = urlParams.get('debug')
      const details = urlParams.get('details')
      const message = urlParams.get('message')
      
      if (debug) {
        console.log('Debug info:', JSON.parse(decodeURIComponent(debug)))
      }
      if (details) {
        console.log('Error details:', JSON.parse(decodeURIComponent(details)))
      }
      if (message) {
        console.log('Error message:', decodeURIComponent(message))
      }
      
      alert(`Authorization failed: ${error}\nCheck console for details.`)
    }
  }, [])

  const handleAuthorize = () => {
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || 'YOUR_CLIENT_KEY'
    const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    const scope = 'user.info.basic'
    
    // TikTok OAuth URL - using normal TikTok endpoint (same for TikTok Shop)
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=tiktok_shop_auth`
    
    window.location.href = authUrl
  }

  const handleRefreshToken = async () => {
    setRefreshTokenLoading(true)
    try {
      console.log('🔄 Refreshing access token...')
      
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      console.log('🔄 Refresh token response:', result)
      
      if (response.ok && result.success) {
        console.log('✅ Token refresh successful!')
        console.log('📦 New token info:', result.data)
        
        alert(`Token Refresh Successful!\n\nNew access token generated\nExpires: ${new Date(result.data.access_token_expire_in * 1000).toLocaleString()}\n\nYou can now fetch products!`)
      } else {
        console.error('❌ Token refresh failed:', result)
        alert(`Token refresh failed: ${result.error || 'Unknown error'}\n\nCheck console for details.`)
      }
    } catch (error) {
      console.error('💥 Error refreshing token:', error)
      alert('Error refreshing token')
    } finally {
      setRefreshTokenLoading(false)
    }
  }

  const handleGetProduct = async () => {
    if (!productId.trim()) {
      alert('Please enter a product ID')
      return
    }

    setProductLoading(true)
    setProduct(null)
    
    try {
      console.log('📦 Fetching product:', productId)
      
      const response = await fetch('/api/get-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId.trim() }),
      })
      
      const result = await response.json()
      
      console.log('📦 Get product response:', result)
      
      if (response.ok && result.success) {
        console.log('✅ Product fetched successfully!')
        console.log('📋 Product details:', result.product)
        
        setProduct(result.product)
        
        // Initialize editing prices with current prices
        const initialPrices: Record<string, string> = {}
        result.product.variants.forEach((variant: ProductVariant) => {
          initialPrices[variant.id] = variant.price.original
        })
        setEditingVariants(initialPrices)
        
      } else {
        console.error('❌ Get product failed:', result)
        alert(`Failed to get product: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error fetching product:', error)
      alert('Error fetching product')
    } finally {
      setProductLoading(false)
    }
  }

  const handlePriceChange = (variantId: string, newPrice: string) => {
    setEditingVariants(prev => ({
      ...prev,
      [variantId]: newPrice
    }))
  }

  const handleUpdatePrice = async (variant: ProductVariant) => {
    const newPrice = editingVariants[variant.id]
    
    if (!newPrice || newPrice === variant.price.original) {
      return
    }

    setUpdatingPrices(prev => ({ ...prev, [variant.id]: true }))
    
    try {
      console.log('💰 Updating price for variant:', variant.seller_sku)
      
      const response = await fetch('/api/update-product-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product?.id,
          variantId: variant.id, 
          newPrice: newPrice 
        }),
      })
      
      const result = await response.json()
      
      console.log('💰 Update price response:', result)
      
      if (response.ok && result.success) {
        console.log('✅ Price updated successfully!')
        
        // Update the product data with new price
        if (product) {
          const updatedProduct = {
            ...product,
            variants: product.variants.map(v => 
              v.id === variant.id 
                ? { ...v, price: { original: newPrice, sale: newPrice } }
                : v
            )
          }
          setProduct(updatedProduct)
        }
        
        alert(`Price updated successfully!\n\nVariant: ${variant.seller_sku}\nNew Price: $${newPrice}`)
      } else {
        console.error('❌ Price update failed:', result)
        alert(`Failed to update price: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error updating price:', error)
      alert('Error updating price')
    } finally {
      setUpdatingPrices(prev => ({ ...prev, [variant.id]: false }))
    }
  }

  const addPriceRule = () => {
    setPriceRules([...priceRules, { variant: '', price: '' }])
  }

  const updatePriceRule = (index: number, field: keyof PriceRule, value: string) => {
    const newRules = [...priceRules]
    newRules[index] = { ...newRules[index], [field]: value }
    setPriceRules(newRules)
  }

  const removePriceRule = (index: number) => {
    const newRules = priceRules.filter((_, i) => i !== index)
    setPriceRules(newRules)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TikTok Shop Price Updater
          </h1>
          <p className="text-gray-600">
            Fetch real product data and update prices efficiently
          </p>
        </div>

        {!isAuthorized ? (
          <div className="card text-center">
            <h2 className="text-xl font-semibold mb-4">
              Authorize TikTok Shop Access
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your TikTok Shop account to manage product pricing
            </p>
            <button
              onClick={handleAuthorize}
              className="btn-primary text-lg px-8 py-3"
            >
              Connect TikTok Shop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Token Management */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Token Management</h2>
              <button
                onClick={handleRefreshToken}
                disabled={refreshTokenLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
              >
                {refreshTokenLoading ? 'Refreshing Token...' : '🔄 Refresh Access Token'}
              </button>
            </div>

            {/* Product Fetch */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Fetch Product Information</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleGetProduct}
                  disabled={productLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 px-6 py-2"
                >
                  {productLoading ? 'Fetching...' : '📦 Get Product'}
                </button>
              </div>
            </div>

            {/* Product Details & Price Editing */}
            {product && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Product Details & Price Editing</h2>
                </div>
                
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> {product.id}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {product.status}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {product.category || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Variants:</span> {product.variants.length}
                    </div>
                  </div>
                </div>

                {/* Variants Table - Similar to TikTok Shop */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {variant.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {variant.seller_sku}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${variant.price.original}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.01"
                              value={editingVariants[variant.id] || variant.price.original}
                              onChange={(e) => handlePriceChange(variant.id, e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {variant.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleUpdatePrice(variant)}
                              disabled={
                                updatingPrices[variant.id] || 
                                !editingVariants[variant.id] ||
                                editingVariants[variant.id] === variant.price.original
                              }
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingPrices[variant.id] ? 'Updating...' : 'Update'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Legacy Price Rules - Keep for batch updates */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Bulk Price Rules</h2>
              <p className="text-gray-600 mb-4">
                Set pricing rules based on variant titles
              </p>
              
              <div className="space-y-4">
                {priceRules.map((rule, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Variant title (e.g., 'Small', 'Large')"
                      value={rule.variant}
                      onChange={(e) => updatePriceRule(index, 'variant', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={rule.price}
                      onChange={(e) => updatePriceRule(index, 'price', e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removePriceRule(index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addPriceRule}
                  className="btn-secondary"
                >
                  Add Price Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 