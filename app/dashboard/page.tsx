'use client';

import { useState, useEffect } from 'react';

interface ProductVariant {
  id: string;
  seller_sku: string;
  title: string;
  price: {
    original: string;
    sale: string;
  };
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  status: string;
  variants: ProductVariant[];
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Token kontrolü
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();

      if (!data.authorized) {
        window.location.href = '/';
        return;
      }

      setIsLoading(false);
    } catch (error) {
      setError('Yetkilendirme durumu kontrol edilemedi');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      setError('Çıkış yapılırken hata oluştu');
    }
  };

  const handleGetProduct = async () => {
    if (!productId) {
      setError('Lütfen bir ürün ID girin');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/get-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        setProduct(data.product);
        setError(null);
      } else {
        setError(data.error || 'Ürün getirilemedi');
      }
    } catch (error) {
      setError('Ürün getirme işlemi başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TikTok Shop Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ürün Yönetimi</h2>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Ürün ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGetProduct}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Yükleniyor...' : 'Ürünü Getir'}
            </button>
          </div>

          {product && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">ID: {product.id}</p>
              
              <h4 className="font-medium mb-2">Varyantlar:</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Başlık</th>
                      <th className="px-4 py-2 text-left">Fiyat</th>
                      <th className="px-4 py-2 text-left">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant) => (
                      <tr key={variant.id} className="border-t">
                        <td className="px-4 py-2">{variant.seller_sku}</td>
                        <td className="px-4 py-2">{variant.title}</td>
                        <td className="px-4 py-2">${variant.price.original}</td>
                        <td className="px-4 py-2">{variant.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 