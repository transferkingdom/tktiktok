import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Callback Processing ===')
    
    const { searchParams } = new URL(request.url)
    const authCode = searchParams.get('auth_code')
    
    console.log('Received auth code:', authCode?.substring(0, 10) + '...')
    
    if (!authCode) {
      console.error('No auth code received')
      return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 })
    }

    // Get environment variables
    const appKey = process.env.TIKTOK_CLIENT_KEY
    const appSecret = process.env.TIKTOK_CLIENT_SECRET

    if (!appKey || !appSecret) {
      console.error('Missing app credentials')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Exchange auth code for access token
    const tokenResponse = await fetch('https://partner.us.tiktokshop.com/service/token/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: appKey,
        app_secret: appSecret,
        auth_code: authCode,
        grant_type: 'authorized_code'
      })
    })

    const tokenData = await tokenResponse.json()
    console.log('Token response:', JSON.stringify(tokenData, null, 2))
    
    if (tokenData.data?.access_token) {
      // Store access token in cookies
      cookies().set('tiktok_shop_access_token', tokenData.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })

      // Store refresh token if available
      if (tokenData.data.refresh_token) {
        cookies().set('tiktok_shop_refresh_token', tokenData.data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      }

      console.log('Authorization successful - redirecting to dashboard')
      return NextResponse.redirect('/dashboard')
    }

    console.error('Failed to get access token:', tokenData)
    return NextResponse.json({ 
      error: 'Failed to get access token',
      details: tokenData 
    }, { status: 500 })
    
  } catch (error) {
    console.error('Callback processing error:', error)
    return NextResponse.json({ 
      error: 'Authorization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 