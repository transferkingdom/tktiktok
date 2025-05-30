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
    
    console.log('=== Get Product API Start ===')
    console.log('Product ID:', productId)
    
    // Get access token and shop cipher from cookies
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

    // Now get the product details
    const productPath = `/product/202309/products/${productId}`
    const productParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      need_variant: 'true'
    }
    
    const productSign = generateSignature(productPath, productParams, APP_SECRET)
    const productQueryParams = new URLSearchParams({
      ...productParams,
      sign: productSign,
      access_token: accessToken
    })
    
    const productUrl = `${baseUrl}${productPath}?${productQueryParams.toString()}`
    console.log('Product URL:', productUrl)
    
    const productResponse = await fetch(productUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const productData = await productResponse.json()
    console.log('Product response:', JSON.stringify(productData, null, 2))
    
    if (!productResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get product',
        details: productData
      }, { status: productResponse.status })
    }
    
    // Format the product data for frontend
    const formattedProduct = {
      id: productData.data?.id || productId,
      name: productData.data?.title || 'Unknown Product',
      status: productData.data?.status || 'Unknown',
      description: productData.data?.description || '',
      variants: []
    }
    
    // Format variants/SKUs
    if (productData.data?.skus && Array.isArray(productData.data.skus)) {
      formattedProduct.variants = productData.data.skus.map((sku: any) => ({
        id: sku.id,
        seller_sku: sku.seller_sku,
        title: sku.sales_attributes?.map((attr: any) => `${attr.name}: ${attr.value_name}`).join(', ') || sku.seller_sku,
        price: {
          original: sku.price?.original_price || '0',
          sale: sku.price?.sale_price || sku.price?.original_price || '0'
        },
        quantity: sku.stock_infos?.[0]?.available_stock || 0
      }))
    }
    
    return NextResponse.json({
      success: true,
      product: formattedProduct,
      raw_response: productData
    })
    
  } catch (error) {
    console.error('❌ Get Product Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get product', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 