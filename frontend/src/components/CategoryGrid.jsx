import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryGrid() {
  const categories = [
    { name: 'DRESSES', img: '/images/dresses_aurelia_1.jpg', query: 'Dresses' },
    { name: 'TOPS', img: '/images/tops_camisole_1.jpg', query: 'Tops' },
    { name: 'CO-ORDS', img: '/images/coords_simone_1.jpg', query: 'Co-ords' },
    { name: 'JACKETS', img: '/images/catalog/item-08/E94E0485-9D3E-4405-AC61-633B6B495B09.png', query: 'Jackets' },
    { name: 'TROUSERS', img: '/images/trousers_celine_1.jpg', query: 'Trousers' },
    { name: 'SKIRTS', img: '/images/dresses_aurelia_2.jpg', query: 'Skirts' },
    { name: 'JUMPSUITS', img: '/images/coords_simone_2.jpg', query: 'Jumpsuits' },
    { name: 'GOWNS', img: '/images/catalog/category-gowns/858093683_1112916044873911_8752192377420439912_n.webp', query: 'Gowns' },
  ];

  return (
    <section className="py-20 bg-atelier-sage px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Headings */}
        <div className="text-center mb-16">
          <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest">
            THE HOS WARDROBE
          </h2>
          <p className="text-xs text-luxury-muted mt-3 uppercase tracking-luxury max-w-lg mx-auto font-light leading-relaxed">
            Explore contemporary silhouettes designed for every expression.
          </p>
        </div>

        {/* Categories Grid (4 columns desktop, 3 tablet, 2 mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.query}`}
              className="group relative flex flex-col items-center bg-white border border-luxury-charcoal/5 rounded-sm overflow-hidden"
            >
              {/* Image Frame */}
              <div className="w-full aspect-[4/5] overflow-hidden bg-luxury-beige">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Title & Explore link card */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 flex flex-col justify-end p-6 transition-colors duration-300">
                <h3 className="text-sm font-semibold tracking-luxury text-white uppercase">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-white/80 uppercase tracking-widest mt-1 border-b border-white/20 w-fit pb-0.5 group-hover:border-white transition-colors duration-300">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
