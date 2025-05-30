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

interface TiktokSku {
  id: string;
  seller_sku: string;
  price?: {
    tax_exclusive_price: string;
  };
}

interface TiktokProduct {
  id: string;
  title?: string;
  skus?: TiktokSku[];
}

export async function POST(request: NextRequest) {
  try {
    const { searchPrice, pageToken } = await request.json()
    
    if (!searchPrice) {
      return NextResponse.json(
        { error: 'Search price is required' },
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
    
    console.log('Getting shop cipher...')
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
    console.log('Shops response:', JSON.stringify(shopsData, null, 2))
    
    if (!shopsData.data?.shops?.[0]?.cipher) {
      return NextResponse.json(
        { error: 'Failed to get shop cipher' },
        { status: 400 }
      )
    }
    
    const shopCipher = shopsData.data.shops[0].cipher
    console.log('Shop cipher:', shopCipher)

    // Get products with pagination
    const productsPath = '/product/202309/products/search'
    const matchingSkus: Array<{
      product_id: string,
      sku_id: string,
      seller_sku: string,
      title: string,
      price: string
    }> = []
    
    // Get single page of products
    const productsParams: Record<string, string> = {
      app_key: APP_KEY,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      shop_cipher: shopCipher,
      page_size: '100'  // Maximum allowed by TikTok API
    }

    if (pageToken) {
      productsParams.page_token = pageToken
    }

    const productsBody = {
      status: 'ACTIVATE'  // Only get active products
    }
    
    console.log('Searching products with params:', productsParams)
    const productsSign = generateSignature(productsPath, productsParams, productsBody, APP_SECRET)
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
      body: JSON.stringify(productsBody)
    })
    
    const productsData = await productsResponse.json()
    console.log('Products response:', JSON.stringify(productsData, null, 2))
    
    if (!productsResponse.ok || productsData.code !== 0) {
      throw new Error(productsData.message || 'Failed to get products')
    }

    // Format response for frontend
    const searchPriceNumber = Number(searchPrice).toFixed(2);
    const formattedSkus = productsData.data.products.flatMap((product: TiktokProduct) => 
      product.skus?.map((sku: TiktokSku) => {
        const skuPrice = Number(sku.price?.tax_exclusive_price || 0).toFixed(2);
        if (skuPrice === searchPriceNumber) {
          return {
            product_id: product.id,
            sku_id: sku.id,
            seller_sku: sku.seller_sku,
            title: product.title || '',
            price: skuPrice
          };
        }
        return null;
      }).filter(Boolean) || []
    );

    return NextResponse.json({
      success: true,
      skus: formattedSkus,
      total: formattedSkus.length,
      hasNextPage: !!productsData.data.next_page_token,
      nextPageToken: productsData.data.next_page_token || null
    });
    
  } catch (error) {
    console.error('❌ Search Products Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage, success: false, skus: [] }, { status: 500 })
  }
} 