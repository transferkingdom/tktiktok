import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const APP_KEY = '6e8q3qfuc5iqv'
const APP_SECRET = 'f1a1a446f377780021df9219cb4b029170626997'

function generateSignature(path: string, params: Record<string, string>, appSecret: string) {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key]
    return acc
  }, {} as Record<string, string>)

  // Build signature string: secret + path + key1value1key2value2 + secret
  let signString = appSecret + path
  for (const [key, value] of Object.entries(sortedParams)) {
    if (key !== 'sign' && key !== 'access_token') {
      signString += key + value
    }
  }
  signString += appSecret

  console.log('Signature string:', signString)
  
  // Generate HMAC SHA256
  return crypto.createHmac('sha256', appSecret).update(signString).digest('hex')
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

    // Prepare parameters
    const timestamp = Math.floor(Date.now() / 1000)
    const path = '/authorization/202309/shops'
    const params = {
      app_key: APP_KEY,
      timestamp: timestamp.toString()
    }
    
    // Generate signature
    const sign = generateSignature(path, params, APP_SECRET)
    
    // Construct URL with query parameters
    const baseUrl = 'https://open-api.tiktokglobalshop.com'
    const queryParams = new URLSearchParams({
      ...params,
      sign,
      access_token: accessToken
    })
    
    const url = `${baseUrl}${path}?${queryParams.toString()}`
    console.log('Request URL:', url)
    
    // Call TikTok Shop API to get authorized shops
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TTS-Access-Token': accessToken
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
          sign: sign,
          signature_string: params
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