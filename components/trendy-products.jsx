"use client"

import Link from 'next/link';
import Image from 'next/image';

export default function TrendyProducts({ products = [] }) {
  // Create placeholder products if no products exist
  const defaultProducts = [
    // Tables
    {
      id: '1',
      name: 'Premium Epoxy River Table',
      description: 'Handcrafted epoxy river table with live edge wood',
      price: 1299.99,
      category: 'Epoxy Table',
      image_url: 'https://images.pexels.com/photos/3679601/pexels-photo-3679601.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '2',
      name: 'Modern Center Table',
      description: 'Contemporary center table with glass top',
      price: 599.99,
      category: 'Center Table',
      image_url: 'https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '3',
      name: 'Luxury Coffee Table',
      description: 'Elegant coffee table with marble top',
      price: 799.99,
      category: 'Center Table',
      image_url: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '4',
      name: 'Minimalist Side Table',
      description: 'Clean lines and modern design side table',
      price: 349.99,
      category: 'Center Table',
      image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    
    // Chairs
    {
      id: '5',
      name: 'Club Chair',
      description: 'Elegant light gray club chair with slim legs',
      price: 99.00,
      category: 'Chair',
      image_url: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '6',
      name: 'Giulia Chair',
      description: 'Minimalist wooden frame chair with padded seat',
      price: 17.00,
      category: 'Chair',
      image_url: 'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '7',
      name: 'Modern Accent Chair',
      description: 'Contemporary design with premium comfort',
      price: 249.99,
      category: 'Chair',
      image_url: 'https://images.pexels.com/photos/4207788/pexels-photo-4207788.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '8',
      name: 'Scandinavian Dining Chair',
      description: 'Classic Nordic design with comfortable seating',
      price: 149.99,
      category: 'Chair',
      image_url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    
    // Desks
    {
      id: '9',
      name: 'Executive Office Desk',
      description: 'Spacious office desk with built-in storage',
      price: 899.99,
      category: 'Office Desk',
      image_url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '10',
      name: 'Modern Writing Desk',
      description: 'Sleek writing desk perfect for home office',
      price: 499.99,
      category: 'Office Desk',
      image_url: 'https://images.pexels.com/photos/5240544/pexels-photo-5240544.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '11',
      name: 'Standing Desk',
      description: 'Adjustable height desk for ergonomic work',
      price: 649.99,
      category: 'Office Desk',
      image_url: 'https://images.pexels.com/photos/3740200/pexels-photo-3740200.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: '12',
      name: 'Corner Office Desk',
      description: 'Space-saving corner desk with ample workspace',
      price: 749.99,
      category: 'Office Desk',
      image_url: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];
  
  // Use products from database or default to placeholders
  const allProducts = products.length > 0 ? products : defaultProducts;
  
  // Group products by category
  const tables = allProducts.filter(product => 
    product.category?.includes('Table') || 
    product.category === 'Epoxy Table' || 
    product.category === 'Center Table' || 
    product.category === 'Dining Table'
  ).slice(0, 4);
  
  const chairs = allProducts.filter(product => 
    product.category === 'Chair' || 
    product.category === 'Armchair' || 
    product.category === 'Bar Stool' || 
    product.category === 'Stool'
  ).slice(0, 4);
  
  const desks = allProducts.filter(product => 
    product.category === 'Office Desk' || 
    product.category?.includes('Desk')
  ).slice(0, 4);

  // Create a placeholder image
  const placeholderImage = "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800";

  // Function to render a product grid
  const renderProductGrid = (products, title) => (
    <div className="mb-16">
      <h3 className="text-2xl font-medium mb-6 pl-2 border-l-4 border-amber-500">{title}</h3>
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
        <h2 className="text-3xl font-medium text-center mb-12">TRENDY PRODUCTS</h2>
        
        {/* Tables Row */}
        {renderProductGrid(tables, "Premium Tables")}
        
        {/* Chairs Row */}
        {renderProductGrid(chairs, "Stylish Chairs")}
        
        {/* Desks Row */}
        {renderProductGrid(desks, "Office Desks")}
      </div>
    </section>
  );
}