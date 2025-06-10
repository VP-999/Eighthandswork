"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrendyProducts({ products }) {
  const [activeTab, setActiveTab] = useState('new');
  
  // Filter products based on active tab
  const filteredProducts = products?.filter(product => {
    if (activeTab === 'new') return product.is_new;
    if (activeTab === 'featured') return product.is_featured;
    if (activeTab === 'bestseller') return product.is_bestseller;
    return false;
  });

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
          {filteredProducts?.map((product) => (
            <div key={product.id} className="bg-white p-4">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-64 mb-4 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
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