import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(path: string, params: Record<string, string>, body: any, appSecret: string) {
  // Step 1: Extract and sort parameters (excluding sign and access_token)
  const sortedParams = Object.entries(params)
    .filter(([key]) => key !== 'sign' && key !== 'access_token')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, value }))

  // Step 2: Create parameter string in {key}{value} format
  const paramString = sortedParams
    .map(({ key, value }) => `${key}${value}`)
    .join('')

  // Step 3: Combine path and parameters
  let signString = `${path}${paramString}`

  // Step 4: Add request body if exists and not multipart/form-data
  if (body && Object.keys(body).length > 0) {
    signString += JSON.stringify(body)
  }

  // Step 5: Wrap with app_secret
  signString = `${appSecret}${signString}${appSecret}`

  console.log('Raw signature string:', signString)
  console.log('Sorted params:', sortedParams)

  // Step 6: Generate HMAC-SHA256
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
}

async function getAuthorizedShop(accessToken: string) {
  try {
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const path = '/authorization/202309/shops'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    
    const params = {
      app_key: APP_KEY,
      timestamp: timestamp
    }
    
    const sign = generateSignature(path, params, null, APP_SECRET)
    
    console.log('Shop Authorization Request:')
    console.log('- Path:', path)
    console.log('- Params:', params)
    console.log('- Sign:', sign)
    
    const queryParams = new URLSearchParams({
      ...params,
      sign: sign,
      access_token: accessToken
    })
    
    const url = `${baseUrl}${path}?${queryParams.toString()}`
    console.log('Full URL:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      }
    })
    
    const data = await response.json()
    console.log('Shop Response:', JSON.stringify(data, null, 2))
    
    if (data.code !== 0) {
      throw new Error(`Failed to get shop data: ${data.message}`)
    }
    
    if (!data.data?.shops?.[0]?.cipher) {
      throw new Error('No shop cipher found in response')
    }
    
    return data.data.shops[0].cipher
  } catch (error) {
    console.error('Shop Authorization Error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to get shop cipher')
  }
}

export async function GET(request: NextRequest) {
  try {
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

    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams
    const pageSize = searchParams.get('page_size') || '40'
    const pageToken = searchParams.get('page_token')
    const status = searchParams.get('status') || 'ALL'
    const categoryVersion = searchParams.get('category_version') || 'v2' // US market uses v2

    const shopCipher = await getAuthorizedShop(accessToken)
    console.log('Shop cipher:', shopCipher)

    const path = '/product/202502/products/search'
    const params: Record<string, string> = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: pageSize
    }

    // Add optional page token if provided
    if (pageToken) {
      params.page_token = pageToken
    }

    // Prepare search body with filters
    const body = {
      status: status,
      category_version: categoryVersion
    }

    const sign = generateSignature(path, params, body, APP_SECRET)
    
    const queryParams = new URLSearchParams({
      ...params,
      sign: sign,
      access_token: accessToken
    })
    
    const url = `https://open-api.tiktokglobalshop.com${path}?${queryParams.toString()}`
    
    console.log('Search Request:')
    console.log('URL:', url)
    console.log('Body:', JSON.stringify(body, null, 2))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    console.log('Products Response:', JSON.stringify(data, null, 2))

    if (data.code !== 0) {
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to get products'
      }, { status: 400 })
    }

    // Format the response for frontend
    const formattedResponse = {
      success: true,
      total_count: data.data?.total_count || 0,
      next_page_token: data.data?.next_page_token,
      products: data.data?.products?.map((product: any) => ({
        id: product.id,
        name: product.title,
        status: product.status,
        create_time: product.create_time,
        update_time: product.update_time,
        variants: product.skus?.map((sku: any) => ({
          id: sku.id,
          seller_sku: sku.seller_sku,
          title: sku.sales_attributes?.map((attr: any) => `${attr.name}: ${attr.value_name}`).join(', ') || sku.seller_sku,
          price: {
            currency: sku.price?.currency || 'USD',
            original: sku.price?.tax_exclusive_price || '0',
            sale: sku.price?.sale_price || sku.price?.tax_exclusive_price || '0'
          },
          inventory: sku.inventory?.[0]?.available_stock || 0
        })) || []
      })) || []
    }

    return NextResponse.json(formattedResponse)
    
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