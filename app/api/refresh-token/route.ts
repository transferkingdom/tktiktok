import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Token Refresh Start ===')
    
    // Get refresh token from cookies
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('tiktok_refresh_token')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      )
    }
    
    // TikTok Shop credentials
    const app_key = process.env.TIKTOK_CLIENT_KEY || "6e8q3qfuc5iqv"
    const app_secret = process.env.TIKTOK_CLIENT_SECRET || "f1a1a446f377780021df9219cb4b029170626997"
    
    console.log('🔄 Refreshing token with:', {
      app_key,
      app_secret: app_secret.substring(0, 10) + '...',
      refresh_token: refreshToken.substring(0, 10) + '...'
    })
    
    // Build URL with query parameters
    const refreshUrl = new URL('https://auth.tiktok-shops.com/api/v2/token/refresh')
    refreshUrl.searchParams.append('app_key', app_key)
    refreshUrl.searchParams.append('app_secret', app_secret)
    refreshUrl.searchParams.append('refresh_token', refreshToken)
    refreshUrl.searchParams.append('grant_type', 'refresh_token')
    
    console.log('🌐 Refresh URL:', refreshUrl.toString())
    
    // Make refresh request
    const response = await fetch(refreshUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TikTokShop-PriceUpdater/1.0'
      }
    })
    
    const responseText = await response.text()
    console.log('📨 Raw response:', responseText)
    
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e)
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response',
        raw_response: responseText,
        status: response.status
      })
    }
    
    if (response.ok && result.code === 0) {
      console.log('✅ Token refresh successful!')
      console.log('📦 New tokens:', {
        access_token: result.data.access_token?.substring(0, 10) + '...',
        refresh_token: result.data.refresh_token?.substring(0, 10) + '...',
        access_token_expire_in: result.data.access_token_expire_in,
        refresh_token_expire_in: result.data.refresh_token_expire_in
      })
      
      // Set new tokens in cookies
      const responseWithCookies = NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: result.data.access_token?.substring(0, 10) + '...',
          access_token_expire_in: result.data.access_token_expire_in,
          refresh_token_expire_in: result.data.refresh_token_expire_in
        }
      })
      
      // Set httpOnly cookies
      responseWithCookies.cookies.set('tiktok_access_token', result.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 7 // 7 days
      })
      
      responseWithCookies.cookies.set('tiktok_refresh_token', result.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 365 // 1 year
      })
      
      return responseWithCookies
      
    } else {
      console.error('❌ Token refresh failed:', result)
      return NextResponse.json({
        success: false,
        error: 'Token refresh failed',
        details: result,
        status: response.status
      })
    }
    
  } catch (error) {
    console.error('❌ Refresh Token Error:', error)
    return NextResponse.json(
      { 
        error: 'Token refresh failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 