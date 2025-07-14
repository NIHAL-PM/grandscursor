import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Grand Foods</h3>
            <p className="text-gray-300 mb-4">
              Premium quality snack foods for over 25 years. Your trusted partner in delivering 
              exceptional taste and quality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-400">Home</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-orange-400">Products</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-400">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-400">Contact</Link></li>
              <li><Link href="/stores" className="text-gray-300 hover:text-orange-400">Store Locator</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/distributor" className="text-gray-300 hover:text-orange-400">Become a Distributor</Link></li>
              <li><Link href="/catalog" className="text-gray-300 hover:text-orange-400">Download Catalog</Link></li>
              <li><Link href="/admin" className="text-gray-300 hover:text-orange-400">Admin Portal</Link></li>
              <li><span className="text-gray-300">Bulk Orders</span></li>
              <li><span className="text-gray-300">Custom Packaging</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-gray-300">+1-234-567-8900</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-gray-300">contact@grandfoods.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                <span className="text-gray-300">
                  123 Grand Foods Street<br />
                  Food City, FC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Grand Foods. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-400 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}