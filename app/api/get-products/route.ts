import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(path: string, params: Record<string, string>, body: any, appSecret: string) {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key]
    return acc
  }, {} as Record<string, string>)

  // Build signature string
  let signString = path // Start with path, without appSecret prefix
  
  // Add sorted parameters
  Object.entries(sortedParams).forEach(([key, value]) => {
    if (key !== 'sign' && key !== 'access_token') {
      signString += key + value
    }
  })

  // Add request body if exists
  if (body) {
    signString += JSON.stringify(body)
  }

  // Add app secret at the end
  signString += appSecret

  console.log('Raw signature string:', signString)
  
  // Generate HMAC SHA256
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

async function getAuthorizedShop(accessToken: string) {
  try {
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const shopsPath = '/authorization/202309/shops'
    const shopsParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString()
    }
    
    const requestBody = {}
    const shopsSign = generateSignature(shopsPath, shopsParams, requestBody, APP_SECRET)
    
    console.log('Shop Authorization Request:')
    console.log('- Path:', shopsPath)
    console.log('- Params:', shopsParams)
    console.log('- Sign:', shopsSign)
    
    const shopsQueryParams = new URLSearchParams({
      ...shopsParams,
      sign: shopsSign,
      access_token: accessToken
    })
    
    const shopsResponse = await fetch(`${baseUrl}${shopsPath}?${shopsQueryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const shopsData = await shopsResponse.json()
    console.log('Shop Response:', JSON.stringify(shopsData, null, 2))
    
    if (shopsData.code !== 0) {
      throw new Error(`Failed to get shop data: ${shopsData.message}`)
    }
    
    if (!shopsData.data?.shops?.[0]?.cipher) {
      throw new Error('No shop cipher found in response')
    }
    
    return shopsData.data.shops[0].cipher
  } catch (error) {
    console.error('Shop Authorization Error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to get shop cipher')
  }
}

export async function GET(request: NextRequest) {
  try {
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
    const shopCipher = await getAuthorizedShop(accessToken)
    console.log('Shop cipher:', shopCipher)

    // Get products
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const productsPath = '/product/202309/products/search'
    const productsParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: '100',
      page_number: '1'
    }

    const requestBody = {} // Empty body for search request
    
    const productsSign = generateSignature(productsPath, productsParams, requestBody, APP_SECRET)
    const productsQueryParams = new URLSearchParams({
      ...productsParams,
      sign: productsSign,
      access_token: accessToken
    })
    
    const productsResponse = await fetch(`${baseUrl}${productsPath}?${productsQueryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      },
      body: JSON.stringify(requestBody)
    })
    
    const productsData = await productsResponse.json()
    console.log('Products Response:', JSON.stringify(productsData, null, 2))

    if (productsData.code !== 0) {
      return NextResponse.json({
        success: false,
        error: productsData.message || 'Failed to get products'
      }, { status: 400 })
    }

    // Format products for frontend
    const formattedProducts = productsData.data?.products?.map((product: any) => ({
      id: product.id,
      name: product.title,
      variants: product.skus?.map((sku: any) => ({
        id: sku.id,
        seller_sku: sku.seller_sku,
        title: sku.sales_attributes?.map((attr: any) => `${attr.name}: ${attr.value_name}`).join(', ') || sku.seller_sku,
        price: {
          original: sku.price?.original_price || '0',
          sale: sku.price?.sale_price || sku.price?.original_price || '0'
        }
      })) || []
    })) || []

    return NextResponse.json({
      success: true,
      products: formattedProducts
    })
    
  } catch (error) {
    console.error('❌ Get Products Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get products', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 