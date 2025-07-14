import { Users, Award, Globe, TrendingUp } from 'lucide-react'

interface Stat {
  icon?: string
  number: string
  label: string
  description: string
}

const iconMap: Record<string, JSX.Element> = {
  users: <Users className="w-8 h-8 text-orange-600" />,
  award: <Award className="w-8 h-8 text-orange-600" />,
  globe: <Globe className="w-8 h-8 text-orange-600" />,
  trending: <TrendingUp className="w-8 h-8 text-orange-600" />,
}

export default function StatsSection({ statsJson }: { statsJson?: string }) {
  let stats: Stat[] = [
    {
      icon: 'users',
      number: '1000+',
      label: 'Happy Customers',
      description: 'Satisfied distributors and retailers',
    },
    {
      icon: 'award',
      number: '25+',
      label: 'Years Experience',
      description: 'Trusted name in food industry',
    },
    {
      icon: 'globe',
      number: '500+',
      label: 'Products',
      description: 'Diverse range of quality snacks',
    },
    {
      icon: 'trending',
      number: '99%',
      label: 'Quality Rating',
      description: 'Consistent quality standards',
    },
  ]
  if (statsJson) {
    try {
      const parsed = JSON.parse(statsJson)
      if (Array.isArray(parsed)) stats = parsed
    } catch {}
  }
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            By the Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence speaks through our achievements
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {iconMap[stat.icon || 'users']}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-1">
                {stat.label}
              </h4>
              <p className="text-gray-600 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}