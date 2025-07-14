import { prisma } from '@/lib/db'
import HeroSection from '@/components/HeroSection'
import ProductShowcase from '@/components/ProductShowcase'
import StatsSection from '@/components/StatsSection'
import JourneySection from '@/components/JourneySection'
import CallToAction from '@/components/CallToAction'
import DynamicContactButtons from '@/components/DynamicContactButtons'

export default async function Home() {
  // Fetch contact settings for dynamic buttons
  const contactSettings = await prisma.contactSettings.findFirst()
  
  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 6,
  })

  return (
    <main className="min-h-screen">
      <HeroSection />
      <DynamicContactButtons contactSettings={contactSettings} />
      <ProductShowcase products={featuredProducts} />
      <StatsSection />
      <JourneySection />
      <CallToAction />
    </main>
  )
}