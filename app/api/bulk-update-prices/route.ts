import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'
const BATCH_SIZE = 10 // Process 10 products at a time to respect rate limits

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

async function getAuthorizedShop(accessToken: string) {
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
    throw new Error('Failed to get shop cipher')
  }
  
  return shopsData.data.shops[0].cipher
}

async function getProductList(accessToken: string, shopCipher: string) {
  const baseUrl = 'https://open-api.tiktokglobalshop.com'
  const productsPath = '/api/products/search'
  const productsParams = {
    app_key: APP_KEY,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    shop_cipher: shopCipher,
    page_size: '100', // Get maximum products per request
    page_number: '1'
  }
  
  const productsSign = generateSignature(productsPath, productsParams, null, APP_SECRET)
  const productsQueryParams = new URLSearchParams({
    ...productsParams,
    sign: productsSign,
    access_token: accessToken
  })
  
  const productsResponse = await fetch(`${baseUrl}${productsPath}?${productsQueryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-TTS-Access-Token': accessToken
    }
  })
  
  const productsData = await productsResponse.json()
  console.log('Products Response:', JSON.stringify(productsData, null, 2))

  if (productsData.code !== 0) {
    console.error('Failed to get products:', productsData)
    throw new Error(`Failed to get products: ${productsData.message}`)
  }

  return productsData.data?.products || []
}

async function updateProductPrice(accessToken: string, shopCipher: string, productId: string, skuId: string, newPrice: string) {
  const baseUrl = 'https://open-api.tiktokglobalshop.com'
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
        amount: newPrice,
        currency: "USD",
        sale_price: newPrice
      }
    }]
  }
  
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
    const { targetSize, newPrice } = await request.json()
    
    console.log('=== Bulk Update Prices API Start ===')
    console.log('Target Size:', targetSize)
    console.log('New Price:', newPrice)
    
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

    // Get all products
    const products = await getProductList(accessToken, shopCipher)
    console.log('Total products found:', products.length)

    // Filter SKUs with matching size
    const updateQueue: Array<{ productId: string, skuId: string }> = []
    
    for (const product of products) {
      if (product.skus) {
        for (const sku of product.skus) {
          const sizeAttribute = sku.sales_attributes?.find(
            (attr: any) => attr.name === 'PRINT Size' && attr.value_name === targetSize
          )
          
          if (sizeAttribute) {
            updateQueue.push({
              productId: product.id,
              skuId: sku.id
            })
          }
        }
      }
    }

    console.log('SKUs to update:', updateQueue.length)

    // Process updates in batches
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[]
    }

    for (let i = 0; i < updateQueue.length; i += BATCH_SIZE) {
      const batch = updateQueue.slice(i, i + BATCH_SIZE)
      
      // Process batch with small delay to respect rate limits
      await Promise.all(batch.map(async ({ productId, skuId }) => {
        try {
          const result = await updateProductPrice(accessToken, shopCipher, productId, skuId, newPrice.toString())
          if (result.code === 0) {
            results.success++
          } else {
            results.failed++
            results.errors.push({ productId, skuId, error: result })
          }
        } catch (error) {
          results.failed++
          results.errors.push({ productId, skuId, error })
        }
      }))

      // Add delay between batches
      if (i + BATCH_SIZE < updateQueue.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${updateQueue.length} SKUs`,
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