'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Calendar, Download, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Catalog {
  id: string
  title: string
  filename: string
  originalName: string
  fileSize: number
  isActive: boolean
  uploadedAt: string
}

export default function CatalogManagementPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    try {
      const response = await fetch('/api/admin/catalog')
      if (response.ok) {
        const data = await response.json()
        setCatalogs(data)
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file only')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', `Product Catalog - ${new Date().toLocaleDateString()}`)

    try {
      const response = await fetch('/api/admin/catalog/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setMessage('Catalog uploaded successfully!')
        fetchCatalogs()
        // Reset file input
        event.target.value = ''
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error uploading catalog')
      }
    } catch (error) {
      console.error('Error uploading catalog:', error)
      setMessage('Error uploading catalog')
    } finally {
      setUploading(false)
    }
  }

  const toggleCatalogStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/catalog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchCatalogs()
        setMessage(`Catalog ${!isActive ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error) {
      console.error('Error updating catalog status:', error)
      setMessage('Error updating catalog status')
    }
  }

  const deleteCatalog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this catalog?')) return

    try {
      const response = await fetch(`/api/admin/catalog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCatalogs()
        setMessage('Catalog deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting catalog:', error)
      setMessage('Error deleting catalog')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading catalogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Catalog Management</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage downloadable product catalogs
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {message}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Upload New Catalog
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Product Catalog
            </h3>
            <p className="text-gray-600 mb-4">
              Select a PDF file to upload as a downloadable catalog
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-colors">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            <p className="text-sm text-gray-500 mt-2">
              Maximum file size: 10MB. Only PDF files are allowed.
            </p>
          </div>
        </div>

        {/* Catalogs List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Existing Catalogs
            </h2>
          </div>

          {catalogs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {catalogs.map((catalog) => (
                <div key={catalog.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <FileText className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {catalog.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(catalog.uploadedAt).toLocaleDateString()}
                          </span>
                          <span>{formatFileSize(catalog.fileSize)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            catalog.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {catalog.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/api/catalog/download/${catalog.id}`}
                        download={catalog.originalName}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                      
                      <button
                        onClick={() => toggleCatalogStatus(catalog.id, catalog.isActive)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          catalog.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {catalog.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => deleteCatalog(catalog.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Catalogs Yet
              </h3>
              <p className="text-gray-600">
                Upload your first product catalog to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}