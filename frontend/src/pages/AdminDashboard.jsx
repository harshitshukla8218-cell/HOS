import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCMS } from '../context/CMSContext.jsx';
import { Package, ClipboardList, Sliders, Ticket, MessageSquare, AlertTriangle, Plus, Trash2, Edit2, Check } from 'lucide-react';
import api from '../utils/api.js';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE', 'ONE SIZE', 'MAX PLUS', 'CUSTOM'];
const DEFAULT_SIZE_DESCRIPTION = 'Sizes are assigned for this style using the House of Simons sizing formula. Please check the measurement guide and email us for garment-specific measurement help before ordering.';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { cmsData, updateCMSData } = useCMS();

  // Access guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans">
        <AlertTriangle size={48} className="text-red-700 mx-auto mb-4" />
        <h1 className="font-serif text-xl uppercase tracking-wider text-luxury-charcoal">Access Denied</h1>
        <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury">
          Administrator privileges are required to view this panel.
        </p>
      </div>
    );
  }

  // Dashboard Tabs: 'products', 'orders', 'coupons', 'reviews', 'cms'
  const [activeTab, setActiveTab] = useState('products');

  // Products Data & Form State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new
  const [showProductForm, setShowProductForm] = useState(false);

  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscount, setProdDiscount] = useState(0);
  const [prodCategory, setProdCategory] = useState('Dresses');
  const [prodSizes, setProdSizes] = useState(['S', 'M', 'L']);
  const [prodSizeDescription, setProdSizeDescription] = useState(DEFAULT_SIZE_DESCRIPTION);
  const [prodColors, setProdColors] = useState(['Warm Ivory']);
  const [prodDescription, setProdDescription] = useState('');
  const [prodDetails, setProdDetails] = useState('');
  const [prodInventory, setProdInventory] = useState(10);
  const [prodSKU, setProdSKU] = useState('');
  const [prodImages, setProdImages] = useState(['', '']);
  const [prodCollections, setProdCollections] = useState(['New Season']);
  const [prodOccasions, setProdOccasions] = useState(['Evening']);
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(true);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(15000);
  const [newCouponExpiry, setNewCouponExpiry] = useState('2027-12-31');
  const [newCouponLimit, setNewCouponLimit] = useState(100);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // CMS Form State
  const [announcement, setAnnouncement] = useState(cmsData.announcement || '');
  const [heroHeading, setHeroHeading] = useState(cmsData.hero?.heading || '');
  const [heroSubheading, setHeroSubheading] = useState(cmsData.hero?.subheading || '');
  const [heroDesktopImg, setHeroDesktopImg] = useState(cmsData.hero?.desktopImage || '');
  const [heroMobileImg, setHeroMobileImg] = useState(cmsData.hero?.mobileImage || '');
  const [bannerHeading, setBannerHeading] = useState(cmsData.editorialBanner?.heading || '');
  const [bannerSubheading, setBannerSubheading] = useState(cmsData.editorialBanner?.subheading || '');
  const [bannerImg, setBannerImg] = useState(cmsData.editorialBanner?.image || '');
  const [featHeading, setFeatHeading] = useState(cmsData.featuredCollection?.heading || '');
  const [featSubheading, setFeatSubheading] = useState(cmsData.featuredCollection?.subheading || '');
  const [featImg, setFeatImg] = useState(cmsData.featuredCollection?.image || '');
  const [storyHeading, setStoryHeading] = useState(cmsData.brandStory?.heading || '');
  const [storyText, setStoryText] = useState(cmsData.brandStory?.text || '');
  const [storyImg, setStoryImg] = useState(cmsData.brandStory?.image || '');

  // Fetch functions
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.get('/orders/admin/all');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const data = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await api.get('/products/admin/reviews');
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'coupons') loadCoupons();
    if (activeTab === 'reviews') loadReviews();
  }, [activeTab]);

  // Product CRUD Handlers
  const handleOpenProductForm = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdPrice(prod.price);
      setProdDiscount(prod.discount || 0);
      setProdCategory(prod.category);
      setProdSizes(prod.sizes || ['S', 'M', 'L']);
      setProdSizeDescription(prod.sizeDescription || DEFAULT_SIZE_DESCRIPTION);
      setProdColors(prod.colors || ['Warm Ivory']);
      setProdDescription(prod.description);
      setProdDetails(prod.details || '');
      setProdInventory(prod.inventory || 10);
      setProdSKU(prod.sku || '');
      setProdImages(prod.images || ['', '']);
      setProdCollections(prod.collections || []);
      setProdOccasions(prod.occasions || []);
      setProdBestseller(prod.bestseller || false);
      setProdNewArrival(prod.newArrival || false);
      setProdFeatured(prod.featured || false);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdPrice(0);
      setProdDiscount(0);
      setProdCategory('Dresses');
      setProdSizes(['S', 'M', 'L']);
      setProdSizeDescription(DEFAULT_SIZE_DESCRIPTION);
      setProdColors(['Warm Ivory']);
      setProdDescription('');
      setProdDetails('');
      setProdInventory(10);
      setProdSKU('');
      setProdImages(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1600', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600']);
      setProdCollections(['New Season']);
      setProdOccasions(['Evening']);
      setProdBestseller(false);
      setProdNewArrival(true);
      setProdFeatured(true);
    }
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (prodSizes.length === 0) {
      alert('Select at least one available size.');
      return;
    }

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      discount: Number(prodDiscount),
      category: prodCategory,
      sizes: prodSizes,
      sizeDescription: prodSizeDescription,
      colors: prodColors,
      description: prodDescription,
      details: prodDetails,
      inventory: Number(prodInventory),
      sku: prodSKU,
      images: prodImages.filter(Boolean),
      collections: prodCollections,
      occasions: prodOccasions,
      bestseller: prodBestseller,
      newArrival: prodNewArrival,
      featured: prodFeatured
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowProductForm(false);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Error saving product records.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Order Status Handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}`, { orderStatus: newStatus });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}`, { paymentStatus: newStatus });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Coupon Handlers
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      await api.post('/coupons', {
        code: newCouponCode,
        type: newCouponType,
        value: Number(newCouponVal),
        minOrderValue: Number(newCouponMin),
        expiryDate: newCouponExpiry,
        usageLimit: Number(newCouponLimit)
      });
      setNewCouponCode('');
      loadCoupons();
    } catch (err) {
      alert(err.message || 'Failed creating coupon code.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      loadCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // Reviews Moderation
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await api.delete(`/products/admin/reviews/${id}`);
      loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // CMS Handlers
  const handleCMSSave = async (e) => {
    e.preventDefault();
    const payload = {
      announcement,
      hero: {
        heading: heroHeading,
        subheading: heroSubheading,
        desktopImage: heroDesktopImg,
        mobileImage: heroMobileImg
      },
      editorialBanner: {
        heading: bannerHeading,
        subheading: bannerSubheading,
        image: bannerImg
      },
      featuredCollection: {
        heading: featHeading,
        subheading: featSubheading,
        image: featImg
      },
      brandStory: {
        heading: storyHeading,
        text: storyText,
        image: storyImg
      }
    };

    try {
      await updateCMSData(payload);
      alert('CMS Homepage Layout synchronized successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-atelier-marigold/35 min-h-screen font-sans py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="pb-8 border-b border-luxury-charcoal/10 mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold">Console Manager</span>
          <h1 className="font-serif text-2xl md:text-3.5xl uppercase tracking-wider text-luxury-charcoal mt-1">
            HOS CONTROL PANEL
          </h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Tab Sidebar */}
          <aside className="lg:col-span-1 space-y-2">
            <button
              onClick={() => { setActiveTab('products'); setShowProductForm(false); }}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'products'
                ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <Package size={16} />
              <span>Creations Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'orders'
                ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <ClipboardList size={16} />
              <span>Fulfillment Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'coupons'
                ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <Ticket size={16} />
              <span>Promo Coupons</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'reviews'
                ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <MessageSquare size={16} />
              <span>Moderate Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'cms'
                ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <Sliders size={16} />
              <span>Homepage CMS</span>
            </button>
          </aside>

          {/* Main Dashboard Window */}
          <main className="lg:col-span-4 bg-white border border-luxury-charcoal/5 p-6 md:p-8 rounded-sm shadow-xs min-h-[60vh]">

            {/* 1. CREATIONS CATALOG (PRODUCTS) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {!showProductForm ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Garment Creations</h3>
                      <button
                        onClick={() => handleOpenProductForm(null)}
                        className="bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury py-2.5 px-5 transition-colors flex items-center space-x-1.5 rounded-sm font-semibold"
                      >
                        <Plus size={14} />
                        <span>Add New Product</span>
                      </button>
                    </div>

                    {loadingProducts ? (
                      <p className="text-xs text-luxury-muted italic">Loading catalog...</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-luxury-charcoal/10 text-luxury-muted uppercase tracking-wider">
                              <th className="py-2.5 font-semibold">SKU</th>
                              <th className="py-2.5 font-semibold">Garment</th>
                              <th className="py-2.5 font-semibold">Category</th>
                              <th className="py-2.5 font-semibold">Price</th>
                              <th className="py-2.5 font-semibold">Stock</th>
                              <th className="py-2.5 font-semibold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((prod) => (
                              <tr key={prod._id} className="border-b border-luxury-charcoal/5 hover:bg-luxury-beige/20 transition-colors">
                                <td className="py-3 text-luxury-muted font-mono">{prod.sku}</td>
                                <td className="py-3 font-semibold text-luxury-charcoal flex items-center space-x-2">
                                  <img src={prod.images[0]} alt="" className="w-8 h-10 object-cover bg-luxury-beige rounded-xs" />
                                  <span>{prod.name}</span>
                                </td>
                                <td className="py-3 text-luxury-charcoal">{prod.category}</td>
                                <td className="py-3 text-luxury-charcoal">₹{prod.price.toLocaleString('en-IN')}</td>
                                <td className={`py-3 font-medium ${prod.inventory < 5 ? 'text-red-700' : 'text-luxury-charcoal'}`}>{prod.inventory}</td>
                                <td className="py-3 text-right space-x-2">
                                  <button
                                    onClick={() => handleOpenProductForm(prod)}
                                    className="text-luxury-champagne hover:text-luxury-charcoal p-1 inline-block"
                                    aria-label="Edit product"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod._id)}
                                    className="text-red-700 hover:text-red-900 p-1 inline-block"
                                    aria-label="Delete product"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  // Add/Edit Product Form
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">
                      {editingProduct ? `Edit: ${editingProduct.name}` : 'New Garment Record'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Product Name</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">SKU Code</label>
                        <input
                          type="text"
                          required
                          value={prodSKU}
                          onChange={(e) => setProdSKU(e.target.value)}
                          placeholder="e.g. HOS-DRS-009"
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Base Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Discount (%)</label>
                        <input
                          type="number"
                          value={prodDiscount}
                          onChange={(e) => setProdDiscount(e.target.value)}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Inventory Stock</label>
                        <input
                          type="number"
                          required
                          value={prodInventory}
                          onChange={(e) => setProdInventory(e.target.value)}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Category Type</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2.5 text-xs focus:outline-none focus:border-luxury-champagne"
                        >
                          <option value="Dresses">Dresses</option>
                          <option value="Tops">Tops</option>
                          <option value="Co-ords">Co-ords</option>
                          <option value="Jackets">Jackets</option>
                          <option value="Trousers">Trousers</option>
                          <option value="Skirts">Skirts</option>
                          <option value="Gowns">Gowns</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Colors (Comma separated)</label>
                        <input
                          type="text"
                          value={prodColors.join(', ')}
                          onChange={(e) => setProdColors(e.target.value.split(',').map(s => s.trim()))}
                          className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne"
                        />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-2">Available Sizes</legend>
                      <div className="flex flex-wrap gap-2">
                        {SIZE_OPTIONS.map((size) => (
                          <label key={size} className={`cursor-pointer border px-3 py-2 text-[10px] uppercase tracking-wide transition-colors ${prodSizes.includes(size) ? 'border-luxury-charcoal bg-luxury-charcoal text-white' : 'border-luxury-charcoal/15 bg-white text-luxury-charcoal hover:border-luxury-charcoal'}`}>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={prodSizes.includes(size)}
                              onChange={() => setProdSizes((current) => current.includes(size) ? current.filter((item) => item !== size) : [...current, size])}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Product Fit & Size Instructions</label>
                      <textarea
                        required
                        rows={3}
                        value={prodSizeDescription}
                        onChange={(e) => setProdSizeDescription(e.target.value)}
                        placeholder="Add fit notes and sizing guidance specific to this product."
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    {/* Checkbox tags */}
                    <div className="flex space-x-6 py-2 border-y border-luxury-charcoal/5">
                      <label className="flex items-center space-x-2 text-xs text-luxury-charcoal cursor-pointer uppercase tracking-wider">
                        <input type="checkbox" checked={prodBestseller} onChange={(e) => setProdBestseller(e.target.checked)} className="rounded text-luxury-champagne focus:ring-luxury-champagne" />
                        <span>Bestseller</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs text-luxury-charcoal cursor-pointer uppercase tracking-wider">
                        <input type="checkbox" checked={prodNewArrival} onChange={(e) => setProdNewArrival(e.target.checked)} className="rounded text-luxury-champagne focus:ring-luxury-champagne" />
                        <span>New Arrival</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs text-luxury-charcoal cursor-pointer uppercase tracking-wider">
                        <input type="checkbox" checked={prodFeatured} onChange={(e) => setProdFeatured(e.target.checked)} className="rounded text-luxury-champagne focus:ring-luxury-champagne" />
                        <span>Featured Creation</span>
                      </label>
                    </div>

                    {/* Image URLs */}
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block">Image Assets URLs</label>
                      <input
                        type="text"
                        placeholder="Image URL 1 (Cover)"
                        required
                        value={prodImages[0] || ''}
                        onChange={(e) => {
                          const updated = [...prodImages];
                          updated[0] = e.target.value;
                          setProdImages(updated);
                        }}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Image URL 2 (Hover)"
                        value={prodImages[1] || ''}
                        onChange={(e) => {
                          const updated = [...prodImages];
                          updated[1] = e.target.value;
                          setProdImages(updated);
                        }}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Short Description</label>
                      <textarea
                        required
                        rows={3}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Detailed Specifications Bulletins</label>
                      <textarea
                        rows={3}
                        value={prodDetails}
                        onChange={(e) => setProdDetails(e.target.value)}
                        placeholder="• 100% Satin silk&#10;• Dry clean only&#10;• Made in India"
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-8 py-3 font-semibold transition-colors rounded-sm"
                      >
                        SAVE CREATION
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="border border-luxury-charcoal/20 text-luxury-charcoal text-xs uppercase tracking-luxury px-8 py-3 font-semibold transition-colors rounded-sm bg-white"
                      >
                        CANCEL
                      </button>
                    </div>

                  </form>
                )}
              </div>
            )}

            {/* 2. FULFILLMENT ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Fulfillment orders log</h3>

                {loadingOrders ? (
                  <p className="text-xs text-luxury-muted italic">Loading orders...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-luxury-charcoal/10 text-luxury-muted uppercase tracking-wider">
                          <th className="py-2.5 font-semibold">Order #</th>
                          <th className="py-2.5 font-semibold">Customer</th>
                          <th className="py-2.5 font-semibold">Total</th>
                          <th className="py-2.5 font-semibold">Payment Status</th>
                          <th className="py-2.5 font-semibold">Shipment Stage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((ord) => (
                          <tr key={ord._id} className="border-b border-luxury-charcoal/5 hover:bg-luxury-beige/10 transition-colors">
                            <td className="py-3 font-mono font-semibold">{ord.orderNumber}</td>
                            <td className="py-3 text-luxury-charcoal">{ord.shippingAddress.fullName}<br />{ord.shippingAddress.phone}</td>
                            <td className="py-3 font-semibold">₹{ord.total.toLocaleString('en-IN')}</td>
                            <td className="py-3">
                              <select
                                value={ord.paymentStatus}
                                onChange={(e) => handleUpdatePaymentStatus(ord._id, e.target.value)}
                                className={`text-[10px] uppercase font-semibold border-none bg-transparent rounded-sm py-1 cursor-pointer focus:outline-none ${ord.paymentStatus === 'Paid' ? 'text-green-800' : 'text-red-800'
                                  }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="py-3">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                className="text-[10px] uppercase font-semibold bg-transparent border-none py-1 cursor-pointer focus:outline-none text-luxury-champagne"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. PROMO COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Promo Coupons</h3>

                {/* Create Form */}
                <form onSubmit={handleAddCoupon} className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-luxury-beige/30 p-4 border border-luxury-charcoal/5 rounded-sm">
                  <div>
                    <input
                      type="text"
                      placeholder="CODE"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-luxury-charcoal/10 px-2 py-1.5 text-xs focus:outline-none uppercase tracking-wider"
                    />
                  </div>
                  <div>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full bg-white border border-luxury-charcoal/10 px-2 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="percentage">% Off</option>
                      <option value="fixed">Flat Off</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="VALUE"
                      required
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(e.target.value)}
                      className="w-full bg-white border border-luxury-charcoal/10 px-2 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="MIN VALUE"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(e.target.value)}
                      className="w-full bg-white border border-luxury-charcoal/10 px-2 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury py-1.5 transition-colors font-semibold"
                  >
                    ADD CODE
                  </button>
                </form>

                {/* List Table */}
                {loadingCoupons ? (
                  <p className="text-xs text-luxury-muted italic">Loading coupons...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-luxury-charcoal/10 text-luxury-muted uppercase tracking-wider">
                          <th className="py-2.5 font-semibold">Code</th>
                          <th className="py-2.5 font-semibold">Type</th>
                          <th className="py-2.5 font-semibold">Benefit</th>
                          <th className="py-2.5 font-semibold">Min Order</th>
                          <th className="py-2.5 font-semibold">Uses</th>
                          <th className="py-2.5 font-semibold text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((c) => (
                          <tr key={c._id} className="border-b border-luxury-charcoal/5">
                            <td className="py-3 font-semibold text-luxury-charcoal uppercase tracking-wider">{c.code}</td>
                            <td className="py-3 capitalize text-luxury-muted">{c.type}</td>
                            <td className="py-3 font-semibold text-luxury-charcoal">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                            <td className="py-3 text-luxury-muted">₹{c.minOrderValue.toLocaleString('en-IN')}</td>
                            <td className="py-3 text-luxury-charcoal">{c.usageCount} / {c.usageLimit}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteCoupon(c._id)}
                                className="text-red-700 hover:text-red-900 p-1 inline-block"
                                aria-label="Delete coupon"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. MODERATE REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Moderate Reviews</h3>
                {loadingReviews ? (
                  <p className="text-xs text-luxury-muted italic">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-xs text-luxury-muted italic">No customer reviews found.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="border border-luxury-charcoal/10 rounded-sm p-4 flex justify-between items-start space-x-4 bg-luxury-beige/5">
                        <div className="space-y-1.5 flex-1">
                          <p className="text-[10px] text-luxury-muted uppercase tracking-luxury font-semibold">Product: {rev.productName}</p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="font-bold text-luxury-charcoal">{rev.customerName}</span>
                            <span className="text-[10px] text-luxury-champagne flex">
                              {[...Array(rev.rating)].map((_, i) => <Check key={i} size={10} className="stroke-2 inline" />)}
                            </span>
                          </div>
                          <h5 className="font-serif text-xs font-semibold text-luxury-charcoal">{rev.title}</h5>
                          <p className="text-xs text-luxury-muted font-light leading-relaxed">{rev.text}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="text-red-700 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors flex-none"
                          aria-label="Delete review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. HOMEPAGE CMS EDITOR */}
            {activeTab === 'cms' && (
              <form onSubmit={handleCMSSave} className="space-y-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Visual Homepage CMS Override</h3>

                {/* Announcement bar */}
                <div>
                  <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Announcement Text</label>
                  <input
                    type="text"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                {/* Hero section CMS */}
                <div className="border-t border-luxury-charcoal/5 pt-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">Hero Slider Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Heading</label>
                      <input
                        type="text"
                        value={heroHeading}
                        onChange={(e) => setHeroHeading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Subheading</label>
                      <input
                        type="text"
                        value={heroSubheading}
                        onChange={(e) => setHeroSubheading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Desktop Image URL (2560x1440)</label>
                      <input
                        type="text"
                        value={heroDesktopImg}
                        onChange={(e) => setHeroDesktopImg(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Mobile Image URL (1440x1920)</label>
                      <input
                        type="text"
                        value={heroMobileImg}
                        onChange={(e) => setHeroMobileImg(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Editorial Banner */}
                <div className="border-t border-luxury-charcoal/5 pt-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">Editorial Mid-page Banner</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Heading</label>
                      <input
                        type="text"
                        value={bannerHeading}
                        onChange={(e) => setBannerHeading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Subheading</label>
                      <input
                        type="text"
                        value={bannerSubheading}
                        onChange={(e) => setBannerSubheading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Banner Background Image URL</label>
                    <input
                      type="text"
                      value={bannerImg}
                      onChange={(e) => setBannerImg(e.target.value)}
                      className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Featured Collection */}
                <div className="border-t border-luxury-charcoal/5 pt-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">Featured Collection Spotlight</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Heading</label>
                      <input
                        type="text"
                        value={featHeading}
                        onChange={(e) => setFeatHeading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Subheading</label>
                      <input
                        type="text"
                        value={featSubheading}
                        onChange={(e) => setFeatSubheading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Spotlight Image URL</label>
                    <input
                      type="text"
                      value={featImg}
                      onChange={(e) => setFeatImg(e.target.value)}
                      className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Brand Story */}
                <div className="border-t border-luxury-charcoal/5 pt-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">Brand Story Heritage Panel</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Heading</label>
                      <input
                        type="text"
                        value={storyHeading}
                        onChange={(e) => setStoryHeading(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Story Narrative Content</label>
                      <textarea
                        rows={3}
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Heritage Portrait Image URL</label>
                    <input
                      type="text"
                      value={storyImg}
                      onChange={(e) => setStoryImg(e.target.value)}
                      className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-luxury-charcoal/10">
                  <button
                    type="submit"
                    className="bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-8 py-3.5 font-semibold transition-colors rounded-sm"
                  >
                    SAVE CMS HOMEPAGE OVERRIDES
                  </button>
                </div>
              </form>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
