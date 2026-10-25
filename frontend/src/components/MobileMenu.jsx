import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose }) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  if (!isOpen) return null;

  const toggleAccordion = (section) => {
    if (activeAccordion === section) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(section);
    }
  };

  const menuItems = {
    shop: [
      { name: 'All Products', link: '/shop' },
      { name: 'Dresses', link: '/shop?category=Dresses' },
      { name: 'Tops', link: '/shop?category=Tops' },
      { name: 'Jackets', link: '/shop?category=Jackets' },
      { name: 'Co-ords', link: '/shop?category=Co-ords' },
      { name: 'Trousers', link: '/shop?category=Trousers' },
      { name: 'Gowns', link: '/shop?category=Gowns' },
    ],
    collections: [
      { name: 'New Season', link: '/shop?collection=new-season' },
      { name: 'Resort', link: '/shop?collection=resort' },
      { name: 'Evening', link: '/shop?collection=evening' },
      { name: 'Vacation', link: '/shop?collection=vacation' },
      { name: 'Workwear', link: '/shop?collection=workwear' },
    ],
    occasion: [
      { name: 'Wedding Guest', link: '/shop?occasion=wedding-guest' },
      { name: 'Evening Out', link: '/shop?occasion=evening' },
      { name: 'Party Edit', link: '/shop?occasion=party' },
      { name: 'Resort & Brunch', link: '/shop?occasion=brunch' },
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

      {/* Menu Body */}
      <div className="relative w-4/5 max-w-sm bg-luxury-ivory h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <span className="font-serif text-lg tracking-widest font-black text-luxury-charcoal">HOS</span>
          <button onClick={onClose} aria-label="Close menu">
            <X strokeWidth={1} size={24} className="text-luxury-charcoal" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-4 font-sans text-sm uppercase tracking-luxury">
          <div>
            <Link to="/" onClick={onClose} className="block py-2 text-luxury-charcoal font-medium">Home</Link>
          </div>

          {/* SHOP Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion('shop')}
              className="w-full flex justify-between items-center py-2 text-luxury-charcoal font-medium text-left"
            >
              <span>Shop</span>
              {activeAccordion === 'shop' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'shop' && (
              <div className="pl-4 mt-2 space-y-2 border-l border-luxury-charcoal/5">
                {menuItems.shop.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    onClick={onClose}
                    className="block py-1 text-xs text-luxury-muted hover:text-luxury-charcoal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* COLLECTIONS Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion('collections')}
              className="w-full flex justify-between items-center py-2 text-luxury-charcoal font-medium text-left"
            >
              <span>Collections</span>
              {activeAccordion === 'collections' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'collections' && (
              <div className="pl-4 mt-2 space-y-2 border-l border-luxury-charcoal/5">
                {menuItems.collections.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    onClick={onClose}
                    className="block py-1 text-xs text-luxury-muted hover:text-luxury-charcoal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* OCCASIONS Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion('occasions')}
              className="w-full flex justify-between items-center py-2 text-luxury-charcoal font-medium text-left"
            >
              <span>Occasion Edit</span>
              {activeAccordion === 'occasions' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'occasions' && (
              <div className="pl-4 mt-2 space-y-2 border-l border-luxury-charcoal/5">
                {menuItems.occasion.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    onClick={onClose}
                    className="block py-1 text-xs text-luxury-muted hover:text-luxury-charcoal"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link to="/shop?collection=sale" onClick={onClose} className="block py-2 text-red-700 font-semibold">Sale</Link>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-luxury-charcoal/10 pt-6 space-y-4 font-sans text-xs uppercase tracking-luxury">
          <Link to="/account" onClick={onClose} className="block text-luxury-muted hover:text-luxury-charcoal">Account</Link>
          <Link to="/wishlist" onClick={onClose} className="block text-luxury-muted hover:text-luxury-charcoal">Wishlist</Link>
          <div className="text-[10px] text-luxury-muted mt-8 normal-case">
            © 2026 HOS — HOS
          </div>
        </div>
      </div>
    </div>
  );
}
