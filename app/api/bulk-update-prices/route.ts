import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(path: string, params: Record<string, string>, body: any, appSecret: string) {
  const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key]
    return acc
  }, {} as Record<string, string>)

  let signString = appSecret + path
  for (const [key, value] of Object.entries(sortedParams)) {
    if (key !== 'sign' && key !== 'access_token') {
      signString += key + value
    }
  }
  
  if (body) {
    signString += JSON.stringify(body)
  }
  
  signString += appSecret
  
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { skusToUpdate } = await request.json()
    
    if (!skusToUpdate || !Array.isArray(skusToUpdate) || skusToUpdate.length === 0) {
      return NextResponse.json(
        { error: 'No SKUs provided for update' },
        { status: 400 }
      )
    }

    // Get access token from cookies
    const cookieStore = cookies()
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const legacyAccessToken = cookieStore.get('tiktok_access_token')?.value
    const accessToken = shopAccessToken || legacyAccessToken
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }

    // Get shop cipher
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const shopsPath = '/authorization/202309/shops'
    const shopsParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString()
    }
    
    const shopsSign = generateSignature(shopsPath, shopsParams, null, APP_SECRET)
    const shopsQueryParams = new URLSearchParams({
      ...shopsParams,
      sign: shopsSign,
      access_token: accessToken
    })
    
    const shopsResponse = await fetch(`${baseUrl}${shopsPath}?${shopsQueryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const shopsData = await shopsResponse.json()
    
    if (!shopsData.data?.shops?.[0]?.cipher) {
      return NextResponse.json(
        { error: 'Failed to get shop cipher' },
        { status: 400 }
      )
    }
    
    const shopCipher = shopsData.data.shops[0].cipher

    // Process updates in batches
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[]
    }

    // Group SKUs by product ID
    const productUpdates = skusToUpdate.reduce((acc, update) => {
      if (!acc[update.productId]) {
        acc[update.productId] = []
      }
      acc[update.productId].push({
        id: update.skuId,
        price: {
          amount: update.newPrice,
          currency: "USD",
          sale_price: update.newPrice
        }
      })
      return acc
    }, {} as Record<string, any[]>)

    // Update each product's SKUs
    for (const [productId, skus] of Object.entries(productUpdates)) {
      const updatePath = `/product/202309/products/${productId}/prices/update`
      const updateParams = {
        app_key: APP_KEY,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        shop_cipher: shopCipher
      }

      const updateBody = { skus: skus as any[] }
      
      const updateSign = generateSignature(updatePath, updateParams, updateBody, APP_SECRET)
      const updateQueryParams = new URLSearchParams({
        ...updateParams,
        sign: updateSign,
        access_token: accessToken
      })
      
      try {
        const updateResponse = await fetch(`${baseUrl}${updatePath}?${updateQueryParams.toString()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-TTS-Access-Token': accessToken
          },
          body: JSON.stringify(updateBody)
        })
        
        const updateData = await updateResponse.json()
        
        if (updateData.code === 0) {
          results.success += (skus as any[]).length
        } else {
          results.failed += (skus as any[]).length
          results.errors.push({
            product_id: productId,
            error: updateData
          })
        }

        // Add delay between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        results.failed += (skus as any[]).length
        results.errors.push({
          product_id: productId,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.success} SKUs, failed ${results.failed} SKUs`,
      results
    })
    
  } catch (error) {
    console.error('❌ Bulk Update Prices Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update prices', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 