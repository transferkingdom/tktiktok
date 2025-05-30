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

  console.log('Signature string:', signString)
  
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

async function getAllProducts(accessToken: string, shopCipher: string) {
  const products = []
  let pageToken = undefined
  
  do {
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const productsPath = '/product/202309/products/search'
    const productsParams: Record<string, string> = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: '100',
      ...(pageToken && { page_token: pageToken })
    }
    
    const productsSign = generateSignature(productsPath, productsParams, null, APP_SECRET)
    const productsQueryParams = new URLSearchParams({
      ...productsParams,
      sign: productsSign,
      access_token: accessToken
    })
    
    const url = `${baseUrl}${productsPath}?${productsQueryParams.toString()}`
    console.log('Products URL:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to get products')
    }

    products.push(...(data.data?.products || []))
    pageToken = data.data?.next_page_token

    // Add delay between requests to avoid rate limiting
    if (pageToken) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

  } while (pageToken)

  return products
}

async function updateProductPrice(accessToken: string, shopCipher: string, productId: string, skus: any[]) {
  const baseUrl = 'https://open-api.tiktokglobalshop.com'
  const updatePath = `/product/202309/products/${productId}/prices/update`
  const updateParams = {
    app_key: APP_KEY,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    shop_cipher: shopCipher
  }

  const updateBody = { skus }
  
  const updateSign = generateSignature(updatePath, updateParams, updateBody, APP_SECRET)
  const updateQueryParams = new URLSearchParams({
    ...updateParams,
    sign: updateSign,
    access_token: accessToken
  })
  
  const updateResponse = await fetch(`${baseUrl}${updatePath}?${updateQueryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-TTS-Access-Token': accessToken
    },
    body: JSON.stringify(updateBody)
  })
  
  return await updateResponse.json()
}

export async function POST(request: NextRequest) {
  try {
    const { percentage } = await request.json()
    
    if (!percentage || isNaN(percentage)) {
      return NextResponse.json(
        { error: 'Invalid percentage value' },
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

    // Get all products
    const products = await getAllProducts(accessToken, shopCipher)
    console.log(`Found ${products.length} products`)

    // Update prices for each product
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[]
    }

    for (const product of products) {
      try {
        if (!product.skus || product.skus.length === 0) continue

        const skuUpdates = product.skus.map((sku: any) => {
          const currentPrice = parseFloat(sku.price?.tax_exclusive_price || '0')
          const newPrice = (currentPrice * (1 + percentage / 100)).toFixed(2)
          
          return {
            id: sku.id,
            price: {
              amount: newPrice,
              currency: "USD",
              sale_price: newPrice
            }
          }
        })

        const result = await updateProductPrice(accessToken, shopCipher, product.id, skuUpdates)
        
        if (result.code === 0) {
          results.success++
        } else {
          results.failed++
          results.errors.push({
            product_id: product.id,
            error: result.message
          })
        }

        // Add delay between updates to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        results.failed++
        results.errors.push({
          product_id: product.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${products.length} products`,
      results
    })
    
  } catch (error) {
    console.error('❌ Bulk Price Increase Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update prices', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 