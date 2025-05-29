import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(timestamp: number, appKey: string, appSecret: string) {
  // Format: app_key{app_key}timestamp{timestamp}{app_secret}
  const signString = `app_key${appKey}timestamp${timestamp}${appSecret}`
  return crypto.createHash('sha256').update(signString).digest('hex')
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== Get Authorized Shops API Start ===')
    
    // Get access token from cookies
    const cookieStore = cookies()
    const shopAccessToken = cookieStore.get('tiktok_shop_access_token')?.value
    const legacyAccessToken = cookieStore.get('tiktok_access_token')?.value
    const accessToken = shopAccessToken || legacyAccessToken
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please refresh token first.' },
        { status: 401 }
      )
    }
    
    console.log('Using access token:', accessToken.substring(0, 10) + '...')

    // Generate timestamp and signature
    const timestamp = Math.floor(Date.now() / 1000)
    const sign = generateSignature(timestamp, APP_KEY, APP_SECRET)
    
    // Construct URL with query parameters
    const baseUrl = 'https://api-us.tiktokshop.com/authorization/202309/seller/shops'
    const queryParams = new URLSearchParams({
      app_key: APP_KEY,
      timestamp: timestamp.toString(),
      sign: sign,
      version: '202309'  // Adding version parameter
    })
    
    const url = `${baseUrl}?${queryParams.toString()}`
    console.log('Request URL:', url)
    
    // Call TikTok Shop API to get authorized shops
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-tts-access-token': accessToken
      }
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response keys:', Object.keys(data || {}))
    console.log('Response data:', JSON.stringify(data, null, 2))
    
    if (!response.ok) {
      console.error('Error response:', data)
      return NextResponse.json(
        { 
          error: 'Failed to get authorized shops',
          details: data,
          request_url: url,
          timestamp: timestamp,
          sign: sign
        },
        { status: response.status }
      )
    }
    
    return NextResponse.json({
      success: true,
      shops: data.data?.shops || [],
      raw_response: data
    })
    
  } catch (error) {
    console.error('❌ Get Authorized Shops Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get authorized shops', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 