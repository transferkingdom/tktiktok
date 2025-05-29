import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Callback Processing ===')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    console.log('Full URL:', request.url)
    console.log('All params:', Object.fromEntries(searchParams.entries()))
    console.log('Received code:', code?.substring(0, 10) + '...')
    console.log('Received state:', state)
    
    if (!code) {
      console.error('No authorization code received')
      return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 })
    }

    // Get environment variables
    const appKey = process.env.TIKTOK_CLIENT_KEY
    const appSecret = process.env.TIKTOK_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'

    if (!appKey || !appSecret) {
      console.error('Missing app credentials')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Construct token URL with parameters
    const tokenUrl = new URL('https://auth.tiktok-shops.com/api/v2/token/get')
    tokenUrl.searchParams.append('app_key', appKey)
    tokenUrl.searchParams.append('app_secret', appSecret)
    tokenUrl.searchParams.append('auth_code', code)
    tokenUrl.searchParams.append('grant_type', 'authorized_code')

    console.log('Token URL:', tokenUrl.toString().replace(appSecret, '***'))

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    // Log the raw response for debugging
    const rawResponse = await tokenResponse.text()
    console.log('Raw token response:', rawResponse)

    let tokenData
    try {
      tokenData = JSON.parse(rawResponse)
    } catch (e) {
      console.error('Failed to parse token response:', e)
      return NextResponse.redirect(`${baseUrl}?error=invalid_token_response`)
    }

    console.log('Parsed token response:', JSON.stringify(tokenData, null, 2))
    
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

      // Store additional data
      if (tokenData.data.open_id) {
        cookies().set('tiktok_shop_open_id', tokenData.data.open_id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      }

      if (tokenData.data.seller_name) {
        cookies().set('tiktok_shop_seller_name', tokenData.data.seller_name, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      }

      console.log('Authorization successful - redirecting to dashboard')
      return NextResponse.redirect(`${baseUrl}/dashboard`)
    }

    console.error('Failed to get access token:', tokenData)
    return NextResponse.redirect(`${baseUrl}?error=token_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`)
    
  } catch (error) {
    console.error('Callback processing error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'
    return NextResponse.redirect(`${baseUrl}?error=callback_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
} 