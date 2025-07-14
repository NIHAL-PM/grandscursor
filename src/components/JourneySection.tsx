export default function JourneySection() {
  const journeySteps = [
    {
      year: '1998',
      title: 'Company Founded',
      description: 'Started as a small family business with a vision for quality snacks'
    },
    {
      year: '2005',
      title: 'First Major Expansion',
      description: 'Expanded our product line and established distribution network'
    },
    {
      year: '2010',
      title: 'Quality Certifications',
      description: 'Achieved ISO and FSSAI certifications for food safety'
    },
    {
      year: '2015',
      title: 'National Presence',
      description: 'Became a recognized brand across major Indian markets'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched online presence and modern distribution systems'
    },
    {
      year: '2024',
      title: 'Future Ready',
      description: 'Continuing innovation with sustainable practices and new products'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From humble beginnings to becoming a trusted name in the food industry
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200 hidden lg:block"></div>

          <div className="space-y-12">
            {journeySteps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center lg:items-start ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <span className="text-orange-600 font-bold text-lg">{step.year}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden lg:flex w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg z-10 my-8 lg:my-0"></div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}