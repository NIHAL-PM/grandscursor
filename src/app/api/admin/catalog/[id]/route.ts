import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { isActive } = data

    const catalog = await prisma.productCatalog.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json(catalog)
  } catch (error) {
    console.error('Error updating catalog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get catalog info before deleting
    const catalog = await prisma.productCatalog.findUnique({
      where: { id: params.id },
    })

    if (!catalog) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', 'uploads', catalog.filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await prisma.productCatalog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Catalog deleted successfully' })
  } catch (error) {
    console.error('Error deleting catalog:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}