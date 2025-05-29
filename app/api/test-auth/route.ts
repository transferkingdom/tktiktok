import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Testing TikTok Shop Authentication ===')
    
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const shopId = "7431862995146491691"
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }
    
    console.log('Testing with access token:', accessToken)
    console.log('Access token length:', accessToken.length)
    console.log('Access token starts with:', accessToken.substring(0, 10))
    
    // Test basic shop info endpoint - this should be available
    const testEndpoints = [
      {
        name: 'Shop Info',
        url: `https://open-api.tiktokshop.com/api/shop/get_authorized_shop`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>
      },
      {
        name: 'Shop Info V2',
        url: `https://open-api.tiktokshop.com/shop/get_authorized_shop`,
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>
      },
      {
        name: 'Simple Auth Check',
        url: `https://open-api.tiktokshop.com/api/shop/get_seller_permission`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        } as Record<string, string>
      }
    ]
    
    const results = []
    
    for (const endpoint of testEndpoints) {
      try {
        console.log(`\n🔍 Testing: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: endpoint.headers
        })
        
        const responseText = await response.text()
        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          result = { raw_response: responseText }
        }
        
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          status: response.status,
          success: response.ok,
          headers_sent: endpoint.headers,
          response: result
        })
        
        console.log(`Status: ${response.status}`)
        console.log(`Response:`, result)
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`❌ Error with ${endpoint.name}:`, error)
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      access_token_info: {
        present: true,
        length: accessToken.length,
        preview: accessToken.substring(0, 20) + '...',
        starts_with: accessToken.substring(0, 10)
      },
      shop_id: shopId,
      test_results: results,
      conclusion: results.some(r => r.success) ? 
        'Some endpoints responded successfully' : 
        'All endpoints failed - token might be invalid or endpoints incorrect'
    })
    
  } catch (error) {
    console.error('❌ Auth Test Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test authentication', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 