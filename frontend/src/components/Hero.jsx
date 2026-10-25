import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext.jsx';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2560&auto=format&fit=crop",
  "/images/hero_fallback.jpg"
];

export default function Hero() {
  const { cmsData } = useCMS();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImage = cmsData.hero?.desktopImage;
  const slides = heroImage ? [heroImage, ...HERO_IMAGES.filter(img => img !== heroImage).slice(0, 7)] : HERO_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Slides every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleShop = () => {
    navigate('/shop');
  };

  const handleExplore = () => {
    navigate('/shop?collection=new-season');
  };

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-luxury-beige">
      {/* Background Media with Automatic Cross-fade Carousel */}
      <div className="absolute inset-0 select-none pointer-events-none">
        {slides.map((imgUrl, index) => (
          <img
            key={imgUrl}
            src={imgUrl}
            alt={`Luxury Fashion Hero Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
            onError={(event) => {
              const fallbackImage = '/images/hero_fallback.jpg';
              if (!event.currentTarget.src.endsWith(fallbackImage)) {
                event.currentTarget.src = fallbackImage;
              }
            }}
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              zIndex: index === currentImageIndex ? 10 : 0,
              transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1.0)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '1500ms',
              transitionTimingFunction: 'ease-in-out'
            }}
          />
        ))}

        {/* Backdrop Darkening Overlay */}
        <div className="absolute inset-0 bg-black/25 z-20"></div>
      </div>

      {/* Hero Content Overlays */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-30">

        {/* Subtitle Label */}
        <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-white font-semibold mb-3 md:mb-5 drop-shadow-sm fade-in-up">
          HOS — HOUSE OF SIMONS
        </span>

        {/* Heading */}
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-light mb-4 md:mb-6 tracking-wide max-w-3xl leading-tight drop-shadow-md uppercase fade-in-up">
          {cmsData.hero?.heading || "THE NEW STANDARD OF MODERN LUXURY"}
        </h1>

        {/* Subtext */}
        <p className="text-xs md:text-sm text-white/90 font-sans font-light tracking-wide mb-8 md:mb-12 max-w-md leading-relaxed drop-shadow-sm fade-in-up">
          {cmsData.hero?.subheading || "Designed for women who define their own style."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 fade-in-up">

          <button
            onClick={handleShop}
            className="bg-atelier-coral hover:bg-luxury-gold text-white px-8 py-3.5 text-xs uppercase tracking-luxury font-medium border border-transparent hover:border-white transition-all duration-500 shadow-lg hover:scale-105 rounded-sm"
          >
            SHOP NEW ARRIVALS
          </button>

          <button
            onClick={handleExplore}
            className="bg-transparent hover:bg-white text-white hover:text-luxury-charcoal px-8 py-3.5 text-xs uppercase tracking-luxury font-medium border border-white/60 hover:border-white backdrop-blur-xs transition-all duration-500 hover:scale-105 rounded-sm"
          >
            EXPLORE COLLECTION
          </button>

        </div>
      </div>

      {/* Inline styles for custom zoom animations */}
      <style>{`
        @keyframes zoomOut {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.08); }
        }
      `}</style>

    </section>
  );
}
