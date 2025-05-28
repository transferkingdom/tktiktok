import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import axios from 'axios'

interface ApiResult {
  name: string
  url: string
  method: string
  status: number | string
  statusText?: string
  success: boolean
  headers?: any
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

// Test access token from user
const ACCESS_TOKEN = 'YW6gdQAAAACtKWVciveiwOD9AsK-pgGH1oZ9kbhNDOq4uCcITr6npA'

interface TestResult {
  name: string
  url: string
  status: number | string
  success: boolean
  error?: string
  data?: any
  statusText?: string
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
    const baseUrls = [
      'https://open-api.tiktokshop.com',
      'https://open-api.tiktokglobalshop.com', 
      'https://partner-api.tiktokshop.com',
      'https://api.tiktokshop.com',
      'https://open.tiktokshop.com'
    ]

    const apiPaths = [
      {
        name: 'Products Search',
        path: '/api/products/search',
        method: 'POST',
        params: {
          app_key: appKey,
          access_token: accessToken,
          timestamp: timestamp,
          shop_id: shopId
        },
        body: { page_size: 10 }
      }
    ]

    for (const baseUrl of baseUrls) {
      for (const endpoint of apiPaths) {
        try {
          console.log(`\n🧪 Testing with Axios: ${baseUrl}${endpoint.path}`)
          
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
          const fullUrl = `${baseUrl}${endpoint.path}?${queryString}`
          
          console.log(`URL: ${fullUrl}`)
          console.log(`Signature: ${signature}`)
          
          try {
            const response = await axios({
              method: endpoint.method,
              url: fullUrl,
              headers: headers,
              data: endpoint.body,
              timeout: 10000
            })
            
            console.log(`✅ Axios Success: ${response.status} ${response.statusText}`)
            console.log('Response data:', response.data)
            
            const result: ApiResult = {
              name: `${baseUrl} - ${endpoint.name}`,
              url: fullUrl,
              method: endpoint.method,
              status: response.status,
              statusText: response.statusText,
              success: true,
              headers: response.headers,
              data: response.data
            }

            apiResults.push(result)

          } catch (axiosError: any) {
            console.error(`❌ Axios Error:`, axiosError.message)
            
            let errorStatus = 'NETWORK_ERROR'
            let errorMessage = axiosError.message
            let errorData = null
            
            if (axiosError.response) {
              errorStatus = axiosError.response.status
              errorMessage = axiosError.response.statusText || axiosError.message
              errorData = axiosError.response.data
              console.log(`Error response: ${errorStatus} ${errorMessage}`)
              console.log('Error data:', errorData)
            } else if (axiosError.request) {
              console.log('No response received:', axiosError.request)
            }
            
            const result: ApiResult = {
              name: `${baseUrl} - ${endpoint.name}`,
              url: fullUrl,
              method: endpoint.method,
              status: errorStatus,
              statusText: errorMessage,
              success: false,
              error: errorData || axiosError.message
            }

            apiResults.push(result)
          }

        } catch (error) {
          console.error(`💥 Unexpected error testing ${baseUrl}:`, error)
          apiResults.push({
            name: `${baseUrl} - ${endpoint.name}`,
            url: 'ERROR',
            method: endpoint.method,
            status: 'ERROR',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    console.log('\n=== DIRECT TOKEN TEST RESULTS ===')
    console.log('Total tests:', apiResults.length)
    console.log('Successful calls:', apiResults.filter(r => r.success).length)
    console.log('Failed calls:', apiResults.filter(r => !r.success).length)

    return NextResponse.json({
      success: true,
      message: 'Direct token test completed with axios',
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