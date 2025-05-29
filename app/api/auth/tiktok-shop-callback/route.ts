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
    
    if (!code || code === 'null') {
      console.error('❌ No authorization code received or authorization denied')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=no_code_or_denied`)
    }
    
    // TK application parameters from documentation
    const appKey = '6e8q3qfuc5iqv'
    const appSecret = 'f1a1a446f377780021df9219cb4b029170626997'
    const shopId = '7431862995146491691'
    
    console.log('Attempting token exchange with official endpoint...')
    console.log('App Key:', appKey)
    console.log('Shop ID:', shopId)
    
    // Official TikTok Shop token endpoint from documentation
    const tokenEndpoint = 'https://auth.tiktok-shops.com/api/v2/token/get'
    
    // Create URL with parameters (GET request as per documentation)
    const tokenUrl = new URL(tokenEndpoint)
    tokenUrl.searchParams.append('app_key', appKey)
    tokenUrl.searchParams.append('app_secret', appSecret)
    tokenUrl.searchParams.append('auth_code', code)
    tokenUrl.searchParams.append('grant_type', 'authorized_code')
    
    console.log('🔄 Requesting token from:', tokenUrl.toString())
    
    try {
      const response = await fetch(tokenUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      console.log(`Response Status: ${response.status}`)
      console.log(`Response:`, data)
      
      // Check if request was successful based on TikTok Shop response format
      if (response.ok && data.code === 0 && data.data?.access_token) {
        console.log('✅ Token exchange successful!')
        
        // Store tokens in httpOnly cookies
        const cookieStore = cookies()
        
        // Extract data from TikTok Shop response format
        const tokenData = data.data
        const accessToken = tokenData.access_token
        const refreshToken = tokenData.refresh_token
        const responseShopId = tokenData.open_id || shopId
        const shopName = tokenData.seller_name || 'Transfer Kingdom'
        const userType = tokenData.user_type
        const grantedScopes = tokenData.granted_scopes
        
        if (accessToken) {
          console.log('✅ Storing TikTok Shop access token')
          const expiresIn = tokenData.access_token_expire_in 
            ? Math.max(0, tokenData.access_token_expire_in - Math.floor(Date.now() / 1000))
            : 86400 * 7 // 7 days default
            
          cookieStore.set('tiktok_shop_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expiresIn
          })
        }
        
        if (refreshToken) {
          console.log('✅ Storing TikTok Shop refresh token')
          const refreshExpiresIn = tokenData.refresh_token_expire_in 
            ? Math.max(0, tokenData.refresh_token_expire_in - Math.floor(Date.now() / 1000))
            : 86400 * 30 // 30 days default
            
          cookieStore.set('tiktok_shop_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: refreshExpiresIn
          })
        }
        
        if (responseShopId) {
          console.log('✅ Storing TikTok Shop ID:', responseShopId)
          cookieStore.set('tiktok_shop_id', responseShopId.toString(), {
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
        
        // Store additional metadata
        if (userType !== undefined) {
          cookieStore.set('tiktok_shop_user_type', userType.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 * 30
          })
        }
        
        if (grantedScopes && grantedScopes.length > 0) {
          cookieStore.set('tiktok_shop_scopes', grantedScopes.join(','), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 * 30
          })
        }
        
        // Store auth method
        cookieStore.set('tiktok_shop_auth_method', 'Official TikTok Shop API', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 * 30
        })
        
        console.log('✅ TikTok Shop authorization successful!')
        console.log('📊 User Type:', userType === 0 ? 'Seller' : userType === 1 ? 'Creator' : userType === 3 ? 'Partner' : 'Unknown')
        console.log('🔑 Granted Scopes:', grantedScopes)
        
        // Redirect back to app with success
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?success=tiktok_shop_authorized&method=Official_API`)
        
      } else {
        console.error('❌ Token exchange failed:', data)
        const errorMessage = data.message || 'Token exchange failed'
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=token_exchange_failed&message=${encodeURIComponent(errorMessage)}`)
      }
      
    } catch (fetchError) {
      console.error('❌ Error calling token endpoint:', fetchError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=token_request_failed&message=${encodeURIComponent(fetchError instanceof Error ? fetchError.message : 'Network error')}`)
    }
    
  } catch (error) {
    console.error('❌ TikTok Shop Callback Error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://tktiktok.vercel.app'}?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
} 