import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [totalProducts, totalContacts, totalCatalogs, totalTestimonials] = await Promise.all([
      prisma.product.count(),
      prisma.contactForm.count(),
      prisma.productCatalog.count({ where: { isActive: true } }),
      prisma.testimonial.count()
    ])

    return NextResponse.json({
      totalProducts,
      totalContacts,
      totalCatalogs,
      totalTestimonials
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}