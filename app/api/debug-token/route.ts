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
    
    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NOT FOUND')
    console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'NOT FOUND')
    console.log('Shop ID from cookie:', shopId)
    console.log('Hard-coded Shop ID:', hardCodedShopId)
    console.log('Open ID:', openId)
    console.log('Seller Name:', sellerName)
    
    return NextResponse.json({
      success: true,
      token_info: {
        access_token_present: !!accessToken,
        access_token_preview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
        access_token_length: accessToken?.length || 0,
        refresh_token_present: !!refreshToken,
        refresh_token_preview: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
        shop_id_from_cookie: shopId,
        hard_coded_shop_id: hardCodedShopId,
        open_id: openId,
        seller_name: sellerName,
        shop_id_match: shopId === hardCodedShopId,
        all_cookies: Object.fromEntries(
          Array.from(cookieStore.getAll()).map(cookie => [
            cookie.name,
            cookie.name.includes('token') ? 
              `${cookie.value.substring(0, 10)}...` : 
              cookie.value
          ])
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