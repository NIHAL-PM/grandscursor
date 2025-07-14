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
  // Fetch homepage content
  const siteContent = await prisma.siteContent.findMany({
    where: {
      key: {
        in: [
          'home_hero_title',
          'home_hero_subtitle',
          'home_stats',
          'home_journey',
          'home_cta',
        ],
      },
    },
  })
  const contentMap = Object.fromEntries(siteContent.map(c => [c.key, c.content]))
  return (
    <main className="min-h-screen">
      <HeroSection
        title={contentMap['home_hero_title']}
        subtitle={contentMap['home_hero_subtitle']}
      />
      <DynamicContactButtons contactSettings={contactSettings} />
      <ProductShowcase products={featuredProducts} />
      <StatsSection statsJson={contentMap['home_stats']} />
      <JourneySection journeyJson={contentMap['home_journey']} />
      <CallToAction ctaText={contentMap['home_cta']} />
    </main>
  )
}