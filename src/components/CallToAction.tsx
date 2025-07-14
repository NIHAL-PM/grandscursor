import Link from 'next/link'
import { ArrowRight, Phone, Mail } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-orange-700">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Partner with Us?
        </h2>
        <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
          Join our network of successful distributors and retailers. Experience the Grand Foods difference 
          with premium products, reliable service, and dedicated support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/distributor"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Become a Distributor
            <ArrowRight size={20} />
          </Link>
          
          <Link
            href="/contact"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors flex items-center gap-2"
          >
            <Mail size={20} />
            Contact Us
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div>
            <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
            <p className="text-orange-100">
              Every product meets our strict quality standards
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Reliable Supply</h3>
            <p className="text-orange-100">
              Consistent availability and timely delivery
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Partner Support</h3>
            <p className="text-orange-100">
              Dedicated support team for all your needs
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}