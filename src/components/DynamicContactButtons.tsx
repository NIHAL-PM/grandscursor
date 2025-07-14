'use client'

import { Phone, MessageCircle, Mail } from 'lucide-react'

interface ContactSettings {
  phoneNumber: string
  whatsapp: string
  email: string
}

interface DynamicContactButtonsProps {
  contactSettings: ContactSettings | null
}

export default function DynamicContactButtons({ contactSettings }: DynamicContactButtonsProps) {
  if (!contactSettings) return null

  const handleCall = () => {
    window.open(`tel:${contactSettings.phoneNumber}`, '_self')
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I am interested in Grand Foods products.')
    window.open(`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  const handleEmail = () => {
    const subject = encodeURIComponent('Inquiry about Grand Foods Products')
    const body = encodeURIComponent('Hello,\n\nI am interested in learning more about your products.\n\nBest regards')
    window.open(`mailto:${contactSettings.email}?subject=${subject}&body=${body}`, '_self')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      {/* Call Button */}
      <button
        onClick={handleCall}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Call Us"
      >
        <Phone size={24} />
        <span className="absolute right-full mr-3 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Call: {contactSettings.phoneNumber}
        </span>
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center group"
        title="WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="absolute right-full mr-3 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp: {contactSettings.whatsapp}
        </span>
      </button>

      {/* Email Button */}
      <button
        onClick={handleEmail}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Email Us"
      >
        <Mail size={24} />
        <span className="absolute right-full mr-3 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Email: {contactSettings.email}
        </span>
      </button>
    </div>
  )
}