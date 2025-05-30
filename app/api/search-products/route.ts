import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(path: string, params: Record<string, string>, appSecret: string) {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key]
    return acc
  }, {} as Record<string, string>)

  // Build signature string: secret + path + key1value1key2value2 + secret
  let signString = appSecret + path
  for (const [key, value] of Object.entries(sortedParams)) {
    if (key !== 'sign' && key !== 'access_token') {
      signString += key + value
    }
  }
  signString += appSecret

  console.log('Signature string:', signString)
  
  // Generate HMAC SHA256
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== Search Products API Start ===')
    console.log('Product ID:', productId)
    
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

    // First, get the shop cipher from authorized shops
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const shopsPath = '/authorization/202309/shops'
    const shopsParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString()
    }
    
    const shopsSign = generateSignature(shopsPath, shopsParams, APP_SECRET)
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
    console.log('Shop cipher:', shopCipher)

    // Now search for the product
    const searchPath = '/product/202502/products/search'
    const searchParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: '20'
    }
    
    const searchSign = generateSignature(searchPath, searchParams, APP_SECRET)
    const searchQueryParams = new URLSearchParams({
      ...searchParams,
      sign: searchSign,
      access_token: accessToken
    })
    
    const searchUrl = `${baseUrl}${searchPath}?${searchQueryParams.toString()}`
    console.log('Search URL:', searchUrl)
    
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      },
      body: JSON.stringify({
        status: 'ACTIVATE',
        sku_ids: [productId]
      })
    })
    
    const searchData = await searchResponse.json()
    console.log('Search response:', JSON.stringify(searchData, null, 2))
    
    if (!searchResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to search products',
        details: searchData
      }, { status: searchResponse.status })
    }
    
    // Format the products data for frontend
    const formattedProducts = searchData.data?.products?.map((product: any) => ({
      id: product.id,
      name: product.title,
      status: product.status,
      skus: product.skus?.map((sku: any) => ({
        id: sku.id,
        seller_sku: sku.seller_sku,
        price: {
          original: sku.price?.original_price || '0',
          sale: sku.price?.sale_price || sku.price?.original_price || '0'
        },
        stock: sku.stock_infos?.[0]?.available_stock || 0
      }))
    })) || []
    
    return NextResponse.json({
      success: true,
      products: formattedProducts,
      raw_response: searchData
    })
    
  } catch (error) {
    console.error('❌ Search Products Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to search products', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 