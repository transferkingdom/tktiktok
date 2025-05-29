import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()
    
    console.log('=== Get Product API Start ===')
    console.log('Product ID:', productId)
    
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
    
    // TikTok Shop API endpoints to try
    const endpoints = [
      {
        name: 'TikTok Shop - Get Product Details',
        url: `https://open-api.tiktokshop.com/product/202309/products/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>
      },
      {
        name: 'TikTok Shop - Get Product with Shop ID',
        url: `https://open-api.tiktokshop.com/product/202309/products/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
          'shop-id': shopId
        } as Record<string, string>
      },
      {
        name: 'TikTok Shop - Search Products',
        url: 'https://open-api.tiktokshop.com/product/202309/products/search',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>,
        body: JSON.stringify({
          page_size: 50,
          search_type: 1,
          product_ids: [productId]
        })
      },
      {
        name: 'TikTok Shop Global - Get Product',
        url: `https://open-api.tiktokglobalshop.com/product/202309/products/${productId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken
        } as Record<string, string>
      }
    ]
    
    let productData = null
    let workingEndpoint = null
    const results = []
    
    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing: ${endpoint.name}`)
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
        
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          success: response.ok,
          data: result
        })
        
        console.log(`Status: ${response.status}`)
        console.log(`Response keys:`, Object.keys(result || {}))
        
        // Check if we got valid product data
        if (response.ok && result) {
          if (result.data && (result.data.id || result.data.product_id)) {
            productData = result.data
            workingEndpoint = endpoint.name
            console.log('✅ Product found via data field!')
            break
          } else if (result.products && Array.isArray(result.products) && result.products.length > 0) {
            productData = result.products[0]
            workingEndpoint = endpoint.name
            console.log('✅ Product found via products array!')
            break
          } else if (result.product) {
            productData = result.product
            workingEndpoint = endpoint.name
            console.log('✅ Product found via product field!')
            break
          }
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
    
    if (!productData) {
      return NextResponse.json({
        success: false,
        error: 'Product not found in any API endpoint',
        product_id: productId,
        attempted_endpoints: results.length,
        test_results: results
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
      raw_data: productData, // For debugging
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