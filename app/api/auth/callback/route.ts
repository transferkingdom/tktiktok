import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}?error=auth_failed`)
  }

  if (!code) {
    return NextResponse.redirect(`${request.nextUrl.origin}?error=no_code`)
  }

  try {
    // TikTok Shop Partner API token exchange - normal TikTok OAuth endpoint kullanıyoruz
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(`${request.nextUrl.origin}?error=token_failed`)
    }

    // Store the access token securely
    const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
    
    // Set secure cookies with the tokens
    const accessToken = tokenData.access_token
    const refreshToken = tokenData.refresh_token
    const expiresIn = tokenData.expires_in || 86400

    response.cookies.set('tiktok_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
    })

    response.cookies.set('tiktok_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    })

    return response
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}?error=server_error`)
  }
} 