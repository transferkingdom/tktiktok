import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const shopId = cookieStore.get('tiktok_shop_id')?.value
    
    console.log('Auth status check:', {
      hasAccessToken: !!accessToken,
      hasShopId: !!shopId,
      tokenValue: accessToken?.substring(0, 15) + '...' || 'none',
      allCookies: cookieStore.getAll().map(c => c.name)
    })

    // Herhangi bir access token varsa authorized say
    if (accessToken) {
      return NextResponse.json({
        authorized: true,
        shop_id: shopId,
        token_type: accessToken.includes('shop_authorized') ? 'shop' : 'oauth',
        token_preview: accessToken.substring(0, 15) + '...'
      })
    }

    return NextResponse.json({
      authorized: false,
      reason: 'No access token found',
      available_cookies: cookieStore.getAll().map(c => c.name)
    })
  } catch (error) {
    console.error('Error checking auth status:', error)
    return NextResponse.json(
      { authorized: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 