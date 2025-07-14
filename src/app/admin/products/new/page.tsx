'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'

export default function AddProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(5)
  const [price, setPrice] = useState('')
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    let finalImageUrl = imageUrl

    // If file is uploaded, upload it first
    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      const uploadRes = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        body: formData,
      })
      if (uploadRes.ok) {
        const data = await uploadRes.json()
        finalImageUrl = data.imagePath
      } else {
        setMessage('Image upload failed')
        setSaving(false)
        return
      }
    }

    // Create product
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        image: finalImageUrl,
        category,
        rating: parseFloat(rating as any),
        price: price ? parseFloat(price) : undefined,
        featured,
      }),
    })
    if (res.ok) {
      setMessage('Product added successfully!')
      setTimeout(() => router.push('/admin/products'), 1000)
    } else {
      setMessage('Error adding product')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        {message && <div className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="/images/products/yourimage.png or https://..." />
            <div className="text-xs text-gray-500 mt-1">Or upload an image below (upload takes precedence)</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <label className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Choose File
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {imageFile && <span className="ml-2 text-sm text-gray-700">{imageFile.name}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input type="number" min={0} max={5} step={0.1} value={rating} onChange={e => setRating(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (optional)</label>
            <input type="number" min={0} step={0.01} value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} id="featured" />
            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50">
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}