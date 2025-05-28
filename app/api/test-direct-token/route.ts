import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

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

// Generate TikTok Shop API signature
function generateSignature(appSecret: string, path: string, queryParams: any): string {
  // Sort parameters
  const sortedParams = Object.keys(queryParams)
    .sort()
    .map(key => `${key}${queryParams[key]}`)
    .join('')
  
  // Create sign string: app_secret + path + sorted_params + app_secret
  const signString = appSecret + path + sortedParams + appSecret
  
  // Generate HMAC-SHA256 signature
  const signature = crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
  
  return signature
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

    // Test TikTok Shop Partner API endpoints with signature
    const endpoints = [
      {
        name: 'TikTok Shop Partner API - Get Products',
        path: '/api/products/search',
        method: 'POST',
        params: {
          app_key: appKey,
          access_token: accessToken,
          timestamp: timestamp,
          shop_id: shopId
        },
        body: { page_size: 10 }
      },
      {
        name: 'TikTok Shop Partner API - Product Details',
        path: '/api/products/details',
        method: 'POST',
        params: {
          app_key: appKey,
          access_token: accessToken,
          timestamp: timestamp,
          shop_id: shopId
        },
        body: { product_ids: [testProductId] }
      },
      {
        name: 'TikTok Shop Partner API - Shop Info',
        path: '/api/shop/get_authorized_shop',
        method: 'POST',
        params: {
          app_key: appKey,
          access_token: accessToken,
          timestamp: timestamp
        },
        body: {}
      }
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🧪 Testing: ${endpoint.name}`)
        
        // Generate signature
        const signature = generateSignature(appSecret, endpoint.path, endpoint.params)
        
        // Add signature to params
        const fullParams = {
          ...endpoint.params,
          sign: signature
        }
        
        // Build URL
        const queryString = Object.entries(fullParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')
        const fullUrl = `https://open-api.tiktokshop.com${endpoint.path}?${queryString}`
        
        console.log(`URL: ${fullUrl}`)
        console.log(`Signature: ${signature}`)
        
        const requestOptions: any = {
          method: endpoint.method,
          headers: headers
        }

        if (endpoint.body && endpoint.method === 'POST') {
          requestOptions.body = JSON.stringify(endpoint.body)
        }

        const response = await fetch(fullUrl, requestOptions)
        
        console.log(`Response: ${response.status} ${response.statusText}`)
        
        const result: ApiResult = {
          name: endpoint.name,
          url: fullUrl,
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
          url: 'ERROR',
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
      message: 'Direct token test completed with signature',
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