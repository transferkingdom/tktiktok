import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Get Authorized Shops API Start ===')
    
    // Get access token from cookies
    const cookieStore = cookies()
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const legacyAccessToken = cookieStore.get('tiktok_access_token')?.value
    const accessToken = shopAccessToken || legacyAccessToken
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }
    
    console.log('Using access token:', accessToken.substring(0, 10) + '...')
    
    // Call TikTok Shop API to get authorized shops
    const response = await fetch('https://open-api.tiktokglobalshop.com/authorization/202309/shops', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Tts-Access-Token': accessToken
      }
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response keys:', Object.keys(data || {}))
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Failed to get authorized shops',
          details: data
        },
        { status: response.status }
      )
    }
    
    return NextResponse.json({
      success: true,
      shops: data.data?.shops || [],
      raw_response: data
    })
    
  } catch (error) {
    console.error('❌ Get Authorized Shops Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get authorized shops', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 