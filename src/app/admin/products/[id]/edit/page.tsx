'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

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

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      setMessage('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Product, value: any) => {
    setProduct(prev => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      if (response.ok) {
        setMessage('Product updated successfully!')
        setTimeout(() => router.push('/admin/products'), 1000)
      } else {
        setMessage('Error updating product')
      }
    } catch (error) {
      setMessage('Error updating product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        {message && <div className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={product.name} onChange={e => handleChange('name', e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={product.description || ''} onChange={e => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input type="text" value={product.image} onChange={e => handleChange('image', e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input type="text" value={product.category} onChange={e => handleChange('category', e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input type="number" min={0} max={5} step={0.1} value={product.rating} onChange={e => handleChange('rating', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (optional)</label>
            <input type="number" min={0} step={0.01} value={product.price || ''} onChange={e => handleChange('price', e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={product.featured} onChange={e => handleChange('featured', e.target.checked)} id="featured" />
            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}