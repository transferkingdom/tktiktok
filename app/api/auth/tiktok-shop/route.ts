import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Partner Authorization ===')
    
    const SERVICE_ID = "7431862995146491691"
    const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "https://tktiktok.vercel.app/api/auth/tiktok-shop-callback"
    const APP_KEY = process.env.TIKTOK_CLIENT_KEY

    if (!APP_KEY) {
      console.error('TIKTOK_CLIENT_KEY is not defined')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // TikTok Shop authorization URL using US domain (as shown in Partner Center)
    const authUrl = `https://partner.us.tiktokshop.com/service/authorize?service_id=${SERVICE_ID}&client_key=${APP_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    
    console.log('TikTok Shop Auth URL:', authUrl)
    console.log('Service ID:', SERVICE_ID)
    console.log('Redirect URI:', REDIRECT_URI)
    console.log('State:', state)
    
    // Redirect to TikTok Shop authorization
    return NextResponse.redirect(authUrl)
    
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