'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, Mail, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState({
    phoneNumber: '',
    whatsapp: '',
    email: '',
    address: '',
    businessHours: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchContactSettings()
  }, [])

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/admin/contact-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error)
      setMessage('Error loading contact settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Contact settings updated successfully!')
      } else {
        setMessage('Error updating contact settings')
      }
    } catch (error) {
      console.error('Error updating contact settings:', error)
      setMessage('Error updating contact settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Settings</h1>
          <p className="text-gray-600 mt-2">
            Update contact information for dynamic buttons and contact forms
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dynamic Contact Buttons Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Dynamic Contact Buttons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+1-234-567-8900"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for direct call button
                  </p>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+1-234-567-8900"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for WhatsApp button
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="contact@grandfoods.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for email button
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Additional Information
              </h2>
              <div className="space-y-6">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="123 Grand Foods Street, Food City, FC 12345"
                  />
                </div>

                {/* Business Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Contact Button Preview
          </h2>
          <div className="flex space-x-4">
            <div className="bg-green-600 text-white p-3 rounded-full flex items-center gap-2">
              <Phone size={20} />
              <span className="text-sm">{settings.phoneNumber || 'Phone'}</span>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-full flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="text-sm">{settings.whatsapp || 'WhatsApp'}</span>
            </div>
            <div className="bg-blue-600 text-white p-3 rounded-full flex items-center gap-2">
              <Mail size={20} />
              <span className="text-sm">{settings.email || 'Email'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}