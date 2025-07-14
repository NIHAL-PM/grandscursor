'use client'

import { useState, useEffect } from 'react'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SiteContent {
  id: string
  key: string
  title?: string
  content: string
  type: string
}

const contentKeys = [
  { key: 'home_hero_title', label: 'Homepage Hero Title', type: 'text' },
  { key: 'home_hero_subtitle', label: 'Homepage Hero Subtitle', type: 'text' },
  { key: 'home_stats', label: 'Homepage Stats (JSON array)', type: 'json' },
  { key: 'home_journey', label: 'Homepage Journey Timeline (JSON array)', type: 'json' },
  { key: 'home_cta', label: 'Homepage Call-to-Action', type: 'text' },
  { key: 'about_story', label: 'About Us Story', type: 'text' },
  { key: 'about_numbers', label: 'About Us By the Numbers (JSON array)', type: 'json' },
  { key: 'about_leadership', label: 'About Us Leadership (JSON array)', type: 'json' },
  { key: 'about_manufacturing', label: 'About Us Manufacturing', type: 'text' },
]

export default function SiteContentAdminPage() {
  const [contents, setContents] = useState<Record<string, SiteContent>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/admin/site-content')
      if (res.ok) {
        const data = await res.json()
        const map: Record<string, SiteContent> = {}
        data.forEach((item: SiteContent) => { map[item.key] = item })
        setContents(map)
      }
    } catch {
      setMessage('Error loading content')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setContents(prev => ({ ...prev, [key]: { ...prev[key], content: value } }))
  }

  const handleSave = async (key: string) => {
    setSaving(true)
    setMessage('')
    const content = contents[key]
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: content.content, type: content.type }),
      })
      if (res.ok) {
        setMessage('Content updated!')
        fetchContents()
      } else {
        setMessage('Error updating content')
      }
    } catch {
      setMessage('Error updating content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-6">Edit Site Content</h1>
        {message && <div className={`mb-4 p-2 rounded ${message.includes('updated') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
        <div className="space-y-8">
          {contentKeys.map(({ key, label, type }) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-sm font-medium mb-2">{label}</label>
              {type === 'json' ? (
                <textarea
                  value={contents[key]?.content || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border rounded font-mono text-xs"
                  rows={6}
                  placeholder="Enter JSON array..."
                />
              ) : (
                <textarea
                  value={contents[key]?.content || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows={type === 'text' ? 3 : 1}
                />
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleSave(key)}
                  disabled={saving}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" /> Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}