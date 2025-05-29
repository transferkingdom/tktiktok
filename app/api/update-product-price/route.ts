import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, newPrice } = await request.json()
    
    console.log('=== Update Product Price API Start ===')
    console.log('Product ID:', productId)
    console.log('Variant ID:', variantId)
    console.log('New Price:', newPrice)
    
    // Get access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }
    
    console.log('Using access token:', accessToken.substring(0, 10) + '...')
    
    // TikTok Shop API endpoints for price update
    const endpoints = [
      {
        name: 'TikTok Shop - Update Product',
        url: `https://open-api.tiktokshop.com/product/202309/products/${productId}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>,
        body: JSON.stringify({
          skus: [
            {
              id: variantId,
              price: {
                original_price: newPrice,
                sale_price: newPrice
              }
            }
          ]
        })
      },
      {
        name: 'TikTok Shop - Update SKU Price',
        url: 'https://open-api.tiktokshop.com/product/202309/products/prices/update',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>,
        body: JSON.stringify({
          product_id: productId,
          skus: [
            {
              id: variantId,
              price: {
                original_price: newPrice,
                sale_price: newPrice
              }
            }
          ]
        })
      }
    ]
    
    let updateSuccess = false
    let workingEndpoint = null
    const results = []
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔧 Testing: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        
        const fetchOptions = {
          method: endpoint.method,
          headers: endpoint.headers,
          body: endpoint.body
        }
        
        const response = await fetch(endpoint.url, fetchOptions)
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
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          data: result
        })
        
        console.log(`Status: ${response.status}`)
        console.log(`Response:`, result)
        
        if (response.ok) {
          updateSuccess = true
          workingEndpoint = endpoint.name
          console.log('✅ Price update successful!')
          break
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error with ${endpoint.name}:`, error)
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    if (!updateSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Price update failed on all endpoints',
        product_id: productId,
        variant_id: variantId,
        new_price: newPrice,
        attempted_endpoints: results.length,
        test_results: results
      }, { status: 400 })
    }
    
    console.log(`✅ Price successfully updated via ${workingEndpoint}`)
    
    return NextResponse.json({
      success: true,
      working_endpoint: workingEndpoint,
      product_id: productId,
      variant_id: variantId,
      new_price: newPrice,
      message: 'Price updated successfully',
      test_results: results
    })
    
  } catch (error) {
    console.error('❌ Update Product Price Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update product price', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 