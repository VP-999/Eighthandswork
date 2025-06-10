"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrendyProducts({ products = [] }) {
  const [activeTab, setActiveTab] = useState('new');
  
  // Create placeholder products if no products exist
  const defaultProducts = [
    {
      id: '1',
      name: 'Boca Da Lobo Erosion Ring',
      description: 'Luxury designer ring table with unique erosion style',
      price: 120.00,
      discount_price: 90.00,
      category: 'Center Table',
      image_url: '/images/placeholder.jpg',
      is_new: true,
      is_featured: false,
      is_bestseller: true
    },
    {
      id: '2',
      name: 'Brenwen Sheepskin Stool',
      description: 'Modern stool with soft sheepskin top and gold base',
      price: 56.99,
      discount_price: 46.99,
      category: 'Stool',
      image_url: '/images/placeholder.jpg',
      is_new: true,
      is_featured: true,
      is_bestseller: false
    },
  ];
  
  // Use products from database or default to placeholders
  const allProducts = products.length > 0 ? products : defaultProducts;
  
  // Filter products based on active tab
  const filteredProducts = allProducts.filter(product => {
    if (activeTab === 'new') return product.is_new;
    if (activeTab === 'featured') return product.is_featured;
    if (activeTab === 'bestseller') return product.is_bestseller;
    return true;
  });
  
  // If no products match the filter, show all products
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;

  // Create a placeholder image
  const placeholderImage = "/images/placeholder.jpg";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-medium text-center mb-10">TRENDY PRODUCTS</h2>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-6 py-2 ${activeTab === 'new' ? 'bg-amber-500 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('new')}
            >
              New Products
            </button>
            <button 
              className={`px-6 py-2 ${activeTab === 'featured' ? 'bg-amber-500 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('featured')}
            >
              Featured Products
            </button>
            <button 
              className={`px-6 py-2 ${activeTab === 'bestseller' ? 'bg-amber-500 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('bestseller')}
            >
              Best Seller
            </button>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="bg-white p-4">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-64 mb-4 overflow-hidden">
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
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="font-medium">{product.name}</h3>
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
    </section>
  );
}