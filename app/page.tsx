'use client'

import { useState, useEffect } from 'react'

interface PriceRule {
  variant: string
  price: string
}

interface Product {
  id: string
  title: string
  variants: Array<{
    id: string
    title: string
    price: string
  }>
}

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [priceRules, setPriceRules] = useState<PriceRule[]>([])
  const [testLoading, setTestLoading] = useState<boolean>(false)
  const [directTestLoading, setDirectTestLoading] = useState<boolean>(false)
  const [sdkTestLoading, setSdkTestLoading] = useState<boolean>(false)
  const [refreshTokenLoading, setRefreshTokenLoading] = useState<boolean>(false)

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
    
    // URL parametrelerini logla
    const urlParams = new URLSearchParams(window.location.search)
    console.log('=== Frontend URL Parameters ===')
    urlParams.forEach((value: string, key: string) => {
      console.log(`${key}: ${value}`)
    })
    
    // Eğer success parametresi varsa, biraz bekle ve auth status kontrol et
    if (urlParams.get('success') === 'authorized') {
      console.log('✅ Authorization redirect detected, checking status...')
      setTimeout(checkAuthStatus, 1000) // 1 saniye bekle
    } else {
      checkAuthStatus()
    }
    
    // Hata kontrolü
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
    
    // TikTok OAuth URL - normal TikTok endpoint kullanıyoruz (TikTok Shop için de aynı)
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=tiktok_shop_auth`
    
    window.location.href = authUrl
  }

  const handlePriceUpdate = async () => {
    setLoading(true)
    try {
      console.log('🚀 Starting price update with rules:', priceRules)
      
      const response = await fetch('/api/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceRules }),
      })
      
      const result = await response.json()
      
      console.log('📊 Price update response:', result)
      
      if (response.ok) {
        console.log('✅ Update successful!')
        console.log('📋 Debug info:', result.debug_info)
        console.log('🎯 Updates:', result.updates)
        console.log('📈 Summary:', result.summary)
        
        alert(`Prices updated successfully! Updated ${result.updated_count} variants.\n\nCheck console for detailed logs.`)
      } else {
        console.error('❌ Update failed:', result)
        alert(`Failed to update prices: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error updating prices:', error)
      alert('Error updating prices')
    } finally {
      setLoading(false)
    }
  }

  const handleTestProduct = async () => {
    setTestLoading(true)
    try {
      console.log('🧪 Testing product API for ID: 1731182926124651087')
      
      const response = await fetch('/api/test-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: '1731182926124651087' }),
      })
      
      const result = await response.json()
      
      console.log('🧪 Test product response:', result)
      
      if (response.ok) {
        console.log('✅ Product API test successful!')
        console.log('📦 Product details:', result.product)
        console.log('🏷️ Variants:', result.variants)
        
        alert(`Product API test successful!\n\nProduct: ${result.product?.name || 'N/A'}\nVariants: ${result.variants?.length || 0}\n\nCheck console for full details.`)
      } else {
        console.error('❌ Product API test failed:', result)
        alert(`Product API test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error testing product API:', error)
      alert('Error testing product API')
    } finally {
      setTestLoading(false)
    }
  }

  const handleTestDirectToken = async () => {
    setDirectTestLoading(true)
    try {
      console.log('🔑 Testing with direct access token')
      
      const response = await fetch('/api/test-direct-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: '1731182926124651087' }),
      })
      
      const result = await response.json()
      
      console.log('🔑 Direct token test response:', result)
      
      if (response.ok) {
        console.log('✅ Direct token test completed!')
        console.log('📊 Summary:', result.summary)
        console.log('🔗 Working endpoints:', result.summary.working_endpoints)
        console.log('📋 All results:', result.results)
        
        const summary = result.summary
        alert(`Direct Token Test Results:\n\nTotal tests: ${summary.total_tests}\nSuccessful: ${summary.successful_calls}\nFailed: ${summary.failed_calls}\n\nWorking endpoints: ${summary.working_endpoints.length}\n\nCheck console for detailed logs.`)
      } else {
        console.error('❌ Direct token test failed:', result)
        alert(`Direct token test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error testing direct token:', error)
      alert('Error testing direct token')
    } finally {
      setDirectTestLoading(false)
    }
  }

  const handleTestSDK = async () => {
    setSdkTestLoading(true)
    try {
      console.log('🔧 Testing with official TikTok SDK')
      
      const response = await fetch('/api/test-sdk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: '1731182926124651087' }),
      })
      
      const result = await response.json()
      
      console.log('🔧 SDK test response:', result)
      
      if (response.ok && result.success) {
        console.log('✅ SDK test successful!')
        console.log('📦 API Response:', result.response)
        if (result.response && result.response.data) {
          console.log('📋 Data:', result.response.data)
        }
        
        alert(`SDK Test Successful!\n\nStatus: ${result.response?.status || 'N/A'}\nMessage: ${result.message}\n\nCheck console for full API response data.`)
      } else {
        console.error('❌ SDK test failed:', result)
        
        // Handle both error formats
        const errorMsg = result.error?.message || result.error || result.message || 'Unknown error'
        alert(`SDK test failed: ${errorMsg}`)
      }
    } catch (error) {
      console.error('💥 Error testing SDK:', error)
      alert('Error testing SDK')
    } finally {
      setSdkTestLoading(false)
    }
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
        
        alert(`Token Refresh Successful!\n\nNew access token generated\nExpires: ${new Date(result.data.access_token_expire_in * 1000).toLocaleString()}\n\nYou can now test APIs again!`)
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

  const handleSingleProductTest = async (productId: string, variant: string, sku: string) => {
    setTestLoading(true)
    try {
      console.log('🧪 Testing single product price update')
      
      const response = await fetch('/api/test-single-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variant, sku }),
      })
      
      const result = await response.json()
      
      console.log('🧪 Single product test response:', result)
      
      if (response.ok) {
        console.log('✅ Single product test successful!')
        console.log('📦 Product details:', result.product)
        console.log('🏷️ Variants:', result.variants)
        
        alert(`Single Product Test Successful!\n\nProduct: ${result.product?.name || 'N/A'}\nVariants: ${result.variants?.length || 0}\n\nCheck console for full details.`)
      } else {
        console.error('❌ Single product test failed:', result)
        alert(`Single product test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('💥 Error testing single product:', error)
      alert('Error testing single product')
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TikTok Shop Price Updater
          </h1>
          <p className="text-gray-600">
            Update product prices based on variant titles automatically
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
            {/* Single Product Test */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Single Product Price Update Test</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Target Product:</h3>
                <p><strong>Product ID:</strong> 1730973647867908687</p>
                <p><strong>Variant:</strong> Unisex - S &amp; M ( 10" )</p>
                <p><strong>SKU:</strong> USA258</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleRefreshToken}
                  disabled={refreshTokenLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full bg-blue-600 hover:bg-blue-700"
                >
                  {refreshTokenLoading ? 'Refreshing Token...' : '🔄 Refresh Access Token'}
                </button>
                <button
                  onClick={() => handleSingleProductTest('1730973647867908687', 'Unisex - S & M ( 10" )', 'USA258')}
                  disabled={testLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full bg-green-600 hover:bg-green-700"
                >
                  {testLoading ? 'Testing Product...' : '🎯 Test Single Product Price Update'}
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Price Rules</h2>
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

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Update Prices</h2>
              <p className="text-gray-600 mb-4">
                Apply the price rules to all matching products
              </p>
              <button
                onClick={handlePriceUpdate}
                disabled={loading || priceRules.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Prices'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 