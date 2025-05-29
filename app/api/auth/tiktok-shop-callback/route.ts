import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop OAuth Callback ===')
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    console.log('Callback parameters:')
    console.log('- Code:', code ? `${code.substring(0, 20)}...` : 'null')
    console.log('- State:', state)
    console.log('- Error:', error)
    console.log('- All params:', Object.fromEntries(searchParams.entries()))
    
    if (error) {
      console.error('❌ OAuth Error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=${encodeURIComponent(error)}`)
    }
    
    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=no_code`)
    }
    
    // Try multiple token exchange approaches
    const serviceId = '7431862995146491691'
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'f1a1a446f377780021df9219cb4b029170626997'
    
    console.log('Attempting token exchange...')
    console.log('Service ID:', serviceId)
    console.log('Client Key:', clientKey)
    
    // Try TikTok Shop specific token endpoint first
    const tokenEndpoints = [
      {
        name: 'TikTok Shop Services',
        url: 'https://services.tiktokshops.us/open/token',
        body: {
          service_id: serviceId,
          code: code,
          grant_type: 'authorization_code'
        }
      },
      {
        name: 'TikTok Shop Partner API',
        url: 'https://open-api.tiktokshop.com/token',
        body: {
          app_key: clientKey,
          app_secret: clientSecret,
          auth_code: code,
          grant_type: 'authorized_code'
        }
      },
      {
        name: 'Original Partner Center',
        url: 'https://partner.tiktokshop.com/oauth/token',
        body: {
          client_key: clientKey,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code'
        }
      }
    ]
    
    let tokenData = null
    let successfulEndpoint = null
    
    for (const endpoint of tokenEndpoints) {
      try {
        console.log(`\n🔄 Trying: ${endpoint.name}`)
        console.log(`URL: ${endpoint.url}`)
        console.log(`Body:`, endpoint.body)
        
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
          tokenData = data
          successfulEndpoint = endpoint.name
          console.log(`✅ Success with: ${endpoint.name}`)
          break
        } else {
          console.log(`❌ Failed with: ${endpoint.name}`)
        }
        
        // Small delay between attempts
        await new Promise(resolve => setTimeout(resolve, 300))
        
      } catch (error) {
        console.error(`❌ Error with ${endpoint.name}:`, error)
      }
    }
    
    if (!tokenData) {
      console.error('❌ All token exchange attempts failed')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=token_exchange_failed&message=All endpoints failed`)
    }
    
    console.log('✅ Token exchange successful via:', successfulEndpoint)
    
    // Store tokens in httpOnly cookies
    const cookieStore = cookies()
    
    // Handle different response formats
    const accessToken = tokenData.access_token || tokenData.data?.access_token
    const refreshToken = tokenData.refresh_token || tokenData.data?.refresh_token
    const shopId = tokenData.shop_id || tokenData.data?.shop_id || serviceId
    const shopName = tokenData.shop_name || tokenData.data?.shop_name
    
    if (accessToken) {
      console.log('✅ Storing TikTok Shop access token')
      cookieStore.set('tiktok_shop_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenData.access_token_expire_in || 86400 // 24 hours default
      })
    }
    
    if (refreshToken) {
      console.log('✅ Storing TikTok Shop refresh token')
      cookieStore.set('tiktok_shop_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenData.refresh_token_expire_in || 86400 * 30 // 30 days default
      })
    }
    
    if (shopId) {
      console.log('✅ Storing TikTok Shop ID:', shopId)
      cookieStore.set('tiktok_shop_id', shopId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      })
    }
    
    if (shopName) {
      console.log('✅ Storing TikTok Shop Name:', shopName)
      cookieStore.set('tiktok_shop_name', shopName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      })
    }
    
    // Store which method worked
    if (successfulEndpoint) {
      cookieStore.set('tiktok_shop_auth_method', successfulEndpoint, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      })
    }
    
    console.log('✅ TikTok Shop authorization successful!')
    
    // Redirect back to app with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?success=tiktok_shop_authorized&method=${encodeURIComponent(successfulEndpoint || 'unknown')}`)
    
  } catch (error) {
    console.error('❌ TikTok Shop Callback Error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
} 