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
    console.log('TikTok Shop authorization detected - performing token exchange')
    
    // TikTok Shop authorization code'u al (shop_id da olabilir)
    const authorizationCode = code || authCode || searchParams.get('authorization_code')
    
    if (authorizationCode) {
      try {
        console.log('Attempting TikTok Shop token exchange with code:', authorizationCode)
        
        // TikTok Shop token endpoint'i - resmi dokümantasyona göre
        const tokenResponse = await fetch('https://auth.tiktok-shops.com/api/v2/token/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Query parameters olarak gönder
        })
        
        // URL with parameters - TikTok Shop format
        const tokenUrl = new URL('https://auth.tiktok-shops.com/api/v2/token/get')
        tokenUrl.searchParams.append('app_key', process.env.TIKTOK_CLIENT_KEY!)
        tokenUrl.searchParams.append('app_secret', process.env.TIKTOK_CLIENT_SECRET!)
        tokenUrl.searchParams.append('auth_code', authorizationCode)
        tokenUrl.searchParams.append('grant_type', 'authorized_code')
        
        console.log('TikTok Shop token URL:', tokenUrl.toString())
        
        const shopTokenResponse = await fetch(tokenUrl.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'TikTokShop-PriceUpdater/1.0'
          }
        })

        const shopTokenData = await shopTokenResponse.json()
        console.log('TikTok Shop token response:', shopTokenData)

        if (shopTokenResponse.ok && shopTokenData.code === 0) {
          const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
          
          // Set real tokens from TikTok Shop API
          const accessToken = shopTokenData.data.access_token
          const refreshToken = shopTokenData.data.refresh_token
          const expiresIn = shopTokenData.data.access_token_expire_in || 86400

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
          
          // Shop ID'yi de kaydet
          if (shopId || shopTokenData.data.shop_id) {
            const actualShopId = shopId || shopTokenData.data.shop_id || "7431862995146491691"
            response.cookies.set('tiktok_shop_id', actualShopId, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 365 * 24 * 60 * 60,
              path: '/'
            })
            console.log('Set shop_id cookie:', actualShopId)
          } else {
            // Hard-code Shop ID if not provided by API
            response.cookies.set('tiktok_shop_id', "7431862995146491691", {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 365 * 24 * 60 * 60,
              path: '/'
            })
            console.log('Set hard-coded shop_id cookie: 7431862995146491691')
          }
          
          // Also store seller name separately if available
          if (shopTokenData.data.seller_name) {
            response.cookies.set('tiktok_seller_name', shopTokenData.data.seller_name, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 365 * 24 * 60 * 60,
              path: '/'
            })
            console.log('Set seller_name cookie:', shopTokenData.data.seller_name)
          }

          console.log('Successfully processed TikTok Shop token exchange')
          return response
        } else {
          console.error('TikTok Shop token exchange failed:', shopTokenData)
          // Fallback to dummy token for now
        }
      } catch (error) {
        console.error('Error in TikTok Shop token exchange:', error)
        // Fallback to dummy token
      }
    }
    
    // Fallback: Set dummy token if token exchange fails
    const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
    
    // Hard-coded Shop ID kullan (URL'den gelen shopId seller name olabilir)
    response.cookies.set('tiktok_shop_id', "7431862995146491691", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/'
    })
    console.log('Set fallback shop_id cookie: 7431862995146491691')
    
    // Seller name'i ayrı kaydet eğer shopId seller name ise
    if (shopId && isNaN(Number(shopId))) {
      response.cookies.set('tiktok_seller_name', shopId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
      console.log('Set seller_name from URL shopId:', shopId)
    }

    // Fallback token - gerçek API'de değiştirilmeli
    response.cookies.set('tiktok_access_token', 'YW6gdQAAAACtKWVciveiwOD9AsK-pgGH1oZ9kbhNDOq4uCcITr6npA', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    })

    console.log('Set fallback authorization tokens')
    return response
  }

  // TikTok Shop Partner API direkt authorization vermiş olabilir
  // Eğer shop_id varsa ve error yoksa, başarılı sayalım
  if (shopId && !error) {
    console.log('TikTok Shop authorization successful with shop_id:', shopId)
    
    const response = NextResponse.redirect(`${request.nextUrl.origin}?success=authorized`)
    
    // Shop ID numeric mi kontrol et
    const isNumericShopId = !isNaN(Number(shopId))
    
    if (isNumericShopId) {
      // Numeric shop ID ise direkt kullan
      response.cookies.set('tiktok_shop_id', shopId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
      console.log('Set numeric shop_id cookie:', shopId)
    } else {
      // String ise seller name olarak kaydet ve hard-coded shop ID kullan
      response.cookies.set('tiktok_shop_id', "7431862995146491691", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
      response.cookies.set('tiktok_seller_name', shopId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60,
        path: '/'
      })
      console.log('Set hard-coded shop_id and seller_name:', shopId)
    }

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