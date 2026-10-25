import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-luxury-nearblack text-luxury-ivory font-sans pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/5">

        {/* Brand Column */}
        <div className="col-span-2 flex flex-col justify-between space-y-4 pr-0 md:pr-12">
          <div>
            <span className="font-serif text-2xl tracking-widest font-black text-white">HOS</span>
            <p className="text-[8px] tracking-[0.3em] uppercase text-white font-bold mt-1">HOUSE OF SIMONS</p>
            <p className="text-xs text-white/60 mt-4 leading-relaxed font-light">
              Crafting contemporary luxury silhouettes designed for women who define their own style. Effortless elegance, uncompromising quality.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 pt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.519 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.869.508 9.388.508 9.388.508s7.519 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white hover:scale-110 transition-all duration-300"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.715-.359-1.774c0-1.66 1.05-2.9 2.185-2.9 1.03 0 1.526.772 1.526 1.696 0 1.035-.659 2.585-.999 4.02-.284 1.201.599 2.181 1.785 2.181 2.143 0 3.793-2.259 3.793-5.517 0-2.887-2.074-4.907-5.041-4.907-3.437 0-5.457 2.578-5.457 5.244 0 1.037.399 2.152.899 2.758.1.12.115.228.084.349-.092.386-.298 1.21-.338 1.378-.053.224-.175.27-.404.164-1.51-.703-2.454-2.914-2.454-4.685 0-3.816 2.774-7.324 7.994-7.324 4.197 0 7.458 2.99 7.458 6.993 0 4.17-2.628 7.525-6.277 7.525-1.226 0-2.378-.637-2.772-1.388l-.756 2.88c-.274 1.054-.997 2.37-1.488 3.167 1.12.345 2.302.533 3.527.533 6.622 0 11.989-5.367 11.989-11.991C24 5.367 18.634 0 12.017 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column 1: Shop */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-white font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li><Link to="/shop?collection=new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop?category=Dresses" className="hover:text-white transition-colors">Dresses</Link></li>
            <li><Link to="/shop?category=Tops" className="hover:text-white transition-colors">Tops</Link></li>
            <li><Link to="/shop?category=Co-ords" className="hover:text-white transition-colors">Co-ords</Link></li>
            <li><Link to="/shop?category=Jackets" className="hover:text-white transition-colors">Jackets</Link></li>
            <li><Link to="/shop?discount=true" className="text-red-400 hover:text-red-300 transition-colors">Sale</Link></li>
          </ul>
        </div>

        {/* Links Column 2: Help */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-white font-semibold mb-4">Help & Services</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li><Link to="/about?tab=sizing" className="hover:text-white transition-colors">Sizing Guide</Link></li>
            <li><Link to="/about?tab=returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><a href="mailto:online@houseofsimons.com" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><Link to="/questions" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><a href="#track" className="hover:text-white transition-colors">Track Order</a></li>
          </ul>
        </div>

        {/* Links Column 3: About */}
        <div>
          <h4 className="text-xs uppercase tracking-luxury text-white font-semibold mb-4">About</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li><Link to="/about?tab=story" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/about?tab=sizing" className="hover:text-white transition-colors">Sizing Formula</Link></li>
            <li><Link to="/about?tab=returns" className="hover:text-white transition-colors">Exchange Policy</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Collections</Link></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 space-y-4 md:space-y-0">
        <div>
          © 2026 HOS — HOUSE OF SIMONS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-6">
          <Link to="/about?tab=sizing" className="hover:text-white transition-colors">Sizing Policy</Link>
          <Link to="/about?tab=returns" className="hover:text-white transition-colors">Return & Exchange Policy</Link>
          <a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a>
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
