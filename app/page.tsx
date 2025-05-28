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

  useEffect(() => {
    // Check if user is already authorized by looking for success parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'authorized') {
      setIsAuthorized(true)
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
      const response = await fetch('/api/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceRules }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert(`Prices updated successfully! Updated ${result.updated_count} variants.`)
      } else {
        alert(`Failed to update prices: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating prices:', error)
      alert('Error updating prices')
    } finally {
      setLoading(false)
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