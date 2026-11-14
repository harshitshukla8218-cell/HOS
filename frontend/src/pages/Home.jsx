import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [allProducts, setAllProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'embroidered', 'printed'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEmbroidered = (p) => {
    return p.collections?.some((c) => c.toLowerCase().includes('embroid'));
  };

  const isPrint = (p) => {
    return p.collections?.some((c) => c.toLowerCase().includes('print'));
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get('/products');
        setAllProducts(data);
        const selling = data.filter(p => p.bestseller);
        setBestsellers(selling);
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const getDisplayedArrivals = () => {
    const arrivals = allProducts.filter(p => p.newArrival);
    if (activeTab === 'embroidered') {
      return arrivals.filter(isEmbroidered).slice(0, 4);
    }
    if (activeTab === 'printed') {
      return arrivals.filter(p => !isEmbroidered(p) && isPrint(p)).slice(0, 4);
    }
    return arrivals.slice(0, 4);
  };

  const displayedArrivals = getDisplayedArrivals();

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
          <div className="text-center mb-10">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold">
              Discover HOS
            </span>
            <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-widest mt-2">
              JUST IN
            </h2>
            <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury max-w-sm mx-auto font-light">
              The latest pieces from House of Simons.
            </p>

            {/* Section Filter Tabs */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 text-xs uppercase tracking-luxury rounded-sm transition-all font-medium ${
                  activeTab === 'all'
                    ? 'bg-luxury-charcoal text-white shadow-xs'
                    : 'bg-white/80 border border-luxury-charcoal/10 text-luxury-charcoal hover:bg-white'
                }`}
              >
                All Creations
              </button>
              <button
                onClick={() => setActiveTab('embroidered')}
                className={`px-4 py-1.5 text-xs uppercase tracking-luxury rounded-sm transition-all font-medium ${
                  activeTab === 'embroidered'
                    ? 'bg-luxury-charcoal text-white shadow-xs'
                    : 'bg-white/80 border border-luxury-charcoal/10 text-luxury-charcoal hover:bg-white'
                }`}
              >
                Embroidered Section
              </button>
              <button
                onClick={() => setActiveTab('printed')}
                className={`px-4 py-1.5 text-xs uppercase tracking-luxury rounded-sm transition-all font-medium ${
                  activeTab === 'printed'
                    ? 'bg-luxury-charcoal text-white shadow-xs'
                    : 'bg-white/80 border border-luxury-charcoal/10 text-luxury-charcoal hover:bg-white'
                }`}
              >
                Printed Section
              </button>
            </div>
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
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayedArrivals.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>

              {/* View Section in Shop CTA */}
              <div className="text-center mt-12">
                <Link
                  to={
                    activeTab === 'embroidered'
                      ? '/shop?collection=embroidery-collection'
                      : activeTab === 'printed'
                      ? '/shop?collection=print-collection'
                      : '/shop'
                  }
                  className="inline-block bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-8 py-3.5 transition-colors duration-300 rounded-sm font-semibold"
                >
                  {activeTab === 'embroidered'
                    ? 'Explore Full Embroidered Collection &rarr;'
                    : activeTab === 'printed'
                    ? 'Explore Full Print Collection &rarr;'
                    : 'Explore All Creations &rarr;'}
                </Link>
              </div>
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
