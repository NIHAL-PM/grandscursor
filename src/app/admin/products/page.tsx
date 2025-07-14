'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  category: string
  rating: number
  price?: number
  featured: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      setMessage('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        setMessage('Product deleted successfully')
      }
    } catch (error) {
      setMessage('Error deleting product')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <Link href="/admin/products/new" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Product
          </Link>
        </div>
        {message && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 p-2 rounded">{message}</div>}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          </div>
          {products.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {products.map(product => (
                <div key={product.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50" title="Edit">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-600">No products found.</div>
          )}
        </div>
      </div>
    </div>
  )
}