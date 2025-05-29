import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Disconnect: Revoking TikTok Shop access ===')
    
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_shop_access_token')?.value
    
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'No active TikTok Shop connection found'
      })
    }

    // Try to revoke the access token with TikTok Shop API
    try {
      const response = await fetch('https://api-us.tiktokshop.com/api/auth/token/revoke', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.warn('Failed to revoke token with TikTok Shop API:', response.status)
      }
    } catch (error) {
      console.error('Error revoking token with TikTok Shop API:', error)
    }

    // Clear TikTok Shop specific cookies
    const shopCookies = [
      'tiktok_shop_access_token',
      'tiktok_shop_refresh_token',
      'tiktok_shop_id',
      'tiktok_shop_name',
      'tiktok_shop_auth_method',
      'tiktok_shop_open_id',
      'tiktok_shop_seller_name'
    ]

    shopCookies.forEach(cookieName => {
      try {
        cookieStore.set(cookieName, '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0,
          expires: new Date(0)
        })
        console.log(`✅ Cleared cookie: ${cookieName}`)
      } catch (error) {
        console.error(`❌ Error clearing cookie ${cookieName}:`, error)
      }
    })

    console.log('✅ Disconnect successful - TikTok Shop cookies cleared')
    
    return NextResponse.json({
      success: true,
      message: 'TikTok Shop disconnected successfully',
      cleared_cookies: shopCookies
    })
    
  } catch (error) {
    console.error('❌ Disconnect Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to disconnect from TikTok Shop', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 