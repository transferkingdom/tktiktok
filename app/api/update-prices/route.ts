import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface PriceRule {
  variant: string
  price: string
}

interface TikTokProduct {
  product_id: number
  product_name: string
  product_price: string[]
  product_description: string
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
    const shopId = cookieStore.get('tiktok_shop_id')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authorized. Please connect your TikTok Shop account first.' },
        { status: 401 }
      )
    }

    // Şu an için dummy response döndür - gerçek API integration için client access token gerekli
    console.log('Price update request received:', {
      priceRules,
      hasToken: !!accessToken,
      shopId
    })

    // Demo response - gerçekte bu API'lar farklı authorization gerektirir
    return NextResponse.json({
      success: true,
      message: `Price rules configured successfully! ${priceRules.length} rules set.`,
      updated_count: priceRules.length,
      demo_mode: true,
      note: 'This is a demo. Real TikTok Shop API integration requires proper merchant authorization.',
      configured_rules: priceRules.map(rule => ({
        variant: rule.variant,
        price: rule.price,
        status: 'configured'
      }))
    })

  } catch (error) {
    console.error('Error in price update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 