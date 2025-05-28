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

    // TikTok Shop API Headers
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': accessToken
    }

    console.log('API Headers prepared for test')

    let apiResults: any[] = []
    let productData: any = null

    // Test 1: TikTok Shop Product Detail API
    try {
      console.log('🧪 Test 1: Product Detail API')
      const detailResponse = await fetch(`https://open.tiktokapis.com/v2/seller/products/${productId}`, {
        method: 'GET',
        headers: {
          ...headers,
          'shop-id': shopId
        }
      })

      console.log('Product Detail API Response:', {
        status: detailResponse.status,
        statusText: detailResponse.statusText,
        headers: Object.fromEntries(detailResponse.headers.entries())
      })

      apiResults.push({
        test: 'Product Detail API',
        endpoint: `https://open.tiktokapis.com/v2/seller/products/${productId}`,
        method: 'GET',
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
        test: 'Product Detail API',
        endpoint: `https://open.tiktokapis.com/v2/seller/products/${productId}`,
        method: 'GET',
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: Alternative Product List API (looking for specific product)
    try {
      console.log('🧪 Test 2: Product List API')
      const listResponse = await fetch(`https://open.tiktokapis.com/v2/seller/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          shop_id: shopId,
          page_info: {
            page_size: 100,
            page_token: ''
          }
        })
      })

      console.log('Product List API Response:', {
        status: listResponse.status,
        statusText: listResponse.statusText
      })

      apiResults.push({
        test: 'Product List API',
        endpoint: 'https://open.tiktokapis.com/v2/seller/products',
        method: 'POST',
        status: listResponse.status,
        success: listResponse.ok
      })

      if (listResponse.ok) {
        const listData = await listResponse.json()
        console.log('✅ Product List API Success:', JSON.stringify(listData, null, 2))
        
        // Look for our specific product in the list
        if (listData.data?.products) {
          const foundProduct = listData.data.products.find((p: any) => p.product_id === productId)
          if (foundProduct) {
            console.log('🎯 Found our product in list:', foundProduct)
            productData = foundProduct
          } else {
            console.log(`🔍 Product ${productId} not found in list of ${listData.data.products.length} products`)
          }
        }
      } else {
        const errorText = await listResponse.text()
        console.log('❌ Product List API Failed:', errorText)
      }

    } catch (error) {
      console.error('❌ Product List API Error:', error)
      apiResults.push({
        test: 'Product List API',
        endpoint: 'https://open.tiktokapis.com/v2/seller/products',
        method: 'POST',
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: TikTok Partner API
    try {
      console.log('🧪 Test 3: TikTok Partner API')
      const partnerResponse = await fetch(`https://open-api.tiktokglobalshop.com/product/202309/products`, {
        method: 'GET',
        headers: {
          ...headers,
          'shop-id': shopId
        }
      })

      console.log('Partner API Response:', {
        status: partnerResponse.status,
        statusText: partnerResponse.statusText
      })

      apiResults.push({
        test: 'TikTok Partner API',
        endpoint: 'https://open-api.tiktokglobalshop.com/product/202309/products',
        method: 'GET',
        status: partnerResponse.status,
        success: partnerResponse.ok
      })

      if (partnerResponse.ok) {
        const partnerData = await partnerResponse.json()
        console.log('✅ Partner API Success:', JSON.stringify(partnerData, null, 2))
        
        // Look for our specific product
        if (partnerData.data?.products) {
          const foundProduct = partnerData.data.products.find((p: any) => p.product_id === productId)
          if (foundProduct && !productData) {
            console.log('🎯 Found our product in partner API:', foundProduct)
            productData = foundProduct
          }
        }
      } else {
        const errorText = await partnerResponse.text()
        console.log('❌ Partner API Failed:', errorText)
      }

    } catch (error) {
      console.error('❌ Partner API Error:', error)
      apiResults.push({
        test: 'TikTok Partner API',
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
      message: `Product API test completed for ${productId}`,
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
        failed_api_calls: apiResults.filter(r => !r.success).length
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