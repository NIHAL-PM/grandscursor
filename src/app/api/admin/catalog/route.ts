import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const catalogs = await prisma.productCatalog.findMany({
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(catalogs)
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}