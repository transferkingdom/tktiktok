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
    const appKey = '6e8q3qfuc5iqv'
    const appSecret = 'f1a1a446f377780021df9219cb4b029170626997'
    const testProductId = productId || '1731182926124651087'

    console.log('Direct token test:', {
      accessToken: accessToken.substring(0, 10) + '...',
      shopId,
      appKey,
      productId: testProductId
    })

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': accessToken
    }

    let apiResults: ApiResult[] = []

    // Generate timestamp for TikTok Shop API
    const timestamp = Math.floor(Date.now() / 1000).toString()

    // Test multiple possible endpoints with correct authentication
    const endpoints = [
      {
        name: 'TikTok Global Shop API v202309 - Products (GET)',
        url: `https://open-api.tiktokglobalshop.com/product/202309/products?app_key=${appKey}&access_token=${accessToken}&shop_id=${shopId}&page_size=10&timestamp=${timestamp}`,
        method: 'GET'
      },
      {
        name: 'TikTok Global Shop API v202309 - Products (POST)',
        url: `https://open-api.tiktokglobalshop.com/product/202309/products?app_key=${appKey}&access_token=${accessToken}&timestamp=${timestamp}`,
        method: 'POST',
        body: { shop_id: shopId, page_size: 10 }
      },
      {
        name: 'TikTok Shop API - Products Search',
        url: `https://open-api.tiktokglobalshop.com/product/202309/products/search?app_key=${appKey}&access_token=${accessToken}&timestamp=${timestamp}`,
        method: 'POST',
        body: { shop_id: shopId, page_size: 10 }
      },
      {
        name: 'TikTok Global Shop API - Shop Info',
        url: `https://open-api.tiktokglobalshop.com/shop/202309/shops?app_key=${appKey}&access_token=${accessToken}&shop_id=${shopId}&timestamp=${timestamp}`,
        method: 'GET'
      },
      {
        name: 'TikTok Shop API - Authorization Test',
        url: `https://open-api.tiktokglobalshop.com/authorization/202309/token/get?app_key=${appKey}&access_token=${accessToken}&timestamp=${timestamp}`,
        method: 'GET'
      }
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🧪 Testing: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        
        const requestOptions: any = {
          method: endpoint.method,
          headers: headers
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
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json()
              console.log(`✅ Success:`, data)
              result.data = data
            } else {
              const text = await response.text()
              console.log(`✅ Success (text):`, text)
              result.text = text
            }
          } catch (e) {
            console.log(`✅ Success but failed to parse response:`, e)
            result.text = 'Response received but could not parse'
          }
        } else {
          try {
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json()
              console.log(`❌ Error JSON:`, errorData)
              result.error = errorData
            } else {
              const errorText = await response.text()
              console.log(`❌ Error Text:`, errorText)
              result.errorText = errorText
            }
          } catch (e) {
            console.log(`❌ Error but failed to parse response:`, e)
            result.errorText = 'Error response received but could not parse'
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