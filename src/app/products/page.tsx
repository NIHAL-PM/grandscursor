import { prisma } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Search } from 'lucide-react'
import ProductSearch from '@/components/ProductSearch'

export default async function ProductsPage() {
  // Fetch all products
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  })

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our extensive range of premium snacks, nuts, biscuits, and confectionery products. 
            Each item is crafted with care to deliver exceptional taste and quality.
          </p>
        </div>

        {/* Search and Filter Component */}
        <ProductSearch products={products} categories={categories} />
      </div>
    </div>
  )
}