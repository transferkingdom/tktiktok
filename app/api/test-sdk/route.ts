import { NextRequest, NextResponse } from 'next/server'
import { ClientConfiguration, TikTokShopNodeApiClient } from '../../lib/tiktok-sdk/index'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== TikTok SDK Test Start ===')
    
    // Configure SDK with our credentials
    ClientConfiguration.globalConfig.app_key = "6e8q3qfuc5iqv"
    ClientConfiguration.globalConfig.app_secret = "f1a1a446f377780021df9219cb4b029170626997"
    
    const access_token = "YW6gdQAAAACtKWVciveiwOD9AsK-pgGH1oZ9kbhNDOq4uCcITr6npA"
    
    // Create client instance
    const client = new TikTokShopNodeApiClient({
      config: new ClientConfiguration(
        "6e8q3qfuc5iqv", // app_key
        "f1a1a446f377780021df9219cb4b029170626997", // app_secret
        "https://open-api.tiktokglobalshop.com" // basePath
      ),
    })
    
    console.log('SDK configured:', {
      app_key: ClientConfiguration.globalConfig.app_key,
      app_secret: ClientConfiguration.globalConfig.app_secret?.substring(0, 10) + '...',
      access_token: access_token.substring(0, 10) + '...',
      sandbox: false
    })
    
    try {
      console.log('🚀 Making Product Search API call with SDK...')
      
      // Use the latest Product API (V202502)
      const result = await client.api.ProductV202502Api.ProductsSearchPost(
        10, // page_size
        access_token, // x-tts-access-token
        'application/json', // content-type
        undefined, // page_token (optional)
        undefined, // shop_cipher (optional)
        {} // SearchProductsRequestBody (optional)
      )
      
      console.log('✅ SDK API call successful!')
      console.log('Response status:', result.response.statusCode)
      console.log('Response data:', JSON.stringify(result.body, null, 2))
      
      return NextResponse.json({
        success: true,
        message: 'TikTok SDK test completed successfully',
        access_token: access_token.substring(0, 10) + '...',
        response: {
          status: result.response.statusCode,
          statusMessage: result.response.statusMessage,
          data: result.body
        }
      })
      
    } catch (apiError: any) {
      console.error('❌ SDK API Error:', apiError)
      
      let errorDetails = {
        message: apiError.message,
        status: apiError.status,
        body: apiError.body
      }
      
      if (apiError.response) {
        errorDetails.status = apiError.response.statusCode
        console.error('Error response status:', apiError.response.statusCode)
        console.error('Error response body:', apiError.body)
      }
      
      return NextResponse.json({
        success: false,
        message: 'SDK API call failed',
        error: errorDetails
      })
    }
    
  } catch (error) {
    console.error('❌ SDK Test Error:', error)
    return NextResponse.json(
      { 
        error: 'SDK test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 