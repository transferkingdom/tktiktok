import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Check for TikTok Shop Partner tokens first (highest priority)
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const shopRefreshToken = cookieStore.get('tiktok_shop_refresh_token')?.value
    const shopId = cookieStore.get('tiktok_shop_id')?.value
    const shopName = cookieStore.get('tiktok_shop_name')?.value
    const authMethod = cookieStore.get('tiktok_shop_auth_method')?.value
    
    if (shopAccessToken) {
      console.log('✅ TikTok Shop Partner authentication found')
      return NextResponse.json({
        authorized: true,
        auth_type: 'tiktok_shop_partner',
        token_type: 'shop_partner',
        token_info: {
          access_token: `${shopAccessToken.substring(0, 20)}...`,
          access_token_length: shopAccessToken.length,
          refresh_token_present: !!shopRefreshToken,
          shop_id: shopId,
          shop_name: shopName,
          auth_method: authMethod
        },
        warning: null
      })
    }
    
    // Check for legacy TikTok tokens (lower priority)
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const refreshToken = cookieStore.get('tiktok_refresh_token')?.value
    const legacyShopId = cookieStore.get('shop_id')?.value
    const sellerName = cookieStore.get('seller_name')?.value
    
    if (accessToken) {
      console.log('⚠️ Legacy TikTok authentication found')
      return NextResponse.json({
        authorized: true,
        auth_type: 'legacy_tiktok',
        token_type: 'social_media',
        token_info: {
          access_token: `${accessToken.substring(0, 20)}...`,
          access_token_length: accessToken.length,
          refresh_token_present: !!refreshToken,
          shop_id: legacyShopId,
          seller_name: sellerName
        },
        warning: 'Using legacy TikTok token - TikTok Shop Partner authentication recommended'
      })
    }
    
    // No authentication found
    console.log('❌ No authentication found')
    return NextResponse.json({
      authorized: false,
      auth_type: null,
      token_type: null,
      token_info: null,
      warning: null
    })
    
  } catch (error) {
    console.error('❌ Auth status check error:', error)
    return NextResponse.json({
      authorized: false,
      auth_type: 'error',
      token_type: null,
      token_info: null,
      warning: `Error checking authentication: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
} 