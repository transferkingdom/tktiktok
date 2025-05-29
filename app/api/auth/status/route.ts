import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Checking Auth Status ===')
    
    const cookieStore = cookies()
    
    // Check for TikTok Shop Partner tokens first (preferred)
    const tiktokShopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const tiktokShopId = cookieStore.get('tiktok_shop_id')?.value
    
    // Check for legacy TikTok tokens 
    const legacyAccessToken = cookieStore.get('tiktok_access_token')?.value
    const legacyShopId = cookieStore.get('shop_id')?.value
    
    console.log('TikTok Shop Partner Token:', tiktokShopAccessToken ? 'Present' : 'Missing')
    console.log('TikTok Shop Partner Shop ID:', tiktokShopId || 'Missing')
    console.log('Legacy TikTok Token:', legacyAccessToken ? 'Present' : 'Missing')
    console.log('Legacy Shop ID:', legacyShopId || 'Missing')
    
    // Prefer TikTok Shop Partner authentication
    if (tiktokShopAccessToken) {
      console.log('✅ User authorized via TikTok Shop Partner')
      return NextResponse.json({
        authorized: true,
        auth_type: 'tiktok_shop_partner',
        shop_id: tiktokShopId,
        token_type: 'TikTok Shop Partner'
      })
    }
    
    // Fallback to legacy TikTok authentication
    if (legacyAccessToken) {
      console.log('⚠️ User authorized via Legacy TikTok (may not work with Shop APIs)')
      return NextResponse.json({
        authorized: true,
        auth_type: 'legacy_tiktok',
        shop_id: legacyShopId,
        token_type: 'Legacy TikTok',
        warning: 'Using legacy TikTok token - TikTok Shop Partner authentication recommended'
      })
    }
    
    console.log('❌ User not authorized')
    return NextResponse.json({
      authorized: false,
      auth_type: null,
      message: 'No valid authentication tokens found'
    })
    
  } catch (error) {
    console.error('❌ Auth Status Error:', error)
    return NextResponse.json({
      authorized: false,
      error: 'Failed to check auth status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 