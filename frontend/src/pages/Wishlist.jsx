import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Track which product is opening size select dropdown
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleQuickAdd = (product, size) => {
    addToCart(product, size, product.colors[0], 1);
    removeFromWishlist(product._id);
    setSelectedProductId(null);
  };

  return (
    <div className="bg-atelier-peach/60 min-h-screen font-sans py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold">
            My Gallery
          </span>
          <h1 className="font-serif text-2xl md:text-4xl uppercase tracking-wider text-luxury-charcoal mt-2 font-light">
            YOUR WISHLIST
          </h1>
          <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury max-w-sm mx-auto font-light leading-relaxed">
            Saved silhouettes for future styling.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-luxury-charcoal/5 rounded-sm max-w-2xl mx-auto shadow-xs">
            <p className="font-serif text-lg text-luxury-charcoal/50">Your wishlist is empty.</p>
            <p className="text-xs text-luxury-muted mt-2 uppercase tracking-wide">Save creations while browsing the catalog.</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-8 bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-8 py-3.5 transition-colors duration-300 font-semibold rounded-sm"
            >
              BROWSE CATALOG
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
              return (
                <div key={product._id} className="group relative bg-white border border-luxury-charcoal/5 p-3 rounded-sm flex flex-col justify-between">

                  {/* Image Frame */}
                  <div className="aspect-[4/5] overflow-hidden bg-luxury-beige rounded-sm relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                      onClick={() => navigate(`/products/${product.slug}`)}
                    />

                    {/* Delete Icon */}
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-luxury-charcoal p-2 rounded-full shadow-xs hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Info details */}
                  <div className="pt-4 flex flex-col flex-1">
                    <h3 className="font-serif text-sm font-medium tracking-wide text-luxury-charcoal truncate">
                      {product.name}
                    </h3>

                    <p className="text-[10px] text-luxury-muted mt-1 uppercase tracking-widest">
                      {product.category}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-xs font-semibold text-luxury-charcoal">₹{discountedPrice.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-luxury-muted line-through">₹{product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-luxury-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Add Tray */}
                  <div className="mt-4 pt-3 border-t border-luxury-charcoal/5 relative">
                    {!product.sizes?.length ? (
                      <button
                        disabled
                        className="w-full bg-luxury-charcoal/50 text-white text-[10px] uppercase tracking-luxury py-2.5 flex items-center justify-center space-x-2 rounded-sm cursor-not-allowed"
                      >
                        <ShoppingBag size={12} />
                        <span>Size details pending</span>
                      </button>
                    ) : selectedProductId === product._id ? (
                      <div className="bg-luxury-beige/35 p-2 rounded-sm text-center">
                        <p className="text-[8px] uppercase tracking-luxury text-luxury-muted mb-2 font-medium">Select Size</p>
                        <div className="flex justify-center gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleQuickAdd(product, size)}
                              className="border border-luxury-charcoal/10 bg-white hover:border-luxury-charcoal text-[9px] w-7 h-7 flex items-center justify-center font-semibold transition-colors"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setSelectedProductId(null)}
                          className="text-[8px] uppercase tracking-luxury text-luxury-charcoal/60 mt-2 block mx-auto underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedProductId(product._id)}
                        className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury py-2.5 flex items-center justify-center space-x-2 transition-colors rounded-sm"
                      >
                        <ShoppingBag size={12} />
                        <span>Move to Bag</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
