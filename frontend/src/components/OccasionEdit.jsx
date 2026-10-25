import React from 'react';
import { Link } from 'react-router-dom';

export default function OccasionEdit() {
  const occasions = [
    { name: 'EVENING', img: '/images/catalog/category-gowns/858093683_1112916044873911_8752192377420439912_n.webp', query: 'evening' },
    { name: 'WEDDING GUEST', img: '/images/occasion_wedding.jpg', query: 'wedding-guest' },
    { name: 'VACATION', img: '/images/occasion_vacation.jpg', query: 'vacation' },
    { name: 'BRUNCH', img: '/images/occasion_brunch.jpg', query: 'brunch' },
    { name: 'WORKWEAR', img: '/images/trousers_celine_1.jpg', query: 'workwear' },
    { name: 'PARTY', img: '/images/occasion_party.jpg', query: 'party' },
  ];

  return (
    <section className="py-20 bg-atelier-marigold px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Headings */}
        <div className="text-center mb-16">
          <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest">
            DRESS FOR THE MOMENT
          </h2>
          <p className="text-xs text-luxury-muted mt-3 uppercase tracking-luxury max-w-lg mx-auto font-light leading-relaxed">
            Curated collections for every occasion.
          </p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occ) => (
            <Link
              key={occ.name}
              to={`/shop?occasion=${occ.query}`}
              className="group relative flex flex-col justify-end w-full aspect-[16/10] overflow-hidden bg-luxury-beige rounded-sm shadow-xs"
            >
              {/* Image */}
              <img
                src={occ.img}
                alt={occ.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors duration-300"></div>

              {/* Title Content */}
              <div className="relative p-6 z-10">
                <h3 className="font-serif text-lg tracking-wider text-white">
                  {occ.name}
                </h3>
                <span className="text-[9px] uppercase tracking-widest text-white/80 border-b border-white/20 pb-0.5 group-hover:border-white transition-colors duration-300 inline-block mt-2">
                  SHOP EDIT
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
