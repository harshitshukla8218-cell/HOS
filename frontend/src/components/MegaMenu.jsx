import React from 'react';
import { Link } from 'react-router-dom';

export default function MegaMenu({ activeTab, onClose }) {
  if (!activeTab) return null;

  const shopItems = [
    { name: 'Dresses', link: '/shop?category=Dresses' },
    { name: 'Tops', link: '/shop?category=Tops' },
    { name: 'Jackets', link: '/shop?category=Jackets' },
    { name: 'Co-ords', link: '/shop?category=Co-ords' },
    { name: 'Trousers', link: '/shop?category=Trousers' },
    { name: 'Skirts', link: '/shop?category=Skirts' },
    { name: 'Gowns', link: '/shop?category=Gowns' },
  ];

  const collectionsItems = [
    { name: 'New Season', link: '/shop?collection=new-season' },
    { name: 'Resort', link: '/shop?collection=resort' },
    { name: 'Evening', link: '/shop?collection=evening' },
    { name: 'Vacation', link: '/shop?collection=vacation' },
    { name: 'Workwear', link: '/shop?collection=workwear' },
    { name: 'Weekend', link: '/shop?collection=weekend' },
    { name: 'Limited Edition', link: '/shop?collection=limited-edition' },
  ];

  const occasionItems = [
    { name: 'Wedding Guest', link: '/shop?occasion=wedding-guest' },
    { name: 'Evening', link: '/shop?occasion=evening' },
    { name: 'Party', link: '/shop?occasion=party' },
    { name: 'Vacation', link: '/shop?occasion=vacation' },
    { name: 'Brunch', link: '/shop?occasion=brunch' },
    { name: 'Workwear', link: '/shop?occasion=workwear' },
  ];

  return (
    <div 
      className="absolute top-full left-0 w-full bg-luxury-ivory border-b border-luxury-charcoal/5 shadow-sm z-40 transition-all duration-300 font-sans py-12 px-8 md:px-24 hidden md:block"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        {/* Column 1: Shop */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold border-b border-luxury-charcoal/10 pb-2 mb-4">
            Shop Categories
          </h4>
          <ul className="space-y-2">
            {shopItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.link} 
                  onClick={onClose}
                  className="text-sm text-luxury-muted hover:text-luxury-charcoal transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold border-b border-luxury-charcoal/10 pb-2 mb-4">
            Curated Collections
          </h4>
          <ul className="space-y-2">
            {collectionsItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.link} 
                  onClick={onClose}
                  className="text-sm text-luxury-muted hover:text-luxury-charcoal transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Occasion Edit */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold border-b border-luxury-charcoal/10 pb-2 mb-4">
            Occasion Edit
          </h4>
          <ul className="space-y-2">
            {occasionItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.link} 
                  onClick={onClose}
                  className="text-sm text-luxury-muted hover:text-luxury-charcoal transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Editorial Showcase image */}
        <div className="flex flex-col justify-between">
          <div className="relative group overflow-hidden bg-luxury-beige h-40">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600" 
              alt="Editorial Menu Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest font-medium border border-white/40 px-3 py-1.5 backdrop-blur-sm">
                THE HOS JOURNAL
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs italic text-luxury-muted">
              "Effortless elegance designed for women who define their own style."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
