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

interface SalesAttribute {
  name: string;
  value_name: string;
}

interface Variant {
  id: string;
  seller_sku: string;
  title: string;
  sales_attributes: SalesAttribute[];
  price: {
    currency: string;
    original: string;
    sale: string;
  };
  inventory: number;
}

interface Product {
  id: string;
  name: string;
  status: string;
  create_time: number;
  update_time: number;
  variants: Variant[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageToken = searchParams.get('page_token')
    const attributeName = searchParams.get('attribute_name')
    const attributeValue = searchParams.get('attribute_value')
    
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

    // Now get the products list
    const productsPath = '/product/202309/products/search'
    const productsParams: Record<string, string> = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: '20',
      ...(pageToken && { page_token: pageToken })
    }
    
    const productsSign = generateSignature(productsPath, productsParams, APP_SECRET)
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
    console.log('Products Response:', JSON.stringify(data, null, 2))

    if (data.code !== 0) {
      return NextResponse.json({
        success: false,
        error: data.message || 'Failed to get products'
      }, { status: 400 })
    }

    // Format and filter the response for frontend
    let formattedProducts = data.data?.products?.map((product: any) => ({
      id: product.id,
      name: product.title,
      status: product.status,
      create_time: product.create_time,
      update_time: product.update_time,
      variants: product.skus?.map((sku: any) => ({
        id: sku.id,
        seller_sku: sku.seller_sku,
        title: sku.seller_sku,
        sales_attributes: sku.sales_attributes?.map((attr: any) => ({
          name: attr.name,
          value_name: attr.value_name
        })) || [],
        price: {
          currency: sku.price?.currency || 'USD',
          original: sku.price?.tax_exclusive_price || '0',
          sale: sku.price?.sale_price || sku.price?.tax_exclusive_price || '0'
        },
        inventory: sku.inventory?.[0]?.quantity || 0
      })) || []
    })) || []

    // Filter by sales attributes if specified
    if (attributeName && attributeValue) {
      formattedProducts = formattedProducts.map((product: Product) => ({
        ...product,
        variants: product.variants.filter((variant: Variant) => 
          variant.sales_attributes.some((attr: SalesAttribute) => 
            attr.name === attributeName && 
            attr.value_name.toLowerCase().includes(attributeValue.toLowerCase())
          )
        )
      })).filter((product: Product) => product.variants.length > 0)
    }

    return NextResponse.json({
      success: true,
      total_count: formattedProducts.length,
      next_page_token: data.data?.next_page_token,
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