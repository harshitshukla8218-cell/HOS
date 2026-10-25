import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext.jsx';

export default function FeaturedCollection() {
  const { cmsData } = useCMS();
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/shop?collection=evening');
  };

  return (
    <section className="relative w-full h-[65vh] overflow-hidden bg-luxury-nearblack">
      {/* Background Media */}
      <div className="absolute inset-0 select-none pointer-events-none">
        <img
          src={cmsData.featuredCollection?.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2560"}
          alt="Featured Collection Banner"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content overlays */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 md:px-24 z-10">
        <div className="max-w-xl">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 font-medium mb-3 block">
            FEATURED EDIT
          </span>

          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-white uppercase mb-4 leading-tight">
            {cmsData.featuredCollection?.heading || "THE SIGNATURE EDIT"}
          </h2>

          <p className="text-xs md:text-sm text-white/90 font-sans font-light tracking-wide mb-8 leading-relaxed">
            {cmsData.featuredCollection?.subheading || "Where refined silhouettes meet modern femininity."}
          </p>

          <button
            onClick={handleExplore}
            className="bg-atelier-coral hover:bg-transparent text-white px-8 py-3.5 text-xs uppercase tracking-luxury font-medium border border-transparent hover:border-white transition-all duration-500 rounded-sm"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      </div>
    </section>
  );
}
