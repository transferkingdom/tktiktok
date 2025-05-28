import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== PRODUCT API TEST START ===')
    console.log('Testing product ID:', productId)
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const shopId = '7431862995146491691'

    console.log('Auth check:', {
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length,
      shopId,
      productId
    })

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authorized. Please connect your TikTok Shop account first.' },
        { status: 401 }
      )
    }

    // TikTok Shop Partner API Headers (202309)
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': accessToken
    }

    console.log('API Headers prepared for TikTok Shop Partner API 202309')

    let apiResults: any[] = []
    let productData: any = null

    // Test 1: TikTok Shop Partner API 202309 - Product Detail
    try {
      console.log('🧪 Test 1: TikTok Shop Partner API 202309 - Product Detail')
      const detailResponse = await fetch(`https://open-api.tiktokshop.com/api/products/details`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          shop_id: shopId,
          product_id: productId
        })
      })

      console.log('Product Detail API Response:', {
        status: detailResponse.status,
        statusText: detailResponse.statusText,
        headers: Object.fromEntries(detailResponse.headers.entries())
      })

      apiResults.push({
        test: 'TikTok Shop Partner API 202309 - Product Detail',
        endpoint: 'https://open-api.tiktokshop.com/api/products/details',
        method: 'POST',
        status: detailResponse.status,
        success: detailResponse.ok
      })

      if (detailResponse.ok) {
        const detailData = await detailResponse.json()
        console.log('✅ Product Detail API Success:', JSON.stringify(detailData, null, 2))
        productData = detailData.data
      } else {
        const errorText = await detailResponse.text()
        console.log('❌ Product Detail API Failed:', errorText)
      }

    } catch (error) {
      console.error('❌ Product Detail API Error:', error)
      apiResults.push({
        test: 'TikTok Shop Partner API 202309 - Product Detail',
        endpoint: 'https://open-api.tiktokshop.com/api/products/details',
        method: 'POST',
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: TikTok Shop Partner API 202309 - Product List
    try {
      console.log('🧪 Test 2: TikTok Shop Partner API 202309 - Product List')
      const listResponse = await fetch(`https://open-api.tiktokshop.com/api/products/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          shop_id: shopId,
          page_size: 50,
          page_token: '',
          product_status: null // Get all products
        })
      })

      console.log('Product List API Response:', {
        status: listResponse.status,
        statusText: listResponse.statusText
      })

      apiResults.push({
        test: 'TikTok Shop Partner API 202309 - Product List',
        endpoint: 'https://open-api.tiktokshop.com/api/products/search',
        method: 'POST',
        status: listResponse.status,
        success: listResponse.ok
      })

      if (listResponse.ok) {
        const listData = await listResponse.json()
        console.log('✅ Product List API Success:', JSON.stringify(listData, null, 2))
        
        // Look for our specific product in the list
        if (listData.data?.products) {
          const foundProduct = listData.data.products.find((p: any) => p.id === productId)
          if (foundProduct) {
            console.log('🎯 Found our product in list:', foundProduct)
            productData = foundProduct
          } else {
            console.log(`🔍 Product ${productId} not found in list of ${listData.data.products.length} products`)
            console.log('Available product IDs:', listData.data.products.map((p: any) => p.id))
          }
        }
      } else {
        const errorText = await listResponse.text()
        console.log('❌ Product List API Failed:', errorText)
      }

    } catch (error) {
      console.error('❌ Product List API Error:', error)
      apiResults.push({
        test: 'TikTok Shop Partner API 202309 - Product List',
        endpoint: 'https://open-api.tiktokshop.com/api/products/search',
        method: 'POST',
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Alternative TikTok Shop API Endpoint
    try {
      console.log('🧪 Test 3: Alternative TikTok Shop API')
      const altResponse = await fetch(`https://open-api.tiktokglobalshop.com/product/202309/products`, {
        method: 'GET',
        headers: {
          ...headers,
          'shop-id': shopId
        }
      })

      console.log('Alternative API Response:', {
        status: altResponse.status,
        statusText: altResponse.statusText
      })

      apiResults.push({
        test: 'Alternative TikTok Shop API',
        endpoint: 'https://open-api.tiktokglobalshop.com/product/202309/products',
        method: 'GET',
        status: altResponse.status,
        success: altResponse.ok
      })

      if (altResponse.ok) {
        const altData = await altResponse.json()
        console.log('✅ Alternative API Success:', JSON.stringify(altData, null, 2))
        
        // Look for our specific product
        if (altData.data?.products) {
          const foundProduct = altData.data.products.find((p: any) => p.product_id === productId || p.id === productId)
          if (foundProduct && !productData) {
            console.log('🎯 Found our product in alternative API:', foundProduct)
            productData = foundProduct
          }
        }
      } else {
        const errorText = await altResponse.text()
        console.log('❌ Alternative API Failed:', errorText)
      }

    } catch (error) {
      console.error('❌ Alternative API Error:', error)
      apiResults.push({
        test: 'Alternative TikTok Shop API',
        endpoint: 'https://open-api.tiktokglobalshop.com/product/202309/products',
        method: 'GET',
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    console.log('\n=== PRODUCT API TEST RESULTS ===')
    console.log('API Results:', apiResults)
    console.log('Product Data Found:', !!productData)
    if (productData) {
      console.log('Product Details:', productData)
    }

    return NextResponse.json({
      success: true,
      message: `TikTok Shop Partner API test completed for ${productId}`,
      product_id: productId,
      shop_id: shopId,
      product: productData,
      variants: productData?.skus || productData?.variants || [],
      api_test_results: apiResults,
      api_working: apiResults.some(r => r.success),
      product_found: !!productData,
      debug_info: {
        access_token_present: !!accessToken,
        total_api_tests: apiResults.length,
        successful_api_calls: apiResults.filter(r => r.success).length,
        failed_api_calls: apiResults.filter(r => !r.success).length,
        api_endpoints_tested: [
          'https://open-api.tiktokshop.com/api/products/details',
          'https://open-api.tiktokshop.com/api/products/search',
          'https://open-api.tiktokglobalshop.com/product/202309/products'
        ]
      }
    })

  } catch (error) {
    console.error('❌ Error in product test API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 