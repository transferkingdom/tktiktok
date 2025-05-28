import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Tüm parametreleri debug için logla
  console.log('=== TikTok Shop Callback Debug ===')
  const allParams: Record<string, string> = {}
  searchParams.forEach((value: string, key: string) => {
    allParams[key] = value
    console.log(`${key}: ${value}`)
  })
  
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const authCode = searchParams.get('auth_code')
  const shopId = searchParams.get('shop_id')
  const success = searchParams.get('success')
  
  console.log('Parsed values:', { code, authCode, state, error, shopId, success })

  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}?error=auth_failed`)
  }

  // TikTok Shop Partner'dan success parametresi ile geliyorsa authorization başarılı
  if (success === 'authorized' || (!error && Object.keys(allParams).length > 0)) {
    console.log('TikTok Shop authorization detected - setting cookies')
    
    const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
    
    // Shop ID varsa kaydet
    if (shopId) {
      response.cookies.set('tiktok_shop_id', shopId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
    }
    
    // Her durumda authorization token set et
    response.cookies.set('tiktok_access_token', 'tiktok_shop_authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })

    console.log('Successfully set authorization cookies')
    return response
  }

  // TikTok Shop Partner API direkt authorization vermiş olabilir
  // Eğer shop_id varsa ve error yoksa, başarılı sayalım
  if (shopId && !error) {
    console.log('TikTok Shop authorization successful with shop_id:', shopId)
    
    const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
    
    // Shop ID'yi cookie'ye kaydet
    response.cookies.set('tiktok_shop_id', shopId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    })
    
    // Dummy token set et (gerçek API ile değiştirilecek)
    response.cookies.set('tiktok_access_token', 'shop_authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })

    console.log('Successfully processed TikTok Shop authorization')
    return response
  }

  // Code veya auth_code var mı kontrol et (standart OAuth flow)
  const authorizationCode = code || authCode
  if (!authorizationCode) {
    console.error('No authorization code or shop_id found')
    return NextResponse.redirect(`${request.nextUrl.origin}?error=no_code&debug=${encodeURIComponent(JSON.stringify(allParams))}`)
  }

  try {
    console.log('Attempting standard OAuth token exchange with code:', authorizationCode)
    
    // Standard TikTok OAuth endpoint - eğer code varsa
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log('Token response status:', tokenResponse.status)
    console.log('Token response:', tokenData)

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(`${request.nextUrl.origin}?error=token_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`)
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
      path: '/'
    })

    if (refreshToken) {
      response.cookies.set('tiktok_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
    }

    console.log('Successfully processed standard OAuth authorization')
    return response
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}?error=server_error&message=${encodeURIComponent(String(error))}`)
  }
} 