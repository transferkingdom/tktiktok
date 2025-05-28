const accessToken = 'YW6gdQAAAACtKWVciveiwOD9AsK-pgGH1oZ9kbhNDOq4uCcITr6npA';
const shopId = '7431862995146491691';
const productId = '1731182926124651087';

console.log('=== TikTok Shop API Token Test ===');
console.log('Access Token:', accessToken);
console.log('Shop ID:', shopId);
console.log('Product ID:', productId);

// Test TikTok Shop Partner API v202309
async function testTikTokShopAPI() {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'x-tts-access-token': accessToken
  };

  console.log('\n🧪 Testing TikTok Shop Partner API v202309...');

  try {
    // Test 1: Product Details
    console.log('\n📦 Test 1: Product Details API');
    const detailResponse = await fetch('https://open-api.tiktokshop.com/api/products/details', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        shop_id: shopId,
        product_id: productId
      })
    });

    console.log('Response Status:', detailResponse.status);
    console.log('Response Headers:', Object.fromEntries(detailResponse.headers.entries()));
    
    if (detailResponse.ok) {
      const data = await detailResponse.json();
      console.log('✅ Success! Product Details:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await detailResponse.text();
      console.log('❌ Error Response:', errorText);
    }

    // Test 2: Product List
    console.log('\n📋 Test 2: Product List API');
    const listResponse = await fetch('https://open-api.tiktokshop.com/api/products/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        shop_id: shopId,
        page_size: 10,
        page_token: ''
      })
    });

    console.log('List Response Status:', listResponse.status);
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('✅ Success! Product List:', JSON.stringify(listData, null, 2));
    } else {
      const listErrorText = await listResponse.text();
      console.log('❌ List Error Response:', listErrorText);
    }

  } catch (error) {
    console.error('💥 Error during API test:', error);
  }
}

testTikTokShopAPI(); 