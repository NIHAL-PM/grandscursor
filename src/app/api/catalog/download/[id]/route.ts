import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const catalog = await prisma.productCatalog.findUnique({
      where: { id: params.id, isActive: true },
    })

    if (!catalog) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', catalog.filename)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${catalog.originalName}"`,
        'Content-Length': catalog.fileSize.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading catalog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}