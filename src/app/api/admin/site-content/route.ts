import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching site content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, content, type } = await request.json()
    if (!key) return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    let updated
    const existing = await prisma.siteContent.findUnique({ where: { key } })
    if (existing) {
      updated = await prisma.siteContent.update({ where: { key }, data: { content, type, updatedAt: new Date() } })
    } else {
      updated = await prisma.siteContent.create({ data: { key, content, type } })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating site content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}