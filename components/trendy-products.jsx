"use client"

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrendyProducts({ products = [] }) {
  // Refs for scrollable containers
  const tablesScrollRef = useRef(null);
  const chairsScrollRef = useRef(null);
  const desksScrollRef = useRef(null);

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

  // Scroll handlers
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Function to render a product grid with category heading
  const renderProductGrid = (products, categoryTitle, scrollRef) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-amber-600">{categoryTitle}</h3>
        
        {/* Navigation arrows - only visible on mobile */}
        <div className="flex md:hidden space-x-2">
          <button 
            onClick={() => scroll(scrollRef, 'left')}
            className="p-1 bg-amber-100 rounded-full hover:bg-amber-200"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-amber-600" />
          </button>
          <button 
            onClick={() => scroll(scrollRef, 'right')}
            className="p-1 bg-amber-100 rounded-full hover:bg-amber-200"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-amber-600" />
          </button>
        </div>
      </div>
      
      {/* Mobile: Horizontal scrollable container */}
      <div 
        ref={scrollRef}
        className="flex md:hidden overflow-x-auto gap-3 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div 
            key={`mobile-${product.id}`} 
            className="min-w-[200px] bg-white p-3 shadow-sm hover:shadow-md transition-shadow rounded-md"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative h-40 mb-2 overflow-hidden rounded-md">
                <Image
                  src={product.image_url || placeholderImage}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = placeholderImage; }}
                />
                {product.discount_price && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded-md">
                    SALE
                  </span>
                )}
              </div>
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <div className="flex items-center mt-1 mb-1">
                <div className="flex text-amber-500 text-xs">{"★★★★★"}</div>
              </div>
              <div className="flex items-center">
                {product.discount_price ? (
                  <>
                    <span className="text-amber-600 font-bold text-sm">${product.discount_price.toFixed(2)}</span>
                    <span className="ml-2 text-gray-400 line-through text-xs">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-gray-800 font-bold text-sm">${product.price.toFixed(2)}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-3 shadow-sm hover:shadow-md transition-shadow rounded-md">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-40 mb-2 overflow-hidden rounded-md">
                <Image
                  src={product.image_url || placeholderImage}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = placeholderImage; }}
                />
                {product.discount_price && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded-md">
                    SALE
                  </span>
                )}
              </div>
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <div className="flex items-center mt-1 mb-1">
                <div className="flex text-amber-500 text-xs">{"★★★★★"}</div>
              </div>
              <div className="flex items-center">
                {product.discount_price ? (
                  <>
                    <span className="text-amber-600 font-bold text-sm">${product.discount_price.toFixed(2)}</span>
                    <span className="ml-2 text-gray-400 line-through text-xs">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-gray-800 font-bold text-sm">৳{product.price.toFixed(2)}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-medium text-center mb-8">TRENDY PRODUCTS</h2>
        
        {/* Tables Row */}
        {renderProductGrid(tables, "Epoxy Table", tablesScrollRef)}
        
        {/* Chairs Row */}
        {renderProductGrid(chairs, "Epoxy Chair", chairsScrollRef)}
        
        {/* Desks Row */}
        {renderProductGrid(desks, "Epoxy Desk", desksScrollRef)}
      </div>

      {/* Add custom CSS to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}