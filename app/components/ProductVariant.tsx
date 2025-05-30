import { useState } from 'react'

interface ProductVariantProps {
  sku: {
    id: string
    seller_sku: string
    price: {
      original: string
      sale: string
    }
    stock: number
  }
  productId: string
}

export default function ProductVariant({ sku, productId }: ProductVariantProps) {
  const [listPrice, setListPrice] = useState(sku.price.original || '0')
  const [updating, setUpdating] = useState(false)

  const handleUpdateListPrice = async () => {
    try {
      setUpdating(true)
      const response = await fetch('/api/update-list-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          skuId: sku.id,
          listPrice
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update list price')
      }

      alert('List price updated successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update list price')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-3 border rounded">
      <p><strong>SKU ID:</strong> {sku.id}</p>
      <p><strong>Seller SKU:</strong> {sku.seller_sku}</p>
      <p><strong>Original Price:</strong> ${sku.price.original}</p>
      <p><strong>Sale Price:</strong> ${sku.price.sale}</p>
      <p><strong>Stock:</strong> {sku.stock}</p>
      
      <div className="mt-3 flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">List Price</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
        <button
          onClick={handleUpdateListPrice}
          disabled={updating || listPrice === sku.price.original}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
} 