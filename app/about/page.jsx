import Image from "next/image"
import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Eight Hands Work</h1>

          <div className="mb-12">
            <Image src="/logo.png" alt="Eight Hands Work" width={300} height={120} className="mx-auto mb-8" />

            <p className="text-lg text-gray-700 mb-6">
              Eight Hands Work started its commercial journey in 2017. We are able to offer the highest quality
              production of any custom product with epoxy. We are committed to keeping the commitment on time.
            </p>

            <p className="text-lg text-gray-700 mb-6">
              Currently our 1000 square feet workshop is located in Narayanganj. We are able to deliver orders of any
              quantity. Always trust Eighthands Work with any epoxy product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 mb-6">
                Epoxy furniture is the ideal product for discerning people. Our aim is to provide fair prices to the
                discerning people at international level. And to honor Bangladesh by exporting to the outside world.
              </p>

              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To create beautiful, durable, and functional epoxy furniture that exceeds our customers' expectations.
                We strive to combine traditional craftsmanship with innovative techniques to deliver unique pieces that
                stand the test of time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Founders</h2>
              <ul className="space-y-6">
                <li className="flex items-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    SH
                  </div>
                  <div>
                    <h3 className="font-bold">SOURAV HOSSAIN</h3>
                    <p className="text-gray-600">Co-Founder & Creative Director</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    AK
                  </div>
                  <div>
                    <h3 className="font-bold">AHAD KHONDOKAR</h3>
                    <p className="text-gray-600">Co-Founder & Production Manager</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    MP
                  </div>
                  <div>
                    <h3 className="font-bold">MOHIUDDIN PATHAN</h3>
                    <p className="text-gray-600">Co-Founder & Business Development</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    SJ
                  </div>
                  <div>
                    <h3 className="font-bold">SHAHJALAL JIBON</h3>
                    <p className="text-gray-600">Co-Founder & Operations Manager</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Achievements</h2>
            <p className="text-center text-gray-700 mb-8">
              We have successfully worked with numerous prestigious clients across various industries, delivering
              exceptional quality and service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Bangladesh Navy</h3>
                <p className="text-gray-600">Provided custom furniture solutions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Pizzaburg</h3>
                <p className="text-gray-600">Furnished restaurant interiors</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Roofliners</h3>
                <p className="text-gray-600">Collaborated on architectural projects</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Abedin Equipment Ltd</h3>
                <p className="text-gray-600">Supplied custom furniture</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">KC</h3>
                <p className="text-gray-600">Designed and delivered premium furniture</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Ecowood Ltd</h3>
                <p className="text-gray-600">Partnered for sustainable furniture</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Minimal</h3>
                <p className="text-gray-600">Created minimalist design pieces</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Navana Furniture</h3>
                <p className="text-gray-600">Collaborated on luxury collections</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">Orchid Architect LTD</h3>
                <p className="text-gray-600">Provided architectural furniture</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
