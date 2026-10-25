import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext.jsx';
import api from '../utils/api.js';
import Hero from '../components/Hero.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import EditorialBanner from '../components/EditorialBanner.jsx';
import OccasionEdit from '../components/OccasionEdit.jsx';
import FeaturedCollection from '../components/FeaturedCollection.jsx';
import BrandStory from '../components/BrandStory.jsx';
import InstagramGrid from '../components/InstagramGrid.jsx';
import Newsletter from '../components/Newsletter.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get('/products');

        // Filter new arrivals & bestsellers
        const arrivals = data.filter(p => p.newArrival).slice(0, 4);
        const selling = data.filter(p => p.bestseller);

        setNewArrivals(arrivals);
        setBestsellers(selling);
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="bg-luxury-ivory font-sans min-h-screen">

      {/* 1. Full-screen Hero */}
      <Hero />

      {/* 2. Shop by Category (The HOS Wardrobe) */}
      <CategoryGrid />

      {/* 3. New Arrivals (Just In) */}
      <section className="py-20 bg-atelier-peach px-4 md:px-8 border-t border-b border-luxury-charcoal/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold">
              Discover HOS
            </span>
            <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest mt-2">
              JUST IN
            </h2>
            <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury max-w-sm mx-auto font-light">
              The latest pieces from House of Simons.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="aspect-[4/5] bg-luxury-beige rounded-sm"></div>
                  <div className="h-4 bg-luxury-beige w-2/3"></div>
                  <div className="h-4 bg-luxury-beige w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Cinematic Editorial Banner */}
      <EditorialBanner />

      {/* 5. Occasion Edit (Dress for the Moment) */}
      <OccasionEdit />

      {/* 6. Featured Collection (The Signature Edit) */}
      <FeaturedCollection />

      {/* 7. Bestsellers (The Most Wanted) */}
      <section className="py-20 bg-atelier-sky px-4 md:px-8 border-t border-b border-luxury-charcoal/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold">
              Most Wanted
            </span>
            <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest mt-2">
              THE MOST WANTED
            </h2>
            <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury max-w-sm mx-auto font-light">
              Explore our best-selling signature designs.
            </p>
          </div>

          {loading ? (
            <div className="flex space-x-6 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-none w-[280px] animate-pulse flex flex-col space-y-4">
                  <div className="aspect-[4/5] bg-luxury-beige rounded-sm"></div>
                  <div className="h-4 bg-luxury-beige w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductCarousel
              products={bestsellers}
              onQuickView={handleQuickView}
            />
          )}
        </div>
      </section>

      {/* 8. Brand Story Heritage Panel */}
      <BrandStory />

      {/* 9. Social Instagram Gallery */}
      <InstagramGrid />

      {/* 10. Inner Circle Membership Form */}
      <Newsletter />

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={handleCloseQuickView}
        />
      )}

    </div>
  );
}
