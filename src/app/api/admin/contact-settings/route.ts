import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const settings = await prisma.contactSettings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        phoneNumber: '',
        whatsapp: '',
        email: '',
        address: '',
        businessHours: ''
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching contact settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { phoneNumber, whatsapp, email, address, businessHours } = data

    // Validate required fields
    if (!phoneNumber || !whatsapp || !email) {
      return NextResponse.json(
        { error: 'Phone number, WhatsApp, and email are required' },
        { status: 400 }
      )
    }

    // Check if settings exist
    const existingSettings = await prisma.contactSettings.findFirst()

    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.contactSettings.update({
        where: { id: existingSettings.id },
        data: {
          phoneNumber,
          whatsapp,
          email,
          address: address || '',
          businessHours: businessHours || '',
          updatedAt: new Date()
        }
      })
    } else {
      // Create new settings
      settings = await prisma.contactSettings.create({
        data: {
          phoneNumber,
          whatsapp,
          email,
          address: address || '',
          businessHours: businessHours || '',
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating contact settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}