import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TikTok Shop Partner Authorization ===')
    
    // TikTok Shop service parameters from documentation
    const serviceId = '7431862995146491691'  // Our service/shop ID
    const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || 'https://tktiktok.vercel.app/api/auth/tiktok-shop-callback'
    
    // Generate state for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // TikTok Shop authorization URL using US domain (as shown in Partner Center)
    const authUrl = `https://services.tiktokshops.us/open/authorize?` +
      `service_id=${serviceId}&` +
      `state=${state}`
    
    console.log('TikTok Shop Auth URL:', authUrl)
    console.log('Service ID:', serviceId)
    console.log('Redirect URI (will be handled by callback):', redirectUri)
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