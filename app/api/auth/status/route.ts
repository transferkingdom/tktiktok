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
      tokenValue: accessToken?.substring(0, 10) + '...' || 'none'
    })

    if (accessToken && (accessToken !== 'shop_authorized' || shopId)) {
      return NextResponse.json({
        authorized: true,
        shop_id: shopId,
        token_type: accessToken === 'shop_authorized' ? 'dummy' : 'real'
      })
    }

    return NextResponse.json({
      authorized: false,
      reason: 'No valid access token found'
    })
  } catch (error) {
    console.error('Error checking auth status:', error)
    return NextResponse.json(
      { authorized: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 