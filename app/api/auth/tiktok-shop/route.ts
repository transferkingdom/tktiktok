import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Partner Authorization ===')
    
    // TikTok Shop Partner OAuth parameters
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
    const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || 'https://tktiktok.vercel.app/api/auth/tiktok-shop-callback'
    
    // TikTok Shop Partner specific scopes
    const scopes = [
      'seller.shop.basic',
      'seller.product.basic', 
      'seller.order.basic',
      'seller.fulfillment.basic'
    ].join(',')
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // TikTok Shop Partner specific authorization URL
    const authUrl = `https://partner.tiktokshop.com/oauth/authorize?` +
      `client_key=${clientKey}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`
    
    console.log('TikTok Shop Partner Auth URL:', authUrl)
    console.log('Client Key:', clientKey)
    console.log('Redirect URI:', redirectUri)
    console.log('Scopes:', scopes)
    
    // Redirect to TikTok Shop Partner authorization
    return NextResponse.redirect(authUrl)
    
  } catch (error) {
    console.error('❌ TikTok Shop Partner Auth Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate TikTok Shop Partner authorization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 