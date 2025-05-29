import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Logout: Clearing all cookies ===')
    
    const cookieStore = cookies()
    
    // Clear all TikTok-related cookies
    const cookiesToClear = [
      'tiktok_access_token',
      'tiktok_refresh_token', 
      'tiktok_shop_access_token',
      'tiktok_shop_refresh_token',
      'tiktok_shop_id',
      'tiktok_shop_name',
      'tiktok_shop_auth_method',
      'shop_id',
      'seller_name',
      'open_id'
    ]
    
    cookiesToClear.forEach(cookieName => {
      try {
        cookieStore.set(cookieName, '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0, // Expire immediately
          expires: new Date(0) // Set to past date
        })
        console.log(`✅ Cleared cookie: ${cookieName}`)
      } catch (error) {
        console.error(`❌ Error clearing cookie ${cookieName}:`, error)
      }
    })
    
    console.log('✅ Logout successful - all cookies cleared')
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      cleared_cookies: cookiesToClear
    })
    
  } catch (error) {
    console.error('❌ Logout Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to logout', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 