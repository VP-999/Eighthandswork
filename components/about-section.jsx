import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Eight Hands Work</h2>
            <p className="text-gray-700 mb-6">
              Eight Hands Work started its commercial journey in 2017. We are able to offer the highest quality
              production of any custom product with epoxy. We are committed to keeping the commitment on time.
            </p>
            <p className="text-gray-700 mb-6">
              Currently our 1000 square feet workshop is located in Narayanganj. We are able to deliver orders of any
              quantity. Always trust Eighthands Work with any epoxy product.
            </p>
            <h3 className="text-xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-700 mb-6">
              Epoxy furniture is the ideal product for discerning people. Our aim is to provide fair prices to the
              discerning people at international level. And to honor Bangladesh by exporting to the outside world.
            </p>
            <h3 className="text-xl font-bold mb-4">Founders</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>SOURAV HOSSAIN</li>
              <li>AHAD KHONDOKAR</li>
              <li>MOHIUDDIN PATHAN</li>
              <li>SHAHJALAL JIBON</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square relative rounded-lg shadow-lg overflow-hidden">
              <Image src="/hero-bg.png" alt="Eight Hands Work Furniture" fill className="object-cover" />
            </div>
            <div className="aspect-square relative rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/product12.png"
                alt="Eight Hands Work Furniture"
                fill
                className="object-cover"
              />
            </div>
            <div className="aspect-square relative rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/product21.png"
                alt="Eight Hands Work Furniture"
                fill
                className="object-cover"
              />
            </div>
            <div className="aspect-square relative rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/product3.png"
                alt="Eight Hands Work Furniture"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}