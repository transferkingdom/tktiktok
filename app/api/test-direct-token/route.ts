import { NextRequest, NextResponse } from 'next/server'

interface ApiResult {
  name: string
  url: string
  method: string
  status: number | string
  statusText?: string
  success: boolean
  headers?: { [k: string]: string }
  data?: any
  text?: string
  error?: any
  errorText?: string
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== DIRECT TOKEN TEST START ===')
    
    // Use the new access token directly
    const accessToken = 'YW6gdQAAAACtKWVciveiwOD9AsK-pgGH1oZ9kbhNDOq4uCcITr6npA'
    const shopId = '7431862995146491691'
    const testProductId = productId || '1731182926124651087'

    console.log('Direct token test:', {
      accessToken: accessToken.substring(0, 10) + '...',
      shopId,
      productId: testProductId
    })

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': accessToken
    }

    let apiResults: ApiResult[] = []

    // Test multiple possible endpoints
    const endpoints = [
      {
        name: 'TikTok Shop Partner API v202309 - Product Details',
        url: 'https://open-api.tiktokshop.com/api/products/details',
        method: 'POST',
        body: { shop_id: shopId, product_id: testProductId }
      },
      {
        name: 'TikTok Shop Partner API v202309 - Product Search',
        url: 'https://open-api.tiktokshop.com/api/products/search',
        method: 'POST',
        body: { shop_id: shopId, page_size: 10, page_token: '' }
      },
      {
        name: 'Alternative TikTok Global Shop API',
        url: 'https://open-api.tiktokglobalshop.com/product/202309/products',
        method: 'GET',
        headers: { ...headers, 'shop-id': shopId }
      },
      {
        name: 'TikTok Shop API v202212',
        url: 'https://open-api.tiktokshop.com/api/product/202212/products',
        method: 'GET',
        headers: { ...headers, 'shop-id': shopId }
      }
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🧪 Testing: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        
        const requestOptions: any = {
          method: endpoint.method,
          headers: endpoint.headers || headers
        }

        if (endpoint.body && endpoint.method === 'POST') {
          requestOptions.body = JSON.stringify(endpoint.body)
        }

        const response = await fetch(endpoint.url, requestOptions)
        
        console.log(`Response: ${response.status} ${response.statusText}`)
        
        const result: ApiResult = {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        }

        if (response.ok) {
          try {
            const data = await response.json()
            console.log(`✅ Success:`, data)
            result.data = data
          } catch (e) {
            const text = await response.text()
            console.log(`✅ Success (text):`, text)
            result.text = text
          }
        } else {
          try {
            const errorData = await response.json()
            console.log(`❌ Error JSON:`, errorData)
            result.error = errorData
          } catch (e) {
            const errorText = await response.text()
            console.log(`❌ Error Text:`, errorText)
            result.errorText = errorText
          }
        }

        apiResults.push(result)

      } catch (error) {
        console.error(`💥 Error testing ${endpoint.name}:`, error)
        apiResults.push({
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: 'ERROR',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    console.log('\n=== DIRECT TOKEN TEST RESULTS ===')
    console.log('Total tests:', apiResults.length)
    console.log('Successful calls:', apiResults.filter(r => r.success).length)
    console.log('Failed calls:', apiResults.filter(r => !r.success).length)

    return NextResponse.json({
      success: true,
      message: 'Direct token test completed',
      access_token: accessToken.substring(0, 10) + '...',
      shop_id: shopId,
      product_id: testProductId,
      results: apiResults,
      summary: {
        total_tests: apiResults.length,
        successful_calls: apiResults.filter(r => r.success).length,
        failed_calls: apiResults.filter(r => !r.success).length,
        working_endpoints: apiResults.filter(r => r.success).map(r => r.url)
      }
    })

  } catch (error) {
    console.error('❌ Error in direct token test:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 