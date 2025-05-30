import { useState } from 'react'

interface ProductVariantProps {
  sku: {
    id: string
    seller_sku: string
    title: string
    price: {
      original: string
      sale: string
    }
    stock: number
  }
  productId: string
}

export default function ProductVariant({ sku, productId }: ProductVariantProps) {
  const [price, setPrice] = useState(sku.price.original || '0')
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdatePrice = async () => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Lütfen geçerli bir fiyat giriniz')
      return
    }

    try {
      setUpdating(true)
      setError(null)
      
      const response = await fetch('/api/update-list-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          skuId: sku.id,
          listPrice: price
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fiyat güncellenirken bir hata oluştu')
      }

      // Update local state with new price
      sku.price.original = price
      sku.price.sale = price
      
      alert('Fiyat başarıyla güncellendi!')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fiyat güncellenirken bir hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-gray-900">{sku.title}</p>
          <p className="text-sm text-gray-500">SKU: {sku.seller_sku}</p>
          <p className="text-sm text-gray-500">ID: {sku.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Mevcut Fiyat: <span className="font-medium text-gray-900">${sku.price.original}</span></p>
          <p className="text-sm text-gray-500">İndirimli Fiyat: <span className="font-medium text-gray-900">${sku.price.sale}</span></p>
          <p className="text-sm text-gray-500">Stok: <span className="font-medium text-gray-900">{sku.stock}</span></p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Fiyat</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value)
                setError(null)
              }}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          onClick={handleUpdatePrice}
          disabled={updating || price === sku.price.original}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {updating ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
} 