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

  // Create sample products
  const products = [
    {
      name: 'Roasted Peanut',
      description: 'Premium quality roasted peanuts with perfect crunch',
      image: '/images/products/ROASTED PEANUT.png',
      category: 'Nuts',
      rating: 4.8,
      featured: true,
    },
    {
      name: 'Masala Peanut',
      description: 'Spiced peanuts with traditional Indian masala',
      image: '/images/products/MASALA PEANUT.png',
      category: 'Nuts',
      rating: 4.9,
      featured: true,
    },
    {
      name: 'Vanilla Muffin',
      description: 'Soft and fluffy vanilla muffins',
      image: '/images/products/VANILLA MUFFIN.png',
      category: 'Baked Goods',
      rating: 4.7,
      featured: false,
    },
    {
      name: 'Chocolate Muffin',
      description: 'Rich chocolate muffins for chocolate lovers',
      image: '/images/products/CHOCOLATE MUFFIN.png',
      category: 'Baked Goods',
      rating: 4.8,
      featured: true,
    },
    {
      name: 'Butter Biscuits',
      description: 'Crispy butter biscuits made with real butter',
      image: '/images/products/BUTTER BISCUITS.png',
      category: 'Biscuits',
      rating: 4.6,
      featured: false,
    },
    {
      name: 'Orange Candy',
      description: 'Sweet and tangy orange flavored candies',
      image: '/images/products/ORANGE CANDY.png',
      category: 'Candies',
      rating: 4.5,
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  // Create sample testimonials
  const testimonials = [
    {
      name: 'John Smith',
      company: 'ABC Retail Store',
      message: 'Grand Foods products are always fresh and our customers love them!',
      rating: 5,
      featured: true,
    },
    {
      name: 'Sarah Johnson',
      company: 'Food Palace',
      message: 'Excellent quality and reliable delivery. Best supplier we have worked with.',
      rating: 5,
      featured: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }

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