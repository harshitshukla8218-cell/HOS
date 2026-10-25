import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import MegaMenu from './MegaMenu.jsx';
import MobileMenu from './MobileMenu.jsx';
import SearchOverlay from './SearchOverlay.jsx';

export default function Header() {
  const { cartItems, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleNavHover = (tabName) => {
    if (['SHOP', 'COLLECTIONS', 'OCCASION EDIT'].includes(tabName)) {
      setActiveTab(tabName);
    } else {
      setActiveTab(null);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 bg-luxury-ivory/80 backdrop-blur-md z-40 border-b border-luxury-charcoal/5 transition-all duration-300 font-sans">

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 grid grid-cols-3 items-center">

          {/* LEFT SECTION (Search & Menu Toggles & Social Icons) */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Hamburger on Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-luxury-charcoal hover:scale-105 transition-transform"
              aria-label="Open navigation menu"
            >
              <Menu strokeWidth={1.5} size={24} />
            </button>

            {/* Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-luxury-charcoal hover:scale-105 transition-transform flex items-center space-x-2 flex-none"
              aria-label="Open search search window"
            >
              <Search strokeWidth={1.2} size={20} />
              <span className="hidden md:inline text-xs uppercase tracking-luxury text-luxury-charcoal/60">Search</span>
            </button>

            {/* Header Social Icons */}
            <div className="hidden lg:flex items-center space-x-3 border-l border-luxury-charcoal/10 pl-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-luxury-charcoal/60 hover:text-luxury-champagne hover:scale-115 transition-all duration-300" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-luxury-charcoal/60 hover:text-luxury-champagne hover:scale-115 transition-all duration-300" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-luxury-charcoal/60 hover:text-luxury-champagne hover:scale-115 transition-all duration-300" aria-label="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.519 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.869.508 9.388.508 9.388.508s7.519 0 9.388-.508a3.002 3.002 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-luxury-charcoal/60 hover:text-luxury-champagne hover:scale-115 transition-all duration-300" aria-label="Pinterest">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.715-.359-1.774c0-1.66 1.05-2.9 2.185-2.9 1.03 0 1.526.772 1.526 1.696 0 1.035-.659 2.585-.999 4.02-.284 1.201.599 2.181 1.785 2.181 2.143 0 3.793-2.259 3.793-5.517 0-2.887-2.074-4.907-5.041-4.907-3.437 0-5.457 2.578-5.457 5.244 0 1.037.399 2.152.899 2.758.1.12.115.228.084.349-.092.386-.298 1.21-.338 1.378-.053.224-.175.27-.404.164-1.51-.703-2.454-2.914-2.454-4.685 0-3.816 2.774-7.324 7.994-7.324 4.197 0 7.458 2.99 7.458 6.993 0 4.17-2.628 7.525-6.277 7.525-1.226 0-2.378-.637-2.772-1.388l-.756 2.88c-.274 1.054-.997 2.37-1.488 3.167 1.12.345 2.302.533 3.527.533 6.622 0 11.989-5.367 11.989-11.991C24 5.367 18.634 0 12.017 0z" /></svg>
              </a>
            </div>
          </div>

          {/* CENTER SECTION (Centered Brand Logo - Large and Bold) */}
          <div className="text-center flex flex-col items-center justify-center cursor-pointer" onClick={handleLogoClick}>
            <span className="font-serif text-3xl sm:text-4.5xl md:text-5.5xl lg:text-6.5xl tracking-[0.18em] font-extrabold text-luxury-charcoal leading-none uppercase">
              HOS
            </span>
            <span className="font-sans text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] tracking-[0.42em] uppercase text-luxury-champagne font-black mt-1.5">
              HOUSE OF SIMONS
            </span>
          </div>

          {/* RIGHT SECTION (Bag, Account, Wishlist) */}
          <div className="flex items-center justify-end space-x-3 md:space-x-5">
            {/* User Account */}
            <Link
              to="/account"
              className="text-luxury-charcoal hover:scale-105 transition-transform hidden md:flex items-center space-x-1"
              aria-label="Go to customer profile"
            >
              <User strokeWidth={1.2} size={20} />
              <span className="text-xs uppercase tracking-luxury text-luxury-charcoal/60">
                {user ? user.name.split(' ')[0] : 'Account'}
              </span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-luxury-charcoal hover:scale-105 transition-transform flex items-center"
              aria-label="Go to saved wishlist"
            >
              <Heart strokeWidth={1.2} size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-luxury-champagne text-white text-[8px] font-sans w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-luxury-charcoal hover:scale-105 transition-transform flex items-center"
              aria-label="Open shopping bag drawer"
            >
              <ShoppingBag strokeWidth={1.2} size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-luxury-charcoal text-luxury-ivory text-[8px] font-sans w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Link Row */}
        <div
          className="hidden md:flex justify-center border-t border-luxury-charcoal/5 py-1.5 relative"
          onMouseLeave={() => setActiveTab(null)}
        >
          <nav className="flex space-x-8 text-[11px] uppercase tracking-widest font-medium text-luxury-charcoal/80">
            <Link
              to="/shop?collection=new-arrivals"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('NEW ARRIVALS')}
            >
              New Arrivals
            </Link>

            <Link
              to="/shop"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('SHOP')}
            >
              Shop
            </Link>

            <Link
              to="/shop?category=Dresses"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('DRESSES')}
            >
              Dresses
            </Link>

            <Link
              to="/shop?category=Tops"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('TOPS')}
            >
              Tops
            </Link>

            <Link
              to="/shop?category=Trousers"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('BOTTOMS')}
            >
              Bottoms
            </Link>

            <Link
              to="/shop"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('COLLECTIONS')}
            >
              Collections
            </Link>

            <Link
              to="/shop"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('OCCASION EDIT')}
            >
              Occasion Edit
            </Link>

            <Link
              to="/shop?collection=limited-edition"
              className="hover:text-luxury-champagne transition-colors py-1"
              onMouseEnter={() => handleNavHover('CELEBRITY EDIT')}
            >
              Celebrity Edit
            </Link>

            <Link
              to="/shop?discount=true"
              className="text-red-800 hover:text-red-600 transition-colors py-1 font-semibold"
              onMouseEnter={() => handleNavHover('SALE')}
            >
              Sale
            </Link>
          </nav>

          {/* MegaMenu Dropdown */}
          <MegaMenu activeTab={activeTab} onClose={() => setActiveTab(null)} />
        </div>
      </header>

      {/* Side menus & search window */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
