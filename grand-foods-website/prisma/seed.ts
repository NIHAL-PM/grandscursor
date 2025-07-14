import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@grandfoods.com' },
    update: {},
    create: {
      email: 'admin@grandfoods.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Create initial contact settings
  await prisma.contactSettings.upsert({
    where: { id: 'contact-1' },
    update: {},
    create: {
      id: 'contact-1',
      phoneNumber: '+1-234-567-8900',
      whatsapp: '+1-234-567-8900',
      email: 'contact@grandfoods.com',
      address: '123 Grand Foods Street, Food City, FC 12345',
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
