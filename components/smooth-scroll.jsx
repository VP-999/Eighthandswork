"use client";

import { useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function SmoothScroll() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add smooth scrolling to all anchor links
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header height
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          window.history.pushState(null, '', href);
        }
      }
    };
    
    // Apply CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Get all anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });
    
    // Show/hide scroll-to-top button
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", toggleVisibility);
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = '';
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {/* Scroll to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
}