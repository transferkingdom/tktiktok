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

  // Build signature string: secret + path + key1value1key2value2 + body + secret
  let signString = appSecret + path
  
  // Add query parameters
  for (const [key, value] of Object.entries(sortedParams)) {
    if (key !== 'sign' && key !== 'access_token') {
      signString += key + value
    }
  }
  
  // Add request body if exists
  if (body) {
    signString += JSON.stringify(body)
  }
  
  signString += appSecret

  console.log('Signature string:', signString)
  
  // Generate HMAC SHA256
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { productId, skuId, listPrice } = await request.json()
    
    console.log('=== Update List Price API Start ===')
    console.log('Product ID:', productId)
    console.log('SKU ID:', skuId)
    console.log('New List Price:', listPrice)
    
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
    console.log('Shop cipher:', shopCipher)

    // Get product details to get category_id
    const productPath = `/product/202309/products/${productId}`
    const productParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher
    }
    
    const productSign = generateSignature(productPath, productParams, null, APP_SECRET)
    const productQueryParams = new URLSearchParams({
      ...productParams,
      sign: productSign,
      access_token: accessToken
    })
    
    const productResponse = await fetch(`${baseUrl}${productPath}?${productQueryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const productData = await productResponse.json()
    
    if (!productResponse.ok || productData.code !== 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get product details',
        details: productData
      }, { status: 400 })
    }

    const categoryId = productData.data?.category_chains?.[productData.data.category_chains.length - 1]?.id
    const mainImages = productData.data?.images

    if (!mainImages || mainImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product must have main images',
        details: productData
      }, { status: 400 })
    }

    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get category ID from product',
        details: productData
      }, { status: 400 })
    }

    // Now update the product price
    const updatePath = `/product/202309/products/${productId}/prices/update`
    const updateParams = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher
    }

    const updateBody = {
      skus: [{
        id: skuId,
        price: {
          amount: listPrice.toString(),
          currency: "TRY"
        }
      }]
    }
    
    const updateSign = generateSignature(updatePath, updateParams, updateBody, APP_SECRET)
    const updateQueryParams = new URLSearchParams({
      ...updateParams,
      sign: updateSign,
      access_token: accessToken
    })
    
    const updateUrl = `${baseUrl}${updatePath}?${updateQueryParams.toString()}`
    console.log('Update URL:', updateUrl)
    console.log('Update Body:', JSON.stringify(updateBody, null, 2))
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      },
      body: JSON.stringify(updateBody)
    })
    
    const updateData = await updateResponse.json()
    console.log('Update response:', JSON.stringify(updateData, null, 2))
    
    if (!updateResponse.ok || updateData.code !== 0) {
      return NextResponse.json({
        success: false,
        error: updateData.message || 'Failed to update price',
        details: updateData
      }, { status: updateResponse.status || 400 })
    }
    
    return NextResponse.json({
      success: true,
      data: updateData
    })
    
  } catch (error) {
    console.error('❌ Update List Price Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update list price', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 