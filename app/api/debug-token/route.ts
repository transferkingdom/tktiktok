import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Debug Token Info ===')
    
    // Get all relevant cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get('tiktok_access_token')?.value
    const refreshToken = cookieStore.get('tiktok_refresh_token')?.value
    const shopId = cookieStore.get('tiktok_shop_id')?.value
    const openId = cookieStore.get('tiktok_open_id')?.value
    const sellerName = cookieStore.get('tiktok_seller_name')?.value
    
    // Hard-coded shop ID we're using
    const hardCodedShopId = "7431862995146491691"
    
    console.log('=== FULL TOKEN DEBUG ===')
    console.log('Full Access Token:', accessToken || 'NOT FOUND')
    console.log('Full Refresh Token:', refreshToken || 'NOT FOUND')
    console.log('Shop ID from cookie:', shopId)
    console.log('Hard-coded Shop ID:', hardCodedShopId)
    console.log('Open ID:', openId)
    console.log('Seller Name:', sellerName)
    console.log('Shop ID Match:', shopId === hardCodedShopId)
    
    // Get all cookies for debugging
    const allCookies = Array.from(cookieStore.getAll())
    console.log('All cookies:', allCookies)
    
    return NextResponse.json({
      success: true,
      token_info: {
        access_token_present: !!accessToken,
        access_token_full: accessToken || null,
        access_token_length: accessToken?.length || 0,
        refresh_token_present: !!refreshToken,
        refresh_token_full: refreshToken || null,
        shop_id_from_cookie: shopId,
        shop_id_from_cookie_type: typeof shopId,
        hard_coded_shop_id: hardCodedShopId,
        hard_coded_shop_id_type: typeof hardCodedShopId,
        open_id: openId,
        seller_name: sellerName,
        shop_id_match: shopId === hardCodedShopId,
        shop_id_problem: shopId === "Transfer Kingdom" ? "WRONG - This is seller name, not shop ID!" : "Check shop ID",
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