import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface PriceRule {
  variant: string
  price: string
}

interface TikTokProduct {
  id: string
  title: string
  variants: Array<{
    id: string
    title: string
    price: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const { priceRules }: { priceRules: PriceRule[] } = await request.json()
    
    if (!priceRules || priceRules.length === 0) {
      return NextResponse.json(
        { error: 'No price rules provided' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authorized. Please connect your TikTok Shop account first.' },
        { status: 401 }
      )
    }

    // Get products from TikTok Shop
    const productsResponse = await fetch('https://open-api.tiktokglobalshop.com/product/202309/products/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-tts-access-token': accessToken,
      },
      body: JSON.stringify({
        page_size: 100,
        page_number: 1,
      }),
    })

    if (!productsResponse.ok) {
      const errorData = await productsResponse.json()
      console.error('Failed to fetch products:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch products from TikTok Shop' },
        { status: 500 }
      )
    }

    const productsData = await productsResponse.json()
    const products: TikTokProduct[] = productsData.data?.products || []

    let updatedCount = 0
    const errors: string[] = []

    // Process each product and update prices based on variant titles
    for (const product of products) {
      for (const variant of product.variants || []) {
        // Find matching price rule
        const matchingRule = priceRules.find(rule => 
          variant.title.toLowerCase().includes(rule.variant.toLowerCase())
        )

        if (matchingRule && matchingRule.price) {
          try {
            // Update variant price
            const updateResponse = await fetch('https://open-api.tiktokglobalshop.com/product/202309/products/prices', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'x-tts-access-token': accessToken,
              },
              body: JSON.stringify({
                product_id: product.id,
                skus: [{
                  id: variant.id,
                  price: {
                    amount: parseFloat(matchingRule.price) * 100, // Convert to cents
                    currency: 'USD'
                  }
                }]
              }),
            })

            if (updateResponse.ok) {
              updatedCount++
            } else {
              const errorData = await updateResponse.json()
              errors.push(`Failed to update ${product.title} - ${variant.title}: ${errorData.message || 'Unknown error'}`)
            }
          } catch (error) {
            errors.push(`Error updating ${product.title} - ${variant.title}: ${error}`)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} variants`,
      updated_count: updatedCount,
      errors: errors,
    })

  } catch (error) {
    console.error('Error in price update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 