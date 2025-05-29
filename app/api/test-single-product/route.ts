import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { productId, variant, sku } = await request.json()
    
    console.log('=== Single Product Test Start ===')
    console.log('Target Product:', { productId, variant, sku })
    
    // Get access token from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const shopId = "7431862995146491691"
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }
    
    console.log('Using access token:', accessToken.substring(0, 10) + '...')
    
    // Test multiple API endpoints to find the product
    const endpoints = [
      {
        name: 'TikTok Shop Global API - Product Details',
        url: `https://open-api.tiktokglobalshop.com/product/202309/products/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Shop-Id': shopId
        }
      },
      {
        name: 'TikTok Shop API - Product Search',
        url: 'https://open-api.tiktokshop.com/product/202309/products/search',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Shop-Id': shopId
        },
        body: JSON.stringify({
          page_size: 10,
          page_token: "",
          search: {
            product_ids: [productId]
          }
        })
      },
      {
        name: 'TikTok Shop API - Get Product',
        url: `https://open-api.tiktokshop.com/product/202309/products/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Shop-Id': shopId
        }
      }
    ]
    
    let productFound = false
    let productData = null
    let workingEndpoint = null
    const testResults = []
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        
        const fetchOptions = {
          method: endpoint.method,
          headers: endpoint.headers,
          ...(endpoint.body && { body: endpoint.body })
        }
        
        const response = await fetch(endpoint.url, fetchOptions)
        const responseText = await response.text()
        
        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          result = { raw_response: responseText }
        }
        
        testResults.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          data: result
        })
        
        console.log(`Status: ${response.status}`)
        console.log(`Response:`, result)
        
        if (response.ok && result && (result.data || result.products)) {
          productFound = true
          productData = result
          workingEndpoint = endpoint.name
          console.log('✅ Product found!')
          break
        }
        
      } catch (error) {
        console.error(`❌ Error with ${endpoint.name}:`, error)
        testResults.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    // If no real API worked, create demo data for testing
    if (!productFound) {
      console.log('⚠️ No working API found, using demo data for testing')
      productData = {
        demo: true,
        data: {
          id: productId,
          name: "Test Product - Your Specific Item",
          status: "ACTIVE",
          skus: [
            {
              id: sku,
              seller_sku: sku,
              outer_sku: sku,
              price: {
                original_price: "19.99",
                sale_price: "19.99"
              },
              sales_attributes: [
                {
                  attribute_name: "Size",
                  value_name: variant
                }
              ],
              inventory: {
                quantity: 100
              }
            },
            {
              id: "USA344",
              seller_sku: "USA344", 
              outer_sku: "USA344",
              price: {
                original_price: "19.99",
                sale_price: "19.99"
              },
              sales_attributes: [
                {
                  attribute_name: "Size", 
                  value_name: "Unisex - S & M ( 10\" )"
                }
              ],
              inventory: {
                quantity: 50
              }
            }
          ]
        }
      }
      workingEndpoint = "Demo Mode"
    }
    
    // Now test price update for the specific variant
    const targetVariant = productData.data.skus?.find((s: any) => 
      s.seller_sku === sku || 
      s.outer_sku === sku ||
      s.sales_attributes?.some((attr: any) => attr.value_name === variant)
    )
    
    let priceUpdateResult = null
    if (targetVariant) {
      console.log('🎯 Found target variant:', targetVariant)
      
      // Try to update price (demo mode for now)
      const newPrice = "7.99"
      console.log(`💰 Attempting price update: ${targetVariant.price?.original_price} → ${newPrice}`)
      
      if (productData.demo) {
        priceUpdateResult = {
          demo: true,
          success: true,
          message: "Demo price update successful",
          old_price: targetVariant.price?.original_price,
          new_price: newPrice,
          variant: variant,
          sku: sku
        }
      } else {
        // Real API price update would go here
        priceUpdateResult = {
          success: false,
          message: "Real API price update not implemented yet",
          old_price: targetVariant.price?.original_price,
          new_price: newPrice,
          variant: variant,
          sku: sku
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Single product test completed using ${workingEndpoint}`,
      target: { productId, variant, sku },
      product_found: productFound,
      working_endpoint: workingEndpoint,
      product: {
        id: productData.data?.id,
        name: productData.data?.name,
        status: productData.data?.status,
        total_variants: productData.data?.skus?.length || 0
      },
      target_variant: targetVariant,
      price_update: priceUpdateResult,
      api_test_results: testResults,
      demo_mode: productData.demo || false
    })
    
  } catch (error) {
    console.error('❌ Single Product Test Error:', error)
    return NextResponse.json(
      { 
        error: 'Single product test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 