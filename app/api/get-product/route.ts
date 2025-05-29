import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== Get Product API Start ===')
    console.log('Product ID:', productId)
    
    // Get access token from cookies - prioritize TikTok Shop Partner tokens
    const cookieStore = cookies()
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const legacyAccessToken = cookieStore.get('tiktok_access_token')?.value
    const accessToken = shopAccessToken || legacyAccessToken
    const shopId = cookieStore.get('tiktok_shop_id')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }
    
    const tokenType = shopAccessToken ? 'TikTok Shop Partner' : 'Legacy TikTok'
    console.log('Using access token type:', tokenType)
    console.log('Using access token:', accessToken.substring(0, 10) + '...')
    
    // TikTok Shop API endpoints - Updated URLs
    const endpoints = [
      {
        name: 'TikTok Shop API - Product Details',
        url: `https://open-api.tiktokshop.com/api/products/details/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
          'shop-id': shopId
        } as Record<string, string>
      },
      {
        name: 'TikTok Shop API - Product Search',
        url: 'https://open-api.tiktokshop.com/api/products/search',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
          'shop-id': shopId
        } as Record<string, string>,
        body: JSON.stringify({
          page_size: 20,
          page_number: 1,
          search_type: "product_id",
          search_content: productId
        })
      }
    ]
    
    let productData = null
    let workingEndpoint = null
    const results = []
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing: ${endpoint.name}`)
        
        let finalUrl = endpoint.url
        console.log(`URL: ${finalUrl}`)
        
        const fetchOptions = {
          method: endpoint.method,
          headers: endpoint.headers,
          ...(endpoint.body && { body: endpoint.body })
        }
        
        const response = await fetch(finalUrl, fetchOptions)
        const responseText = await response.text()
        
        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          result = { raw_response: responseText }
        }
        
        results.push({
          endpoint: endpoint.name,
          url: finalUrl,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          data: result
        })
        
        console.log(`Status: ${response.status}`)
        console.log(`Response keys:`, Object.keys(result || {}))
        
        // Check if we got valid product data
        if (response.ok && result) {
          if (result.data && result.data.products && Array.isArray(result.data.products) && result.data.products.length > 0) {
            productData = result.data.products[0]
            workingEndpoint = endpoint.name
            console.log('✅ Product found via data.products array!')
            break
          } else if (result.data && (result.data.id || result.data.product_id)) {
            productData = result.data
            workingEndpoint = endpoint.name
            console.log('✅ Product found via data field!')
            break
          }
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
    
    if (!productData) {
      return NextResponse.json({
        success: false,
        error: 'Product not found in any API endpoint',
        product_id: productId,
        attempted_endpoints: results.length,
        test_results: results,
        suggestions: [
          'Verify the product ID is correct',
          'Check if your access token has read permissions', 
          'Ensure the product exists in your TikTok Shop',
          'Try refreshing your access token',
          'Contact TikTok Shop support if the issue persists'
        ]
      }, { status: 404 })
    }
    
    // Format the product data for frontend
    const formattedProduct = {
      id: productData.id || productData.product_id || productId,
      name: productData.name || productData.title || 'Unknown Product',
      status: productData.status || 'Unknown',
      description: productData.description || '',
      category: productData.category_name || '',
      variants: []
    }
    
    // Format variants/SKUs
    if (productData.skus && Array.isArray(productData.skus)) {
      formattedProduct.variants = productData.skus.map((sku: any) => ({
        id: sku.id || sku.sku_id,
        seller_sku: sku.seller_sku,
        title: sku.sales_attributes?.map((attr: any) => `${attr.attribute_name}: ${attr.value_name}`).join(', ') || sku.seller_sku,
        price: {
          original: sku.price?.original_price || '0',
          sale: sku.price?.sale_price || sku.price?.original_price || '0'
        },
        quantity: sku.inventory?.quantity || 0,
        attributes: sku.sales_attributes || []
      }))
    }
    
    console.log(`✅ Product successfully retrieved via ${workingEndpoint}`)
    console.log(`Product: ${formattedProduct.name}`)
    console.log(`Variants: ${formattedProduct.variants.length}`)
    
    return NextResponse.json({
      success: true,
      working_endpoint: workingEndpoint,
      product: formattedProduct,
      raw_data: productData,
      test_results: results
    })
    
  } catch (error) {
    console.error('❌ Get Product Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get product', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 