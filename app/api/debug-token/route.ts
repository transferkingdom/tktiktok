import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Token Info ===')
    
    // Get all relevant cookies
    const cookieStore = cookies()
    
    // TikTok Shop Partner tokens (new format)
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const shopRefreshToken = cookieStore.get('tiktok_shop_refresh_token')?.value
    const tiktokShopId = cookieStore.get('tiktok_shop_id')?.value
    const shopName = cookieStore.get('tiktok_shop_name')?.value
    const authMethod = cookieStore.get('tiktok_shop_auth_method')?.value
    const userType = cookieStore.get('tiktok_shop_user_type')?.value
    const scopes = cookieStore.get('tiktok_shop_scopes')?.value
    
    // Legacy tokens (old format)
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const refreshToken = cookieStore.get('tiktok_refresh_token')?.value
    const shopId = cookieStore.get('shop_id')?.value
    const openId = cookieStore.get('tiktok_open_id')?.value
    const sellerName = cookieStore.get('seller_name')?.value
    
    // Hard-coded shop ID we're using
    const hardCodedShopId = "7431862995146491691"
    
    console.log('=== FULL TOKEN DEBUG ===')
    console.log('--- TikTok Shop Partner Tokens ---')
    console.log('Shop Access Token:', shopAccessToken || 'NOT FOUND')
    console.log('Shop Refresh Token:', shopRefreshToken || 'NOT FOUND')
    console.log('TikTok Shop ID:', tiktokShopId)
    console.log('Shop Name:', shopName)
    console.log('Auth Method:', authMethod)
    console.log('User Type:', userType)
    console.log('Scopes:', scopes)
    
    console.log('--- Legacy Tokens ---')
    console.log('Legacy Access Token:', accessToken || 'NOT FOUND')
    console.log('Legacy Refresh Token:', refreshToken || 'NOT FOUND')
    console.log('Legacy Shop ID:', shopId)
    console.log('Open ID:', openId)
    console.log('Seller Name:', sellerName)
    
    console.log('--- Comparisons ---')
    console.log('Hard-coded Shop ID:', hardCodedShopId)
    console.log('Shop ID Match (Shop):', tiktokShopId === hardCodedShopId)
    console.log('Shop ID Match (Legacy):', shopId === hardCodedShopId)
    
    // Get all cookies for debugging
    const allCookies = Array.from(cookieStore.getAll())
    console.log('All cookies:', allCookies)
    
    return NextResponse.json({
      success: true,
      token_info: {
        // TikTok Shop Partner info
        shop_access_token_present: !!shopAccessToken,
        shop_access_token_full: shopAccessToken || null,
        shop_access_token_length: shopAccessToken?.length || 0,
        shop_refresh_token_present: !!shopRefreshToken,
        shop_refresh_token_full: shopRefreshToken || null,
        tiktok_shop_id: tiktokShopId,
        shop_name: shopName,
        auth_method: authMethod,
        user_type: userType,
        scopes: scopes?.split(',') || [],
        
        // Legacy info
        legacy_access_token_present: !!accessToken,
        legacy_access_token_full: accessToken || null,
        legacy_access_token_length: accessToken?.length || 0,
        legacy_refresh_token_present: !!refreshToken,
        legacy_shop_id: shopId,
        open_id: openId,
        seller_name: sellerName,
        
        // Comparisons
        hard_coded_shop_id: hardCodedShopId,
        shop_id_match_current: tiktokShopId === hardCodedShopId,
        shop_id_match_legacy: shopId === hardCodedShopId,
        
        // Diagnosis
        primary_auth_type: shopAccessToken ? 'TikTok Shop Partner' : accessToken ? 'Legacy TikTok' : 'None',
        token_issue: !shopAccessToken && !accessToken ? 'No tokens found' : 
                    shopAccessToken ? 'TikTok Shop Partner token present' : 
                    'Only legacy token present',
        
        all_cookies: Object.fromEntries(
          allCookies.map(cookie => [cookie.name, cookie.value])
        )
      }
    })
    
  } catch (error) {
    console.error('❌ Debug Token Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get debug info', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 