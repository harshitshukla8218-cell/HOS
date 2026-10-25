import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ products, onQuickView }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group font-sans">
      {/* Scrollable Lane */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 pb-6 pt-2 no-scrollbar snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div 
            key={product._id} 
            className="flex-none w-[260px] md:w-[300px] snap-start"
          >
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop only, visible on hover) */}
      {products.length > 3 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 bg-white hover:bg-luxury-charcoal text-luxury-charcoal hover:text-white p-3 rounded-full shadow-lg border border-luxury-charcoal/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 bg-white hover:bg-luxury-charcoal text-luxury-charcoal hover:text-white p-3 rounded-full shadow-lg border border-luxury-charcoal/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
}
