import { prisma } from '@/lib/db'
import { Download, FileText, Calendar } from 'lucide-react'

export default async function CatalogPage() {
  // Fetch active catalogs
  const catalogs = await prisma.productCatalog.findMany({
    where: { isActive: true },
    orderBy: { uploadedAt: 'desc' },
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Catalog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download our latest product catalogs to explore our complete range of premium snacks, 
            nuts, biscuits, and confectionery products.
          </p>
        </div>

        {/* Catalog List */}
        <div className="max-w-4xl mx-auto">
          {catalogs.length > 0 ? (
            <div className="space-y-6">
              {catalogs.map((catalog) => (
                <div key={catalog.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <FileText className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {catalog.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(catalog.uploadedAt).toLocaleDateString()}
                          </span>
                          <span>
                            {formatFileSize(catalog.fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={`/api/catalog/download/${catalog.id}`}
                      download={catalog.originalName}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Download size={20} />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Catalogs Available
              </h3>
              <p className="text-gray-600">
                Product catalogs will be available for download soon. Please check back later.
              </p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Our Product Catalog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Complete Product Range
              </h3>
              <p className="text-gray-600">
                Browse through our entire collection of snacks, nuts, biscuits, and confectionery items with detailed specifications.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pricing Information
              </h3>
              <p className="text-gray-600">
                Access wholesale pricing, bulk order discounts, and special distributor rates for all our products.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Regular Updates
              </h3>
              <p className="text-gray-600">
                Our catalogs are updated regularly with new products, seasonal offerings, and current pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Contact for More Info */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Need More Information?
          </h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our sales team is ready to help you with bulk orders, custom packaging, 
            and partnership opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Sales Team
            </a>
            <a
              href="/distributor"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Become a Distributor
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}