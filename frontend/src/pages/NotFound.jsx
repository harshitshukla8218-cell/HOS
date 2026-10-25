import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center font-sans overflow-hidden bg-luxury-nearblack">
      {/* Background Image */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000"
          alt="Luxury Fashion Editorial"
          className="w-full h-full object-cover opacity-35"
        />
      </div>

      {/* Content Card */}
      <div className="relative text-center px-6 z-10 space-y-6 max-w-md">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
          Error Code 404
        </span>
        
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-widest text-white uppercase">
          NOT FOUND
        </h1>
        
        <p className="text-xs md:text-sm text-white/80 font-sans font-light tracking-wide leading-relaxed">
          "The piece you're looking for may have moved."
        </p>

        <div className="pt-6">
          <button
            onClick={() => navigate('/shop')}
            className="bg-white hover:bg-luxury-champagne text-luxury-charcoal hover:text-white px-8 py-3.5 text-[10px] uppercase tracking-luxury font-semibold transition-all duration-300 rounded-sm"
          >
            BACK TO SHOP
          </button>
        </div>
      </div>
    </div>
  );
}
