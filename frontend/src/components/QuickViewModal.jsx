import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Warm Ivory');
  const [qty, setQty] = useState(1);

  const isFav = isInWishlist(product._id);
  const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

  const handleAdd = () => {
    if (!product.sizes?.length || product.inventory === 0) return;
    addToCart(product, selectedSize, selectedColor, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content Card */}
      <div className="relative bg-luxury-ivory w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 shadow-2xl border border-luxury-charcoal/5 z-10 rounded-sm overflow-y-auto max-h-[90vh] md:max-h-none">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-luxury-charcoal/70 hover:text-luxury-charcoal z-20"
          aria-label="Close details"
        >
          <X strokeWidth={1} size={26} />
        </button>

        {/* Left Side: Product Image Carousel / Display */}
        <div className="space-y-4 pr-0 md:pr-6">
          <div className="aspect-[4/5] w-full overflow-hidden bg-luxury-beige rounded-sm">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {product.images.slice(0, 2).map((img, idx) => (
              <div key={idx} className="aspect-[4/5] overflow-hidden bg-luxury-beige rounded-sm">
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="flex flex-col justify-between pt-6 md:pt-0 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-luxury-charcoal/5">
          <div>
            <span className="text-[10px] text-luxury-muted uppercase tracking-widest">{product.category}</span>
            <h2 className="font-serif text-xl md:text-2xl font-medium tracking-wide text-luxury-charcoal mt-1">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center space-x-3 mt-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-lg font-semibold text-luxury-charcoal">₹{discountedPrice.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-luxury-muted line-through">₹{product.price.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-luxury-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-xs text-luxury-muted mt-4 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
                Color: {selectedColor}
              </label>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border text-xs tracking-wide rounded-sm transition-colors uppercase ${selectedColor === color
                        ? 'border-luxury-charcoal bg-luxury-charcoal text-luxury-ivory font-medium'
                        : 'border-luxury-charcoal/10 hover:border-luxury-charcoal text-luxury-charcoal bg-white'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold">
                  Size: {selectedSize || 'Not listed'}
                </label>
              </div>
              <div className="flex space-x-2">
                {(product.sizes || []).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 border text-xs font-medium rounded-sm flex items-center justify-center transition-all ${selectedSize === size
                        ? 'border-luxury-charcoal bg-luxury-charcoal text-luxury-ivory'
                        : 'border-luxury-charcoal/10 hover:border-luxury-charcoal text-luxury-charcoal bg-white'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-light leading-relaxed text-luxury-muted">
                {product.sizeDescription || 'Sizes are assigned for this style using the House of Simons sizing formula. Please check the measurement guide and email us for garment-specific measurement help before ordering.'}
              </p>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-8 pt-6 border-t border-luxury-charcoal/5 space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleAdd}
                disabled={!product.sizes?.length || product.inventory === 0}
                className="flex-1 bg-luxury-charcoal hover:bg-luxury-champagne text-luxury-ivory text-xs uppercase tracking-luxury py-3.5 transition-colors font-medium rounded-sm"
              >
                {product.sizes?.length ? 'Add to Bag' : 'Size details pending'}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="border border-luxury-charcoal/10 hover:border-luxury-charcoal p-3.5 rounded-sm transition-all"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={16}
                  className={isFav ? "fill-red-700 text-red-700" : "text-luxury-charcoal"}
                />
              </button>
            </div>

            {/* WhatsApp Inquiry */}
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello HOS, I am interested in the ${product.name} (SKU: ${product.sku || 'not listed'}) in Size: ${selectedSize || 'not listed'}. Please confirm availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-green-700 hover:bg-green-700/5 text-green-700 text-[10px] uppercase tracking-luxury py-3 transition-colors font-semibold rounded-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.489 0 9.95-4.43 9.954-9.885.002-2.643-1.013-5.124-2.87-6.986-1.855-1.859-4.325-2.88-6.967-2.881-5.461 0-9.92 4.433-9.925 9.886-.002 1.777.495 3.51 1.44 5.033l-.95 3.477 3.598-.944zm11.002-7.729c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span>INQUIRE VIA WHATSAPP</span>
            </a>

            <Link
              to={`/products/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-charcoal transition-colors font-semibold"
            >
              View Full Product Details
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
