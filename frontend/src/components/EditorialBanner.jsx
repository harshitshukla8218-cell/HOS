import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext.jsx';

export default function EditorialBanner() {
  const { cmsData } = useCMS();
  const navigate = useNavigate();

  const handleDiscover = () => {
    navigate('/shop');
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-luxury-nearblack">
      {/* Background Image */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <img
          src={cmsData.editorialBanner?.image || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2560&auto=format&fit=crop"}
          alt="Editorial Banner Background"
          className="w-full h-full object-cover opacity-85"
        />
        {/* Darkening layer */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 font-medium mb-3">
          HOS EDITORIAL
        </span>

        <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white uppercase mb-4 md:mb-6 max-w-2xl leading-tight">
          {cmsData.editorialBanner?.heading || "THE ART OF DRESSING"}
        </h2>

        <p className="text-xs md:text-sm text-white/95 font-sans font-light tracking-wide max-w-md mb-8 md:mb-10 leading-relaxed">
          {cmsData.editorialBanner?.subheading || "Contemporary silhouettes. Timeless confidence."}
        </p>

        <button
          onClick={handleDiscover}
          className="bg-white hover:bg-transparent text-luxury-charcoal hover:text-white px-8 py-3.5 text-xs uppercase tracking-luxury font-medium border border-transparent hover:border-white transition-all duration-500 rounded-sm"
        >
          DISCOVER HOS
        </button>
      </div>
    </section>
  );
}
