import React from 'react';
import { Camera } from 'lucide-react';

export default function InstagramGrid() {
  const posts = [
    { id: 1, img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600' },
    { id: 2, img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600' },
    { id: 3, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600' },
    { id: 4, img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600' },
  ];

  return (
    <section className="py-20 bg-atelier-seafoam border-t border-luxury-charcoal/5 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Headings */}
        <div className="text-center mb-12">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-muted font-semibold">
            Follow our journey
          </span>
          <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest mt-2">
            INSTAGRAM
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-charcoal mt-2 inline-block font-semibold"
          >
            @HOUSEOFSIMONS
          </a>
        </div>

        {/* 4 columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square bg-luxury-beige overflow-hidden rounded-sm"
            >
              <img
                src={post.img}
                alt={`Instagram Post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="text-white flex flex-col items-center">
                  <Camera size={20} strokeWidth={1.5} />
                  <span className="text-[9px] uppercase tracking-luxury mt-2">View Post</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
