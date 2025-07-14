'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Package, 
  Settings, 
  FileText, 
  Phone, 
  Mail, 
  MessageSquare,
  Download,
  Upload,
  BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalContacts: 0,
    totalCatalogs: 0,
    totalTestimonials: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const quickActions = [
    {
      title: 'Contact Settings',
      description: 'Update phone, WhatsApp, and email for dynamic buttons',
      icon: <Phone className="w-6 h-6" />,
      href: '/admin/contact-settings',
      color: 'bg-blue-500'
    },
    {
      title: 'Upload Catalog',
      description: 'Upload new product catalogs for download',
      icon: <Upload className="w-6 h-6" />,
      href: '/admin/catalog',
      color: 'bg-green-500'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove products',
      icon: <Package className="w-6 h-6" />,
      href: '/admin/products',
      color: 'bg-orange-500'
    },
    {
      title: 'Contact Forms',
      description: 'View and manage customer inquiries',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/contacts',
      color: 'bg-purple-500'
    }
  ]

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-8 h-8 text-orange-600" />,
      change: '+12%'
    },
    {
      title: 'Contact Forms',
      value: stats.totalContacts,
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      change: '+5%'
    },
    {
      title: 'Active Catalogs',
      value: stats.totalCatalogs,
      icon: <FileText className="w-8 h-8 text-green-600" />,
      change: '+2%'
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: <Users className="w-8 h-8 text-purple-600" />,
      change: '+8%'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your Grand Foods website content and settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-600"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Management Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/products" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-orange-600" />
                <span className="font-medium">Product Management</span>
              </div>
            </Link>
            <Link href="/admin/contact-settings" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Contact Settings</span>
              </div>
            </Link>
            <Link href="/admin/catalog" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium">Catalog Management</span>
              </div>
            </Link>
            <Link href="/admin/contacts" className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Contact Forms</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}