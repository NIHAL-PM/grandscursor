import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Premium Quality
            <span className="text-orange-600 block">Snack Foods</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover Grand Foods&apos; exceptional range of nuts, biscuits, confectionery, and specialty snacks. 
            Quality you can taste, service you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              Explore Products
              <ArrowRight size={20} />
            </Link>
            
            <Link
              href="/catalog"
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Download Catalog
            </Link>
            
            <Link
              href="/distributor"
              className="text-gray-700 px-8 py-3 rounded-lg font-semibold hover:text-orange-600 transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">25+</h3>
            <p className="text-gray-600">Years of Excellence</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">500+</h3>
            <p className="text-gray-600">Products</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">1000+</h3>
            <p className="text-gray-600">Happy Partners</p>
          </div>
        </div>
      </div>
    </section>
  )
}