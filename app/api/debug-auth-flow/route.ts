import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const timestamp = Date.now()
  
  console.log('=== DEBUG AUTH FLOW ===')
  console.log('Timestamp:', new Date(timestamp).toISOString())
  console.log('Code received:', code ? `${code.substring(0, 10)}...` : 'null')
  console.log('All params:', Object.fromEntries(searchParams.entries()))
  
  if (!code) {
    return NextResponse.json({
      error: 'No code provided',
      timestamp: timestamp,
      help: 'Add ?code=YOUR_CODE to test'
    })
  }
  
  // Test the code immediately
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '6e8q3qfuc5iqv'
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'f1a1a446f377780021df9219cb4b029170626997'
  
  console.log('Testing code immediately...')
  
  try {
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
    
    console.log('Immediate test result:', {
      status: response.status,
      ok: response.ok,
      data: data
    })
    
    return NextResponse.json({
      timestamp: timestamp,
      test_time: new Date().toISOString(),
      code_preview: `${code.substring(0, 10)}...`,
      response_status: response.status,
      response_ok: response.ok,
      response_data: data,
      conclusion: response.ok ? '✅ Code is valid' : '❌ Code is invalid or expired'
    })
    
  } catch (error) {
    console.error('Debug test error:', error)
    return NextResponse.json({
      timestamp: timestamp,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 