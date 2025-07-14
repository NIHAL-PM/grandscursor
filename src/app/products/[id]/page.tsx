import { prisma } from '@/lib/db'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8">
          <div className="relative w-full md:w-1/2 h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-product.jpg'
              }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
                  {product.category}
                </span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-4">{product.description}</p>
              {product.price && (
                <div className="text-2xl font-semibold text-orange-600 mb-4">
                  ₹{product.price.toFixed(2)}
                </div>
              )}
            </div>
            <div className="mt-8">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}