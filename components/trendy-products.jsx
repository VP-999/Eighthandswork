"use client"

import Link from 'next/link';
import Image from 'next/image';

export default function TrendyProducts({ products = [] }) {
  // Group products by category
  const tables = products.filter(product => 
    product.category?.includes('Table') || 
    product.category === 'Epoxy Table' || 
    product.category === 'Center Table' || 
    product.category === 'Dining Table'
  ).slice(0, 4);
  
  const chairs = products.filter(product => 
    product.category === 'Chair' || 
    product.category === 'Armchair' || 
    product.category === 'Bar Stool' || 
    product.category === 'Stool'
  ).slice(0, 4);
  
  const desks = products.filter(product => 
    product.category === 'Office Desk' || 
    product.category?.includes('Desk')
  ).slice(0, 4);

  // Create a placeholder image
  const placeholderImage = "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800";

  // Function to render a product grid
  const renderProductGrid = (products) => (
    <div className="mb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-64 mb-4 overflow-hidden rounded-md">
                <Image
                  src={product.image_url || placeholderImage}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
                {product.discount_price && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded-md">
                    SALE
                  </span>
                )}
              </div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex text-amber-500">
                  {"★★★★★"}
                </div>
              </div>
              <div className="flex items-center">
                {product.discount_price ? (
                  <>
                    <span className="text-amber-600 font-bold">${product.discount_price.toFixed(2)}</span>
                    <span className="ml-2 text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-gray-800 font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-medium text-center mb-16">TRENDY PRODUCTS</h2>
        
        {/* Tables Row */}
        {renderProductGrid(tables)}
        
        {/* Chairs Row */}
        {renderProductGrid(chairs)}
        
        {/* Desks Row */}
        {renderProductGrid(desks)}
      </div>
    </section>
  );
}