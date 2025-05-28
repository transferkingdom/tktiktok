export interface TikTokTokenResponse {
  access_token: string
  expires_in: number
  open_id: string
  refresh_expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface TikTokProduct {
  id: string
  title: string
  status: string
  variants: TikTokVariant[]
}

export interface TikTokVariant {
  id: string
  title: string
  price: {
    amount: number
    currency: string
  }
  inventory: {
    quantity: number
  }
}

export class TikTokAPI {
  private accessToken: string
  private baseURL: string = 'https://open-api.tiktokglobalshop.com'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'x-tts-access-token': this.accessToken,
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`TikTok API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return response.json()
  }

  async getProducts(pageSize: number = 100, pageNumber: number = 1): Promise<TikTokProduct[]> {
    const data = await this.makeRequest('/product/202309/products/search', {
      method: 'POST',
      body: JSON.stringify({
        page_size: pageSize,
        page_number: pageNumber,
      }),
    })

    return data.data?.products || []
  }

  async updateProductPrice(productId: string, variants: Array<{ id: string; price: number; currency?: string }>) {
    const skus = variants.map(variant => ({
      id: variant.id,
      price: {
        amount: Math.round(variant.price * 100), // Convert to cents
        currency: variant.currency || 'USD'
      }
    }))

    return await this.makeRequest('/product/202309/products/prices', {
      method: 'PUT',
      body: JSON.stringify({
        product_id: productId,
        skus: skus,
      }),
    })
  }

  async getProductById(productId: string): Promise<TikTokProduct | null> {
    try {
      const data = await this.makeRequest(`/product/202309/products/${productId}`)
      return data.data || null
    } catch (error) {
      console.error(`Failed to get product ${productId}:`, error)
      return null
    }
  }

  static async exchangeCodeForToken(
    code: string,
    clientKey: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<TikTokTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`)
    }

    return response.json()
  }

  static async refreshToken(
    refreshToken: string,
    clientKey: string,
    clientSecret: string
  ): Promise<TikTokTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Token refresh failed: ${errorData.error_description || response.statusText}`)
    }

    return response.json()
  }
} 