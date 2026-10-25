import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Grid, SlidersHorizontal } from 'lucide-react';
import api from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Active filters from URL query parameters
  const currentCategory = searchParams.get('category') || '';
  const currentCollection = searchParams.get('collection') || '';
  const currentOccasion = searchParams.get('occasion') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentDiscount = searchParams.get('discount') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';

  // Available filters configuration
  const categoriesList = ['Dresses', 'Tops', 'Co-ords', 'Jackets', 'Trousers', 'Skirts', 'Gowns'];
  const sizesList = ['XS', 'S', 'M', 'L', 'XL'];
  const colorsList = ['Warm Ivory', 'Charcoal', 'Sage Beige', 'Terracotta', 'Off White', 'Camel Beige', 'Emerald', 'Onyx Black', 'Sky Blue', 'Champagne Gold'];

  const priceRanges = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under ₹10,000', min: '0', max: '10000' },
    { label: '₹10,000 – ₹20,000', min: '10000', max: '20000' },
    { label: '₹20,000 – ₹30,000', min: '20000', max: '30000' },
    { label: '₹30,000+', min: '30000', max: '' },
  ];

  // Fetch products matching parameters
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (currentCategory) query.append('category', currentCategory);
        if (currentCollection) query.append('collection', currentCollection);
        if (currentOccasion) query.append('occasion', currentOccasion);
        if (currentSize) query.append('size', currentSize);
        if (currentColor) query.append('color', currentColor);
        if (currentMinPrice) query.append('minPrice', currentMinPrice);
        if (currentMaxPrice) query.append('maxPrice', currentMaxPrice);
        if (currentDiscount) query.append('discount', currentDiscount);
        if (currentSearch) query.append('search', currentSearch);
        if (currentSort) query.append('sort', currentSort);

        const data = await api.get(`/products?${query.toString()}`);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredProducts();
  }, [
    searchParams,
    currentCategory,
    currentCollection,
    currentOccasion,
    currentSize,
    currentColor,
    currentMinPrice,
    currentMaxPrice,
    currentDiscount,
    currentSearch,
    currentSort
  ]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Maintain page position
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setShowMobileFilters(false);
  };

  const getCollectionTitle = () => {
    if (currentCategory) return currentCategory;
    if (currentCollection) {
      return currentCollection.replace('-', ' ') + ' Collection';
    }
    if (currentOccasion) {
      return currentOccasion.replace('-', ' ') + ' Edit';
    }
    if (currentSearch) {
      return `Search: "${currentSearch}"`;
    }
    if (currentDiscount === 'true') {
      return "The HOS Sale";
    }
    return 'All Creations';
  };

  // Helper to check if a specific price range is active
  const isPriceActive = (range) => {
    return currentMinPrice === range.min && currentMaxPrice === range.max;
  };

  return (
    <div className="bg-atelier-sage/50 min-h-screen font-sans">

      {/* Page Header */}
      <div className="bg-atelier-peach border-b border-luxury-charcoal/5 py-12 md:py-16 text-center px-4">
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold">
          House of Simons
        </span>
        <h1 className="font-serif text-2xl md:text-4xl uppercase tracking-wider text-luxury-charcoal mt-2 font-light">
          {getCollectionTitle()}
        </h1>
        <p className="text-[10px] text-luxury-muted mt-2 uppercase tracking-luxury max-w-md mx-auto leading-relaxed">
          Contemporary silhouettes designed for luxury presence and confidence.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex">

        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="w-64 flex-none pr-8 hidden lg:block border-r border-luxury-charcoal/5">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-luxury-charcoal/10">
            <span className="text-xs uppercase tracking-luxury font-semibold text-luxury-charcoal">Filters</span>
            <button onClick={clearAllFilters} className="text-[10px] uppercase tracking-luxury text-luxury-muted hover:text-luxury-charcoal">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Category</h4>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilter('category', currentCategory === cat ? '' : cat)}
                  className={`block text-xs text-left w-full transition-colors ${currentCategory === cat ? 'text-luxury-champagne font-semibold' : 'text-luxury-muted hover:text-luxury-charcoal'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilter('size', currentSize === size ? '' : size)}
                  className={`border text-[10px] font-medium w-8 h-8 flex items-center justify-center rounded-sm transition-all ${currentSize === size
                    ? 'border-luxury-charcoal bg-luxury-charcoal text-white'
                    : 'border-luxury-charcoal/10 hover:border-luxury-charcoal bg-white text-luxury-charcoal'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (range.min) params.set('minPrice', range.min); else params.delete('minPrice');
                    if (range.max) params.set('maxPrice', range.max); else params.delete('maxPrice');
                    setSearchParams(params);
                  }}
                  className={`block text-xs text-left w-full transition-colors ${isPriceActive(range) ? 'text-luxury-champagne font-semibold' : 'text-luxury-muted hover:text-luxury-charcoal'
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Color</h4>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((col) => (
                <button
                  key={col}
                  onClick={() => updateFilter('color', currentColor === col ? '' : col)}
                  className={`px-2 py-1 border text-[9px] uppercase tracking-wider rounded-sm transition-all ${currentColor === col
                    ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-medium'
                    : 'border-luxury-charcoal/10 hover:border-luxury-charcoal bg-white text-luxury-charcoal'
                    }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Sale Toggle */}
          <div className="mb-8">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-luxury-charcoal uppercase tracking-luxury">
              <input
                type="checkbox"
                checked={currentDiscount === 'true'}
                onChange={(e) => updateFilter('discount', e.target.checked ? 'true' : '')}
                className="w-4 h-4 border-luxury-charcoal/20 focus:ring-luxury-champagne rounded"
              />
              <span className="font-semibold text-red-700">Sale & Discounts</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="min-w-0 flex-1 pl-0 lg:pl-8">

          {/* Top Controls Row */}
          <div className="flex flex-wrap justify-between items-center gap-y-3 mb-8 pb-4 border-b border-luxury-charcoal/5">
            <div className="text-xs text-luxury-muted uppercase tracking-luxury">
              {products.length} {products.length === 1 ? 'Creation' : 'Creations'}
            </div>

            {/* Filter Toggle on Mobile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden text-xs uppercase tracking-luxury text-luxury-charcoal flex items-center space-x-1.5 border border-luxury-charcoal/15 px-3 py-1.5 bg-white rounded-sm"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              {/* Sorting selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-luxury-muted uppercase tracking-luxury hidden md:inline">Sort:</span>
                <select
                  value={currentSort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-transparent border-none text-luxury-charcoal font-semibold uppercase tracking-luxury text-[11px] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Catalog Grid (4 cols desktop, 3 tablet, 2 mobile) */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="aspect-[4/5] bg-luxury-beige rounded-sm"></div>
                  <div className="h-4 bg-luxury-beige w-2/3"></div>
                  <div className="h-4 bg-luxury-beige w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-luxury-charcoal/5 rounded-sm">
              <p className="font-serif text-lg text-luxury-charcoal/50">No products found matching filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-6 bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-6 py-3 transition-colors duration-300 rounded-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-luxury-ivory h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-luxury-charcoal/10">
              <span className="text-xs uppercase tracking-luxury font-semibold text-luxury-charcoal">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="text-luxury-charcoal">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', currentCategory === cat ? '' : cat)}
                    className={`px-3 py-1.5 border text-xs tracking-wide rounded-sm transition-colors ${currentCategory === cat ? 'bg-luxury-charcoal text-white' : 'border-luxury-charcoal/10 bg-white text-luxury-charcoal'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Size</h4>
              <div className="flex gap-2">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFilter('size', currentSize === size ? '' : size)}
                    className={`border text-xs font-semibold w-8 h-8 flex items-center justify-center rounded-sm ${currentSize === size ? 'bg-luxury-charcoal text-white' : 'border-luxury-charcoal/10 bg-white'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Prices */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (range.min) params.set('minPrice', range.min); else params.delete('minPrice');
                      if (range.max) params.set('maxPrice', range.max); else params.delete('maxPrice');
                      setSearchParams(params);
                    }}
                    className={`block text-xs text-left w-full py-1.5 transition-colors ${isPriceActive(range) ? 'text-luxury-champagne font-semibold' : 'text-luxury-muted'
                      }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-luxury-charcoal uppercase tracking-luxury">
                <input
                  type="checkbox"
                  checked={currentDiscount === 'true'}
                  onChange={(e) => updateFilter('discount', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 border-luxury-charcoal/20 focus:ring-luxury-champagne rounded"
                />
                <span className="font-semibold text-red-700">Sale & Discounts</span>
              </label>
            </div>

            <div className="mt-auto space-y-3">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-luxury-charcoal text-white text-xs uppercase tracking-luxury py-3 font-semibold rounded-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full border border-luxury-charcoal text-luxury-charcoal text-xs uppercase tracking-luxury py-3 font-semibold rounded-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
