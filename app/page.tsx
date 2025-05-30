'use client'

import { useState, useEffect } from 'react'
import TiktokAuthButton from './components/TiktokAuthButton'
import ProductVariant from './components/ProductVariant'

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
  const [productId, setProductId] = useState<string>('')
  const [product, setProduct] = useState<any>(null)
  const [productLoading, setProductLoading] = useState<boolean>(false)
  const [editingVariants, setEditingVariants] = useState<Record<string, string>>({})
  const [updatingPrices, setUpdatingPrices] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)

  const [shops, setShops] = useState<any[]>([])

  useEffect(() => {
    // Check authorization status from server
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        console.log('Auth status check:', data)
        
        if (data.authorized) {
          console.log('✅ User is authorized')
          console.log('Auth type:', data.auth_type)
          console.log('Token type:', data.token_type)
          
          if (data.warning) {
            console.warn('⚠️ Auth warning:', data.warning)
          }
          
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
    
    // Check for different success types
    const successType = urlParams.get('success')
    if (successType === 'tiktok_shop_authorized') {
      console.log('✅ TikTok Shop Partner authorization redirect detected, checking status...')
      setTimeout(checkAuthStatus, 1000)
    } else if (successType === 'authorized') {
      console.log('✅ Legacy authorization redirect detected, checking status...')
      setTimeout(checkAuthStatus, 1000)
    } else {
      checkAuthStatus()
    }
    
    // Check URL parameters for errors
    const errorParam = urlParams.get('error')
    const detailsParam = urlParams.get('details')

    if (errorParam) {
      setError(errorParam)
      if (detailsParam) {
        try {
          const decodedDetails = decodeURIComponent(detailsParam)
          setDetails(decodedDetails)
        } catch (e) {
          setDetails(detailsParam)
        }
      }
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

  const handleTikTokShopAuth = () => {
    // Direct to TikTok Shop Partner authorization endpoint
    window.location.href = '/api/auth/tiktok-shop'
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

  const handleDebugToken = async () => {
    try {
      console.log('🔍 Getting debug token info...')
      
      const response = await fetch('/api/debug-token')
      const result = await response.json()
      
      console.log('🔍 Debug token response:', result)
      
      if (response.ok && result.success) {
        const info = result.token_info
        alert(`Debug Token Information:

Access Token: ${info.access_token_present ? '✅ Present' : '❌ Missing'}
Preview: ${info.access_token_preview || 'N/A'}
Length: ${info.access_token_length}

Refresh Token: ${info.refresh_token_present ? '✅ Present' : '❌ Missing'}

Shop ID (Cookie): ${info.shop_id_from_cookie || 'Not found'}
Shop ID (Hard-coded): ${info.hard_coded_shop_id}
Match: ${info.shop_id_match ? '✅ Yes' : '❌ No'}

Open ID: ${info.open_id || 'Not found'}
Seller Name: ${info.seller_name || 'Not found'}

Check console for full details.`)
      } else {
        alert(`Debug failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error getting debug info:', error)
      alert('Error getting debug info')
    }
  }

  const handleFixShopId = async () => {
    try {
      console.log('🔧 Fixing Shop ID...')
      
      const response = await fetch('/api/fix-shop-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      console.log('🔧 Fix shop ID response:', result)
      
      if (response.ok && result.success) {
        alert('✅ Shop ID Fixed Successfully!\n\nShop ID: 7431862995146491691\nSeller Name: Transfer Kingdom (separate cookie)\n\nYou can now try fetching products again.')
      } else {
        alert(`Fix failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error fixing shop ID:', error)
      alert('Error fixing shop ID')
    }
  }

  const handleTestAuth = async () => {
    try {
      console.log('🧪 Testing TikTok Shop authentication...')
      
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      console.log('🧪 Test auth response:', result)
      
      if (response.ok && result.success) {
        const successCount = result.test_results.filter((r: any) => r.success).length
        const totalCount = result.test_results.length
        
        alert(`🧪 Authentication Test Results:

Access Token: ${result.access_token_info.present ? '✅ Present' : '❌ Missing'}
Length: ${result.access_token_info.length}
Preview: ${result.access_token_info.preview}

Shop ID: ${result.shop_id}

Endpoint Tests: ${successCount}/${totalCount} successful

Conclusion: ${result.conclusion}

Check console for detailed results.`)
      } else {
        alert(`Test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error testing auth:', error)
      alert('Error testing authentication')
    }
  }

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...')
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      console.log('🚪 Logout response:', result)
      
      if (response.ok && result.success) {
        alert('✅ Logged out successfully!\n\nAll authentication cookies cleared.\nPage will reload.')
        // Reload page to show authorization buttons
        window.location.reload()
      } else {
        alert(`Logout failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error logging out:', error)
      alert('Error logging out')
    }
  }

  const handleManualToken = async () => {
    const accessToken = prompt('🔑 Enter Access Token from TikTok Shop Partner API Testing Tool:')
    
    if (!accessToken || !accessToken.trim()) {
      alert('❌ Access token is required!')
      return
    }
    
    const shopId = prompt('🏪 Enter Shop ID (optional, will use default if empty):') || '7431862995146491691'
    
    try {
      console.log('🔧 Setting manual token...')
      
      const response = await fetch('/api/manual-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken.trim(),
          shop_id: shopId.trim()
        }),
      })
      
      const result = await response.json()
      
      console.log('🔧 Manual token response:', result)
      
      if (response.ok && result.success) {
        alert(`✅ Token Set Successfully!

Token Preview: ${result.token_preview}
Shop ID: ${result.shop_id}
Auth Method: ${result.auth_method}

Page will reload to show authorized state.`)
        
        // Reload page to show authorized UI
        window.location.reload()
      } else {
        alert(`❌ Failed to set token: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error setting manual token:', error)
      alert('Error setting manual token')
    }
  }

  const searchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      setProduct(null)

      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search product')
      }

      if (data.success && data.products?.[0]) {
        setProduct(data.products[0])
      } else {
        setError('Product not found')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search product')
    } finally {
      setLoading(false)
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
            variants: product.variants.map((v: ProductVariant) => 
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

  const getShops = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get-authorized-shops')
      const data = await response.json()
      
      if (data.success && data.shops?.length > 0) {
        setShops(data.shops)
      }
    } catch (error) {
      console.error('Failed to get shops:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">TikTok Shop Entegrasyonu</h1>
          <p className="text-gray-600 mb-8">
            TikTok Shop hesabınızı bağlayarak ürünlerinizi yönetmeye başlayın.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-red-700 font-semibold mb-2">Hata Oluştu</h2>
              <p className="text-red-600">{error === 'token_failed' ? 'Token alınamadı' : 
                error === 'invalid_token_response' ? 'Geçersiz token yanıtı' :
                error === 'callback_error' ? 'Callback işlemi başarısız' :
                'Bilinmeyen hata'}</p>
              {details && (
                <pre className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800 overflow-x-auto">
                  {details}
                </pre>
              )}
              <p className="mt-4 text-sm text-red-600">
                Lütfen tekrar deneyin veya sistem yöneticinize başvurun.
              </p>
            </div>
          )}

          <TiktokAuthButton />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Authorized Shops</h2>
          
          <button 
            onClick={getShops}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Authorized Shops
          </button>

          {loading && <p className="mt-4">Loading shops...</p>}
          
          {shops.map((shop) => (
            <div key={shop.id} className="mt-4 p-4 border rounded">
              <p><strong>Shop Name:</strong> {shop.name}</p>
              <p><strong>Shop ID:</strong> {shop.id}</p>
              <p><strong>Shop Code:</strong> {shop.code}</p>
              <p><strong>Region:</strong> {shop.region}</p>
              <p><strong>Type:</strong> {shop.seller_type}</p>
              <p><strong>Cipher:</strong> {shop.cipher}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Product Management</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={searchProduct}
              disabled={loading || !productId}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Get Product'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {product && (
            <div className="mt-4 p-4 border rounded">
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="mt-2"><strong>ID:</strong> {product.id}</p>
              <p><strong>Status:</strong> {product.status}</p>
              
              <h4 className="text-lg font-bold mt-4">Variants</h4>
              <div className="grid gap-4 mt-2">
                {product.skus?.map((sku: any) => (
                  <ProductVariant 
                    key={sku.id} 
                    sku={sku} 
                    productId={product.id} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 