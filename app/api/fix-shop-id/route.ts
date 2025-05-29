import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Fixing Shop ID ===')
    
    const cookieStore = cookies()
    const response = NextResponse.json({ success: true, message: 'Shop ID fixed successfully' })
    
    // Correct shop ID
    const correctShopId = "7431862995146491691"
    
    // Clear existing wrong shop_id cookie and set correct one
    response.cookies.set('tiktok_shop_id', correctShopId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    })
    
    console.log('✅ Fixed shop_id cookie to:', correctShopId)
    
    // Keep seller name in separate cookie
    response.cookies.set('tiktok_seller_name', 'Transfer Kingdom', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    })
    
    console.log('✅ Set seller_name cookie to: Transfer Kingdom')
    
    return response
    
  } catch (error) {
    console.error('❌ Fix Shop ID Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fix shop ID', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 