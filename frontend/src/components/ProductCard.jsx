import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const isFav = isInWishlist(product._id);
  const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors[0], 1);
    setShowSizes(false);
  };

  return (
    <div 
      className="group relative flex flex-col font-sans bg-luxury-ivory"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizes(false);
      }}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-luxury-beige rounded-sm">
        <Link to={`/products/${product.slug}`}>
          <img
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {product.discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-700 text-luxury-ivory text-[8px] tracking-widest font-semibold px-2 py-1 uppercase rounded-sm">
            {product.discount}% OFF
          </span>
        )}
        {product.newArrival && !product.discount && (
          <span className="absolute top-4 left-4 bg-luxury-champagne text-luxury-charcoal text-[8px] tracking-widest font-semibold px-2 py-1 uppercase rounded-sm">
            NEW
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-luxury-charcoal p-2 rounded-full backdrop-blur-sm shadow-sm hover:scale-110 transition-all duration-300"
          aria-label="Add to wishlist"
        >
          <Heart 
            size={16} 
            strokeWidth={1.5}
            className={isFav ? "fill-red-700 text-red-700" : "text-luxury-charcoal"} 
          />
        </button>

        {/* Hover Utility overlay */}
        <div className="absolute inset-x-0 bottom-4 px-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/90 hover:bg-white text-luxury-charcoal text-[10px] uppercase tracking-luxury py-2.5 flex items-center justify-center space-x-2 border border-luxury-charcoal/5 shadow-sm backdrop-blur-sm transition-colors rounded-sm"
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>

          {/* Quick Add Button */}
          <div className="relative">
            <button
              onClick={handleQuickAddClick}
              disabled={!product.sizes?.length}
              className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury py-2.5 flex items-center justify-center space-x-2 shadow-sm transition-colors rounded-sm"
            >
              <ShoppingBag size={12} />
              <span>{product.sizes?.length ? 'Quick Add' : 'Size details pending'}</span>
            </button>

            {/* Quick Size Select dropdown */}
            {showSizes && (
              <div className="absolute bottom-full left-0 w-full bg-white border border-luxury-charcoal/10 p-3 shadow-xl z-20 mb-2 rounded-sm fade-in-up">
                <p className="text-[9px] uppercase tracking-luxury text-luxury-muted text-center mb-2 font-medium">
                  Select Size
                </p>
                <div className="flex justify-center flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSelectSize(e, size)}
                      className="border border-luxury-charcoal/10 hover:border-luxury-charcoal text-[9px] w-7 h-7 flex items-center justify-center font-medium transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info details */}
      <div className="pt-4 pb-2 flex flex-col flex-1">
        <Link to={`/products/${product.slug}`} className="hover:text-luxury-champagne transition-colors">
          <h3 className="font-serif text-sm font-medium tracking-wide text-luxury-charcoal truncate">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[10px] text-luxury-muted mt-1 uppercase tracking-widest">
          {product.category}
        </p>

        <div className="flex items-center space-x-2.5 mt-2">
          {product.discount > 0 ? (
            <>
              <span className="text-xs font-semibold text-luxury-charcoal">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-luxury-muted line-through font-light">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold text-luxury-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Colors dots / labels */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1.5 mt-2.5">
            {product.colors.map(col => (
              <span 
                key={col} 
                className="text-[9px] text-luxury-muted border border-luxury-charcoal/5 px-1.5 py-0.5 rounded-sm capitalize bg-luxury-beige/30"
              >
                {col}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
