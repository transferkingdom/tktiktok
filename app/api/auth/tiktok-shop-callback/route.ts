import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Partner OAuth Callback ===')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    console.log('Callback parameters:')
    console.log('- Code:', code ? `${code.substring(0, 20)}...` : 'null')
    console.log('- State:', state)
    console.log('- Error:', error)
    
    if (error) {
      console.error('❌ OAuth Error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=${encodeURIComponent(error)}`)
    }
    
    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=no_code`)
    }
    
    // Exchange code for access token
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'f1a1a446f377780021df9219cb4b029170626997'
    
    console.log('Exchanging code for access token...')
    console.log('Client Key:', clientKey)
    
    // TikTok Shop Partner token endpoint
    const tokenResponse = await fetch('https://partner.tiktokshop.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code'
      }).toString()
    })
    
    const tokenData = await tokenResponse.json()
    
    console.log('Token Response Status:', tokenResponse.status)
    console.log('Token Response:', tokenData)
    
    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed:', tokenData)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`)
    }
    
    // Store tokens in httpOnly cookies
    const cookieStore = cookies()
    
    if (tokenData.access_token) {
      console.log('✅ Storing TikTok Shop access token')
      cookieStore.set('tiktok_shop_access_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenData.access_token_expire_in || 86400 // 24 hours default
      })
    }
    
    if (tokenData.refresh_token) {
      console.log('✅ Storing TikTok Shop refresh token')
      cookieStore.set('tiktok_shop_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenData.refresh_token_expire_in || 86400 * 30 // 30 days default
      })
    }
    
    // Store shop information
    if (tokenData.shop_id) {
      console.log('✅ Storing TikTok Shop ID:', tokenData.shop_id)
      cookieStore.set('tiktok_shop_id', tokenData.shop_id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      })
    }
    
    if (tokenData.shop_name) {
      console.log('✅ Storing TikTok Shop Name:', tokenData.shop_name)
      cookieStore.set('tiktok_shop_name', tokenData.shop_name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      })
    }
    
    console.log('✅ TikTok Shop Partner authorization successful!')
    
    // Redirect back to app with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?success=tiktok_shop_authorized`)
    
  } catch (error) {
    console.error('❌ TikTok Shop Partner Callback Error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
} 