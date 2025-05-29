import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== OAuth Callback (Legacy + TikTok Shop Partner) ===')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const scope = searchParams.get('scope')
    
    console.log('Callback parameters:')
    console.log('- Code:', code ? `${code.substring(0, 20)}...` : 'null')
    console.log('- State:', state)
    console.log('- Error:', error)
    console.log('- Scope:', scope)
    console.log('- All params:', Object.fromEntries(searchParams.entries()))
    
    if (error) {
      console.error('❌ OAuth Error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=${encodeURIComponent(error)}`)
    }
    
    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=no_code`)
    }
    
    // Determine if this is TikTok Shop Partner or legacy TikTok based on scope/state
    const isTikTokShop = state?.includes('tiktok_shop') || scope?.includes('seller.')
    
    console.log('🔍 Detected authentication type:', isTikTokShop ? 'TikTok Shop Partner' : 'Legacy TikTok')
    
    if (isTikTokShop) {
      // Handle TikTok Shop Partner authentication
      return await handleTikTokShopAuth(code, state)
    } else {
      // Handle legacy TikTok authentication  
      return await handleLegacyTikTokAuth(code, state)
    }
    
  } catch (error) {
    console.error('❌ Callback Error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
}

async function handleTikTokShopAuth(code: string, state: string | null) {
  console.log('🏪 Handling TikTok Shop Partner authentication...')
  
  const serviceId = '7431862995146491691'
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'f1a1a446f377780021df9219cb4b029170626997'
  
  // Try TikTok Shop Partner token endpoints
  const tokenEndpoints = [
    {
      name: 'TikTok Shop Partner API',
      url: 'https://open-api.tiktokshop.com/authorization/token/get',
      body: {
        app_key: clientKey,
        app_secret: clientSecret,
        auth_code: code,
        grant_type: 'authorized_code'
      }
    },
    {
      name: 'TikTok Shop Services', 
      url: 'https://services.tiktokshops.us/open/token',
      body: {
        service_id: serviceId,
        code: code,
        grant_type: 'authorization_code'
      }
    }
  ]
  
  for (const endpoint of tokenEndpoints) {
    try {
      console.log(`\n🔄 Trying: ${endpoint.name}`)
      console.log(`URL: ${endpoint.url}`)
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endpoint.body)
      })
      
      const data = await response.json()
      console.log(`Response Status: ${response.status}`)
      console.log(`Response:`, data)
      
      if (response.ok && (data.access_token || data.data?.access_token)) {
        console.log(`✅ Success with: ${endpoint.name}`)
        await storeTikTokShopTokens(data, endpoint.name)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?success=tiktok_shop_authorized&method=${encodeURIComponent(endpoint.name)}`)
      }
      
    } catch (error) {
      console.error(`❌ Error with ${endpoint.name}:`, error)
    }
  }
  
  // If all TikTok Shop methods fail, fall back to legacy
  console.log('⚠️ TikTok Shop auth failed, falling back to legacy...')
  return await handleLegacyTikTokAuth(code, state)
}

async function handleLegacyTikTokAuth(code: string, state: string | null) {
  console.log('📱 Handling Legacy TikTok authentication...')
  
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'f1a1a446f377780021df9219cb4b029170626997'
  
  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code'
    }).toString()
  })
  
  const data = await response.json()
  console.log('Legacy Token Response:', data)
  
  if (response.ok && data.access_token) {
    await storeLegacyTokens(data)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?success=authorized`)
  } else {
    console.error('❌ Legacy token exchange failed:', data)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=token_exchange_failed`)
  }
}

async function storeTikTokShopTokens(tokenData: any, method: string) {
  const cookieStore = cookies()
  
  const accessToken = tokenData.access_token || tokenData.data?.access_token
  const refreshToken = tokenData.refresh_token || tokenData.data?.refresh_token
  const shopId = tokenData.shop_id || tokenData.data?.shop_id || '7431862995146491691'
  const shopName = tokenData.shop_name || tokenData.data?.shop_name
  
  if (accessToken) {
    cookieStore.set('tiktok_shop_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.access_token_expire_in || 86400
    })
  }
  
  if (refreshToken) {
    cookieStore.set('tiktok_shop_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: tokenData.refresh_token_expire_in || 86400 * 30
    })
  }
  
  if (shopId) {
    cookieStore.set('tiktok_shop_id', shopId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 86400 * 30
    })
  }
  
  if (shopName) {
    cookieStore.set('tiktok_shop_name', shopName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 30
    })
  }
  
  cookieStore.set('tiktok_shop_auth_method', method, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 30
  })
  
  console.log('✅ TikTok Shop Partner tokens stored')
}

async function storeLegacyTokens(tokenData: any) {
  const cookieStore = cookies()
  
  if (tokenData.access_token) {
    cookieStore.set('tiktok_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 86400
    })
  }
  
  if (tokenData.refresh_token) {
    cookieStore.set('tiktok_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: tokenData.refresh_expires_in || 86400 * 30
    })
  }
  
  // Store shop info with hardcoded fallback
  cookieStore.set('shop_id', '7431862995146491691', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 30
  })
  
  cookieStore.set('seller_name', 'Transfer Kingdom', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 30
  })
  
  console.log('✅ Legacy TikTok tokens stored')
} 