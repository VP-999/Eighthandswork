// Create a new file: hooks/useScrollSmooth.js
"use client";

import { useEffect } from 'react';

export function useScrollSmooth() {
  useEffect(() => {
    // Function to handle anchor clicks
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      
      // Only process anchor links that start with #
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
    
    // Get all anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });
    
    // Cleanup
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);
}