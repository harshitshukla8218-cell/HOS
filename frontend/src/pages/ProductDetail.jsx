import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star, ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import api from '../utils/api.js';
import SizeGuideModal from '../components/SizeGuideModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductAccordion from '../components/ProductAccordion.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Custom Zoom State
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // User Options State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  // Modals State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form State
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const data = await api.get(`/products/${slug}`);
        setProduct(data);
        setReviews(data.reviews || []);

        // Auto-select initial options
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        else setSelectedSize('');
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        setActiveImageIdx(0);

        // Fetch related products (same category)
        const catalog = await api.get(`/products?category=${data.category}`);
        setRelatedProducts(catalog.filter(p => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-t-2 border-luxury-champagne rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-serif text-lg">
        Product not found or has been moved.
      </div>
    );
  }

  const isFav = isInWishlist(product._id);
  const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
  const canAddToBag = Boolean(product.sizes?.length) && product.inventory > 0;

  const handleAddToCart = () => {
    if (!canAddToBag) return;
    addToCart(product, selectedSize, selectedColor, qty);
  };

  const handleBuyNow = () => {
    if (!canAddToBag) return;
    addToCart(product, selectedSize, selectedColor, qty);
    navigate('/checkout');
  };

  // High-end image zoom calculation
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[activeImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    setSubmittingReview(true);
    try {
      const newReview = await api.post(`/products/${slug}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        text: reviewText,
        customerName: reviewName
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewName('');
      setReviewTitle('');
      setReviewText('');
      setReviewRating(5);
      alert('Thank you! Your review has been submitted.');
    } catch (err) {
      console.error('Failed submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-atelier-seafoam/50 min-h-screen font-sans pb-20">

      {/* Detail Block Wrapper */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">

        {/* LEFT PANEL: GALLERY WITH ZOOM VIEW */}
        <div className="space-y-4">

          {/* Main Visual Window */}
          <div
            className="relative aspect-[4/5] bg-luxury-beige rounded-sm overflow-hidden border border-luxury-charcoal/5 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Zoom overlay panel */}
            <div
              className="absolute inset-0 z-10 pointer-events-none hidden md:block bg-no-repeat transition-opacity duration-200"
              style={zoomStyle}
            ></div>

            {/* Flat Image */}
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Thumbnails row */}
          <div className="flex space-x-3 overflow-x-auto no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`flex-none w-20 aspect-[4/5] bg-luxury-beige rounded-sm overflow-hidden border transition-all ${activeImageIdx === idx ? 'border-luxury-charcoal shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL: PRODUCT ATTRIBUTES */}
        <div className="flex flex-col space-y-6">

          {/* Product Identification */}
          <div>
            <span className="text-[10px] text-luxury-muted uppercase tracking-widest font-semibold">{product.category}</span>
            <h1 className="font-serif text-2xl md:text-3.5xl font-medium tracking-wide text-luxury-charcoal mt-1 leading-tight">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-[9px] text-luxury-muted uppercase tracking-luxury mt-1.5">STYLE: {product.sku || 'Not listed'}</p>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-1.5 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.round(product.rating || 0) ? "fill-luxury-champagne text-luxury-champagne" : "text-luxury-charcoal/10"}
                />
              ))}
              <span className="text-[10px] text-luxury-muted font-medium uppercase tracking-wider">
                ({reviews.length} reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-center space-x-3.5 mt-5">
              {product.discount > 0 ? (
                <>
                  <span className="text-xl md:text-2xl font-semibold text-luxury-charcoal">₹{discountedPrice.toLocaleString('en-IN')}</span>
                  <span className="text-sm md:text-base text-luxury-muted line-through font-light">₹{product.price.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className="text-xl md:text-2xl font-semibold text-luxury-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>

          <hr className="border-luxury-charcoal/5" />

          {/* Color Select */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
                Select Color: {selectedColor}
              </label>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 border text-xs tracking-wider rounded-sm transition-colors uppercase ${selectedColor === color
                      ? 'border-luxury-charcoal bg-luxury-charcoal text-luxury-ivory font-medium'
                      : 'border-luxury-charcoal/10 hover:border-luxury-charcoal text-luxury-charcoal bg-white'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Select */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold">
                Select Size: {selectedSize || 'Not listed'}
              </label>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[10px] uppercase tracking-luxury text-luxury-champagne hover:text-luxury-charcoal font-semibold underline"
              >
                Size Guide
              </button>
            </div>

            <div className="flex space-x-2">
              {(product.sizes || []).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-xs font-semibold rounded-sm flex items-center justify-center transition-all ${selectedSize === size
                    ? 'border-luxury-charcoal bg-luxury-charcoal text-luxury-ivory shadow-sm'
                    : 'border-luxury-charcoal/10 hover:border-luxury-charcoal text-luxury-charcoal bg-white'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-3 max-w-xl text-xs font-light leading-relaxed text-luxury-muted">
              {product.sizeDescription || 'Sizes are assigned for this style using the House of Simons sizing formula. Please check the measurement guide and email us for garment-specific measurement help before ordering.'}
            </p>
          </div>

          {/* Quantity Incrementor */}
          <div>
            <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-luxury-charcoal/10 w-28 py-1.5 px-3 bg-white justify-between rounded-sm">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-luxury-charcoal/60 hover:text-luxury-charcoal"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs text-luxury-charcoal font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="text-luxury-charcoal/60 hover:text-luxury-charcoal"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Action buttons Add/Buy/Wish */}
          <div className="pt-4 space-y-3.5">
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!canAddToBag}
                className="flex-1 bg-white hover:bg-luxury-charcoal border border-luxury-charcoal text-luxury-charcoal hover:text-luxury-ivory text-xs uppercase tracking-luxury py-4 transition-all duration-300 font-semibold rounded-sm disabled:opacity-50"
              >
                {product.inventory === 0 ? 'OUT OF STOCK' : product.sizes?.length ? 'ADD TO BAG' : 'SIZE DETAILS PENDING'}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="border border-luxury-charcoal/10 hover:border-luxury-charcoal px-4.5 py-4 rounded-sm transition-all bg-white"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={18}
                  className={isFav ? "fill-red-700 text-red-700" : "text-luxury-charcoal"}
                />
              </button>
            </div>

            {canAddToBag && (
              <button
                onClick={handleBuyNow}
                className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-luxury-ivory text-xs uppercase tracking-luxury py-4 transition-colors font-semibold rounded-sm"
              >
                BUY IT NOW
              </button>
            )}

            {/* WhatsApp Inquiry */}
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello HOS, I am interested in the ${product.name} (Style: ${product.sku || 'not listed'}) in Size: ${selectedSize}. Please confirm availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-green-700 hover:bg-green-700/5 text-green-700 text-[10px] uppercase tracking-luxury py-4 transition-colors font-semibold rounded-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.489 0 9.95-4.43 9.954-9.885.002-2.643-1.013-5.124-2.87-6.986-1.855-1.859-4.325-2.88-6.967-2.881-5.461 0-9.92 4.433-9.925 9.886-.002 1.777.495 3.51 1.44 5.033l-.95 3.477 3.598-.944zm11.002-7.729c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span>INQUIRE VIA WHATSAPP</span>
            </a>
          </div>

          {/* 7-ROW EDITORIAL ACCORDIONS — MATCHING CLIENT SPECIFICATION */}
          <ProductAccordion
            product={product}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />

        </div>
      </div>

      {/* REVIEWS SEGMENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-luxury-charcoal/5 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Review Stats & Write Review Form */}
          <div>
            <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Customer Reviews</h3>

            <div className="flex items-center space-x-2.5 mb-6">
              <span className="text-3xl font-serif text-luxury-charcoal font-semibold">
                {product.rating ? product.rating.toFixed(1) : 'No ratings yet'}
              </span>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(product.rating || 0) ? "fill-luxury-champagne text-luxury-champagne" : "text-luxury-charcoal/10"}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-luxury-muted uppercase tracking-wider mt-1">Based on {reviews.length} reviews</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-luxury-beige/30 p-5 rounded-sm border border-luxury-charcoal/5">
              <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">Share your experience</h4>

              <div>
                <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Your Rating</label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-luxury-champagne focus:outline-none"
                    >
                      <Star size={18} className={star <= reviewRating ? "fill-luxury-champagne" : "text-luxury-charcoal/10"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="NAME"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="REVIEW TITLE (OPTIONAL)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              <div>
                <textarea
                  placeholder="WRITE YOUR REVIEW HERE..."
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury py-2.5 transition-colors font-semibold rounded-sm"
              >
                {submittingReview ? 'Submitting...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          </div>

          {/* Reviews List Panel */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Reviews Log</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-luxury-muted italic">No reviews have been written for this silhouette yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="pb-6 border-b border-luxury-charcoal/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < rev.rating ? "fill-luxury-champagne text-luxury-champagne" : "text-luxury-charcoal/10"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-luxury-muted uppercase tracking-wider font-semibold">
                        {rev.customerName}
                      </span>
                      {rev.verified && (
                        <span className="bg-green-100 text-green-800 text-[8px] tracking-wide font-semibold px-1 rounded-sm flex items-center">
                          <ShieldCheck size={8} className="mr-0.5" /> VERIFIED
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-luxury-muted">
                      {new Date(rev.createdAt || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-luxury-charcoal">{rev.title}</h4>
                  <p className="text-xs text-luxury-muted leading-relaxed font-light">{rev.text}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* RECOMMENDATIONS (You May Also Like) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-luxury-charcoal/5">
          <div className="text-center mb-12">
            <h3 className="font-serif text-xl uppercase tracking-widest text-luxury-charcoal">YOU MAY ALSO LIKE</h3>
            <p className="text-[10px] text-luxury-muted uppercase tracking-luxury mt-2">More silhouettes aligned with this style.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={() => navigate(`/products/${p.slug}`)} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal Overlay */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

    </div>
  );
}
