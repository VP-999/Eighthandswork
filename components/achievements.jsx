export default function Achievements() {
  const achievements = [
    { name: "Bangladesh Navy", description: "Provided custom furniture solutions" },
    { name: "Pizzaburg", description: "Furnished restaurant interiors" },
    { name: "Roofliners", description: "Collaborated on architectural projects" },
    { name: "Abedin Equipment Ltd", description: "Supplied custom furniture" },
    { name: "KC", description: "Designed and delivered premium furniture" },
    { name: "Ecowood Ltd", description: "Partnered for sustainable furniture" },
    { name: "Minimal", description: "Created minimalist design pieces" },
    { name: "Navana Furniture", description: "Collaborated on luxury collections" },
    { name: "Orchid Architect LTD", description: "Provided architectural furniture" },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Our Clients</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          We have successfully worked with numerous prestigious clients across various industries, delivering
          exceptional quality and service.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
              <p className="text-gray-600">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
