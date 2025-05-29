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
    
    // TikTok Shop API endpoints for price update based on documentation
    const endpoints = [
      {
        name: 'TikTok Shop API - Update Product Prices',
        url: 'https://open-api.tiktokshop.com/api/products/prices',
        method: 'PUT',
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
                original_price: parseFloat(newPrice).toFixed(2),
                sale_price: parseFloat(newPrice).toFixed(2)
              }
            }
          ]
        })
      },
      {
        name: 'TikTok Shop API - Bulk Update SKU Price',
        url: 'https://open-api.tiktokshop.com/api/products/sku/prices/update',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>,
        body: JSON.stringify({
          updates: [
            {
              product_id: productId,
              sku_id: variantId,
              original_price: parseFloat(newPrice).toFixed(2),
              sale_price: parseFloat(newPrice).toFixed(2)
            }
          ]
        })
      },
      {
        name: 'TikTok Shop API - Legacy Update Product',
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
                original_price: parseFloat(newPrice).toFixed(2),
                sale_price: parseFloat(newPrice).toFixed(2)
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
        console.log(`Body:`, JSON.parse(endpoint.body))
        
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
        
        // Consider it successful if status is 200-299 or if response indicates success
        if (response.ok || (result && (result.success === true || result.code === 0))) {
          updateSuccess = true
          workingEndpoint = endpoint.name
          console.log('✅ Price update successful!')
          break
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200))
        
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
        error: 'Price update failed on all endpoints. Check API documentation for correct format.',
        product_id: productId,
        variant_id: variantId,
        new_price: newPrice,
        attempted_endpoints: results.length,
        test_results: results,
        suggestions: [
          'Verify your TikTok Shop API access permissions',
          'Check if the product and variant IDs are correct',
          'Ensure your access token has write permissions',
          'Refer to TikTok Shop Partner Center API documentation'
        ]
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