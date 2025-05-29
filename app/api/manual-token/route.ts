import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { access_token, shop_id } = await request.json()
    
    console.log('=== Manual Token Input ===')
    console.log('Access Token Preview:', access_token ? `${access_token.substring(0, 20)}...` : 'null')
    console.log('Shop ID:', shop_id)
    
    if (!access_token) {
      return NextResponse.json({
        success: false,
        error: 'Access token is required'
      }, { status: 400 })
    }
    
    // If it's a test token, provide test functionality
    const isTestToken = access_token.startsWith('act.test') || access_token === 'test'
    
    if (isTestToken) {
      console.log('🧪 Test token detected, using demo mode for testing')
    }
    
    const cookieStore = cookies()
    
    // Store the manually provided token as TikTok Shop Partner token
    cookieStore.set('tiktok_shop_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7 // 7 days
    })
    
    // Store shop ID (use provided or fallback)
    const finalShopId = shop_id || '7431862995146491691'
    cookieStore.set('tiktok_shop_id', finalShopId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 30
    })
    
    // Mark as manual auth method
    const authMethod = isTestToken ? 'manual_test_token' : 'manual_api_testing_tool'
    cookieStore.set('tiktok_shop_auth_method', authMethod, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 30
    })
    
    console.log('✅ Manual token stored successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Token stored successfully',
      token_preview: `${access_token.substring(0, 20)}...`,
      shop_id: finalShopId,
      auth_method: authMethod,
      is_test_token: isTestToken,
      next_steps: isTestToken 
        ? 'Test token set. Try fetching products to test API endpoints.'
        : 'Real token set. You can now fetch real product data.'
    })
    
  } catch (error) {
    console.error('❌ Manual token error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to store token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 