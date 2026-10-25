import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import api from '../utils/api.js';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products?search=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-luxury-ivory/95 backdrop-blur-md z-50 flex flex-col pt-24 px-6 md:px-24">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 text-luxury-charcoal/70 hover:text-luxury-charcoal hover:scale-105 transition-all duration-300"
        aria-label="Close search"
      >
        <X strokeWidth={1} size={32} />
      </button>

      {/* Input */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl mx-auto border-b border-luxury-charcoal/10 pb-4 flex items-center">
        <Search strokeWidth={1} className="text-luxury-charcoal/60 mr-4" size={28} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dresses, collections, styles..."
          className="bg-transparent w-full text-2xl md:text-4xl font-serif tracking-wide focus:outline-none placeholder:text-luxury-charcoal/30 text-luxury-charcoal font-light"
        />
      </form>

      {/* Live Results Panel */}
      <div className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto mt-8 pb-12 no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-t-2 border-luxury-champagne rounded-full animate-spin"></div>
          </div>
        ) : query.trim() && results.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-lg text-luxury-charcoal/60">No results found for "{query}"</p>
            <p className="text-xs text-luxury-muted mt-2">Try searching for "dress", "co-ord", or "jacket"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Products Column */}
            {results.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-luxury text-luxury-muted border-b border-luxury-charcoal/5 pb-2 mb-4 font-semibold">Products</h3>
                <div className="space-y-4">
                  {results.slice(0, 5).map((product) => {
                    const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
                    return (
                      <Link 
                        key={product._id} 
                        to={`/products/${product.slug}`} 
                        onClick={onClose}
                        className="flex items-center space-x-4 p-2 hover:bg-luxury-beige/40 transition-colors duration-300 rounded"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-16 h-20 object-cover bg-luxury-beige" 
                        />
                        <div>
                          <p className="font-serif text-sm text-luxury-charcoal">{product.name}</p>
                          <p className="text-xs text-luxury-muted mt-1">{product.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
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
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggestions Column */}
            {query.trim() && (
              <div>
                <h3 className="text-xs uppercase tracking-luxury text-luxury-muted border-b border-luxury-charcoal/5 pb-2 mb-4 font-semibold">Suggested Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Dresses', 'Co-ords', 'Jackets', 'Gowns', 'Tops'].filter(cat => 
                    cat.toLowerCase().includes(query.toLowerCase())
                  ).map(cat => (
                    <Link
                      key={cat}
                      to={`/shop?category=${cat}`}
                      onClick={onClose}
                      className="px-4 py-2 border border-luxury-charcoal/10 hover:border-luxury-charcoal text-xs uppercase tracking-luxury transition-colors duration-300 text-luxury-charcoal"
                    >
                      {cat}
                    </Link>
                  ))}
                  
                  {['New Season', 'Evening', 'Resort', 'Vacation', 'Workwear'].filter(col => 
                    col.toLowerCase().includes(query.toLowerCase())
                  ).map(col => (
                    <Link
                      key={col}
                      to={`/shop?collection=${col.toLowerCase().replace(' ', '-')}`}
                      onClick={onClose}
                      className="px-4 py-2 border border-luxury-charcoal/10 hover:border-luxury-charcoal text-xs uppercase tracking-luxury transition-colors duration-300 text-luxury-charcoal"
                    >
                      {col} Collection
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
