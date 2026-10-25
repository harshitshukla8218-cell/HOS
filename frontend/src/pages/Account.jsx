import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, MapPin, ClipboardList, LogOut, CheckCircle, HelpCircle } from 'lucide-react';
import api from '../utils/api.js';

export default function Account() {
  const { user, login, register, logout, updateProfileAddresses, updateProfileSizes } = useAuth();

  // Tab control: 'orders', 'address', 'sizes'
  const [activeTab, setActiveTab] = useState('orders');

  // Login/Register Form toggle
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address Form State
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Sizes State
  const [dressSize, setDressSize] = useState('S');
  const [topSize, setTopSize] = useState('S');
  const [bottomSize, setBottomSize] = useState('M');

  useEffect(() => {
    if (user) {
      setAddresses(user.addresses || []);
      setDressSize(user.savedSizes?.dresses || 'S');
      setTopSize(user.savedSizes?.tops || 'S');
      setBottomSize(user.savedSizes?.bottoms || 'M');

      // Load orders list
      async function loadOrders() {
        setLoadingOrders(true);
        try {
          const myOrders = await api.get('/orders/myorders');
          setOrders(myOrders);
        } catch (err) {
          console.error('Error fetching my orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
      loadOrders();
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register(name, email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!fullName || !street || !city || !stateName || !postalCode || !phone) return;

    const newAddr = {
      fullName,
      street,
      city,
      state: stateName,
      postalCode,
      country: 'India',
      phone,
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, newAddr];
    try {
      const resp = await updateProfileAddresses(updated);
      setAddresses(resp);
      setIsAddingAddress(false);
      // Reset form
      setFullName('');
      setStreet('');
      setCity('');
      setStateName('');
      setPostalCode('');
      setPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    try {
      const resp = await updateProfileAddresses(updated);
      setAddresses(resp);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSizes = async () => {
    try {
      await updateProfileSizes({
        dresses: dressSize,
        tops: topSize,
        bottoms: bottomSize
      });
      alert('Sizing preferences saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // RENDER: GUEST (LOGIN / REGISTER)
  if (!user) {
    return (
      <div className="bg-atelier-sage min-h-screen font-sans py-16 px-4 flex justify-center items-center">
        <div className="bg-white border border-luxury-charcoal/5 p-8 max-w-md w-full shadow-lg rounded-sm">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold">HOS Membership</span>
            <h1 className="font-serif text-2xl uppercase tracking-wider text-luxury-charcoal mt-2">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury font-light">
              {isLoginView ? 'Login to view orders and sizing profiles.' : "Join the HOS Inner Circle."}
            </p>
          </div>

          {errorMsg && <p className="text-xs text-red-700 font-semibold text-center mb-4">{errorMsg}</p>}

          {isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-luxury-champagne rounded-sm text-luxury-charcoal"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-luxury-champagne rounded-sm text-luxury-charcoal"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3.5 transition-colors font-semibold rounded-sm mt-2"
              >
                SIGN IN
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="FULL NAME"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-luxury-champagne rounded-sm text-luxury-charcoal"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-luxury-champagne rounded-sm text-luxury-charcoal"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs tracking-wide focus:outline-none focus:border-luxury-champagne rounded-sm text-luxury-charcoal"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3.5 transition-colors font-semibold rounded-sm mt-2"
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-luxury-charcoal/10 text-center">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMsg('');
              }}
              className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-charcoal font-semibold underline"
            >
              {isLoginView ? 'Need an account? Register here' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: CUSTOMER DASHBOARD
  return (
    <div className="bg-atelier-sky/60 min-h-screen font-sans py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-luxury-charcoal/10 mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold">Welcome Back</span>
            <h1 className="font-serif text-2xl md:text-3.5xl uppercase tracking-wider text-luxury-charcoal mt-1 font-light">
              {user.name}
            </h1>
            <p className="text-xs text-luxury-muted mt-1 uppercase tracking-wider font-light">
              Role: <span className="font-semibold">{user.role}</span> / {user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="mt-4 md:mt-0 flex items-center space-x-2 text-xs uppercase tracking-luxury border border-luxury-charcoal/15 hover:border-red-700 hover:text-red-700 px-4 py-2.5 bg-white transition-all rounded-sm font-semibold"
          >
            <LogOut size={14} />
            <span>LOG OUT</span>
          </button>
        </div>

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'orders'
                  ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                  : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <ClipboardList size={16} />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('address')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'address'
                  ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                  : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <MapPin size={16} />
              <span>Address Book ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sizes')}
              className={`w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border rounded-sm transition-all ${activeTab === 'sizes'
                  ? 'border-luxury-charcoal bg-luxury-charcoal text-white font-semibold'
                  : 'border-transparent hover:bg-luxury-beige/50 text-luxury-charcoal'
                }`}
            >
              <User size={16} />
              <span>Sizing Profiles</span>
            </button>

            {user.role === 'admin' && (
              <a
                href="/admin-panel-direct" // Shortcut link or button routing
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin-panel-direct');
                }}
                className="w-full flex items-center space-x-3 text-xs uppercase tracking-luxury py-3 px-4 border border-luxury-champagne/40 bg-luxury-champagne/10 text-luxury-champagne hover:bg-luxury-champagne hover:text-white rounded-sm transition-all mt-4 font-semibold"
              >
                <CheckCircle size={16} />
                <span>Go to Admin Dashboard</span>
              </a>
            )}
          </aside>

          {/* Active Tab Panel Content */}
          <main className="lg:col-span-3 bg-white border border-luxury-charcoal/5 p-6 md:p-8 rounded-sm shadow-xs min-h-[50vh]">

            {/* 1. ORDERS LOG */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-4">Order History</h3>
                {loadingOrders ? (
                  <p className="text-xs text-luxury-muted italic">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-xs text-luxury-muted italic">You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-luxury-charcoal/10 rounded-sm p-4 md:p-6 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs border-b border-luxury-charcoal/5 pb-3">
                          <div>
                            <span className="text-luxury-muted uppercase tracking-luxury">Order Ref:</span>
                            <span className="font-semibold ml-1.5 text-luxury-charcoal">{order.orderNumber}</span>
                          </div>
                          <div className="mt-2 md:mt-0 space-x-4 text-luxury-muted">
                            <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span>Total: <span className="font-semibold text-luxury-charcoal">₹{order.total.toLocaleString('en-IN')}</span></span>
                          </div>
                        </div>

                        {/* Order status banners */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] uppercase tracking-luxury">
                          <div>
                            <span className="text-luxury-muted block">Status</span>
                            <span className={`font-semibold mt-1 px-2 py-0.5 inline-block rounded-sm ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-luxury-beige text-luxury-charcoal'
                              }`}>{order.orderStatus}</span>
                          </div>
                          <div>
                            <span className="text-luxury-muted block">Payment</span>
                            <span className={`font-semibold mt-1 px-2 py-0.5 inline-block rounded-sm ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>{order.paymentStatus}</span>
                          </div>
                          <div>
                            <span className="text-luxury-muted block">Delivery Est</span>
                            <span className="font-semibold text-luxury-charcoal block mt-1">{order.estimatedDelivery}</span>
                          </div>
                          <div>
                            <span className="text-luxury-muted block">Tracking Ref</span>
                            <span className="font-semibold text-luxury-champagne block mt-1">{order.trackingNumber || 'Pending'}</span>
                          </div>
                        </div>

                        {/* Order items List */}
                        <div className="space-y-3 pt-3 border-t border-luxury-charcoal/5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-3">
                                <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-luxury-beige rounded-sm" />
                                <div>
                                  <p className="font-serif font-medium text-luxury-charcoal">{item.name}</p>
                                  <p className="text-[9px] text-luxury-muted uppercase tracking-wider">Size: {item.size} / Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-semibold text-luxury-charcoal">₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESS BOOK */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Address Book</h3>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs uppercase tracking-luxury text-luxury-champagne font-semibold border-b border-luxury-champagne hover:text-luxury-charcoal hover:border-luxury-charcoal pb-0.5"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="space-y-4 max-w-md border border-luxury-charcoal/10 p-5 rounded-sm bg-luxury-beige/10">
                    <h4 className="text-xs uppercase tracking-luxury text-luxury-charcoal font-semibold">New Address Record</h4>

                    <div>
                      <input
                        type="text"
                        placeholder="RECIPIENT FULL NAME"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="STREET ADDRESS / APARTMENT"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="CITY"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                      <input
                        type="text"
                        placeholder="STATE"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="POSTAL CODE / PINCODE"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                      <input
                        type="text"
                        placeholder="PHONE NUMBER"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs focus:outline-none focus:border-luxury-champagne text-luxury-charcoal"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="bg-luxury-charcoal hover:bg-luxury-champagne text-white text-[10px] uppercase tracking-luxury px-6 py-2.5 font-semibold transition-colors rounded-sm"
                      >
                        SAVE ADDRESS
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="border border-luxury-charcoal/20 text-luxury-charcoal text-[10px] uppercase tracking-luxury px-6 py-2.5 font-semibold transition-colors rounded-sm bg-white"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                ) : addresses.length === 0 ? (
                  <p className="text-xs text-luxury-muted italic">No addresses saved. Add one to expedite checkout.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-luxury-charcoal/10 p-5 rounded-sm relative flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-xs text-luxury-charcoal">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[8px] bg-luxury-champagne/10 text-luxury-champagne px-1.5 py-0.5 uppercase tracking-wider font-semibold rounded-sm">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-luxury-muted leading-relaxed font-light">
                            {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-xs text-luxury-muted mt-2 font-light">Phone: {addr.phone}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[10px] uppercase tracking-luxury text-red-700 hover:text-red-900 border-t border-luxury-charcoal/5 pt-2 font-semibold text-left"
                        >
                          Delete Address
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SIZING PREFERENCES */}
            {activeTab === 'sizes' && (
              <div className="space-y-6 max-w-md">
                <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mb-2">Sizing Profiles</h3>
                <p className="text-xs text-luxury-muted uppercase tracking-wider leading-relaxed mb-6 font-light">
                  Save your typical dress sizes to display matching highlights on product catalogs.
                </p>

                <div className="space-y-4">
                  {/* Dresses */}
                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
                      Dresses & Gowns Size
                    </label>
                    <div className="flex space-x-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setDressSize(s)}
                          className={`w-9 h-9 border text-xs font-semibold rounded-sm transition-all ${dressSize === s
                              ? 'border-luxury-charcoal bg-luxury-charcoal text-white'
                              : 'border-luxury-charcoal/10 bg-white text-luxury-charcoal'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tops */}
                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
                      Tops & Jackets Size
                    </label>
                    <div className="flex space-x-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setTopSize(s)}
                          className={`w-9 h-9 border text-xs font-semibold rounded-sm transition-all ${topSize === s
                              ? 'border-luxury-charcoal bg-luxury-charcoal text-white'
                              : 'border-luxury-charcoal/10 bg-white text-luxury-charcoal'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottoms */}
                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-luxury-muted font-semibold block mb-2">
                      Trousers & Skirts Size
                    </label>
                    <div className="flex space-x-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setBottomSize(s)}
                          className={`w-9 h-9 border text-xs font-semibold rounded-sm transition-all ${bottomSize === s
                              ? 'border-luxury-charcoal bg-luxury-charcoal text-white'
                              : 'border-luxury-charcoal/10 bg-white text-luxury-charcoal'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSizes}
                    className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3 font-semibold transition-colors mt-6 rounded-sm"
                  >
                    SAVE PREFERENCES
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
