import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Partner Authorization ===')
    
    const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "https://tktiktok.vercel.app/api/auth/tiktok-shop-callback"
    const APP_KEY = process.env.TIKTOK_CLIENT_KEY

    if (!APP_KEY) {
      console.error('TIKTOK_CLIENT_KEY is not defined')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Log environment variables (excluding secrets)
    console.log('Environment check:')
    console.log('- APP_KEY present:', !!APP_KEY)
    console.log('- REDIRECT_URI:', REDIRECT_URI)
    
    // TikTok Shop authorization URL
    const authUrl = new URL('https://auth.tiktok-shops.com/oauth/authorize')
    authUrl.searchParams.append('app_key', APP_KEY)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    
    console.log('Generated Auth URL:', authUrl.toString())
    
    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('❌ TikTok Shop Auth Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate TikTok Shop authorization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 