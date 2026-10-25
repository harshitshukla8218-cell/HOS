import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import api from '../utils/api.js';

export default function Checkout() {
  const { cartItems, subtotal, discountAmount, shippingCost, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Wizard steps: 'contact' -> 'shipping' -> 'payment' -> 'confirmation'
  const [step, setStep] = useState('contact');

  // Order Result State
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Form Inputs State
  const [email, setEmail] = useState(user ? user.email : '');
  const [fullName, setFullName] = useState(user?.addresses[0]?.fullName || '');
  const [street, setStreet] = useState(user?.addresses[0]?.street || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || '');
  const [stateName, setStateName] = useState(user?.addresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user?.addresses[0]?.postalCode || '');
  const [phone, setPhone] = useState(user?.addresses[0]?.phone || '');
  const [country, setCountry] = useState('India');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  if (cartItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans">
        <p className="font-serif text-lg text-luxury-charcoal/50">Your bag is empty.</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-6 bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-6 py-3 transition-colors duration-300 rounded-sm"
        >
          BACK TO SHOP
        </button>
      </div>
    );
  }

  // Prepopulate addresses helper
  const handleSelectSavedAddress = (addr) => {
    setFullName(addr.fullName);
    setStreet(addr.street);
    setCity(addr.city);
    setStateName(addr.state);
    setPostalCode(addr.postalCode);
    setPhone(addr.phone);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (email) setStep('shipping');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (fullName && street && city && stateName && postalCode && phone) {
      setStep('payment');
    }
  };

  // Submit checkout form and handle transactions
  const handleOrderSubmission = async (paymentOutcome = 'Success') => {
    if (paymentOutcome === 'Failure') {
      alert('Simulated Razorpay Transaction Declined. Please choose another card.');
      setShowRazorpayModal(false);
      return;
    }

    setSubmittingOrder(true);
    try {
      const payload = {
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName,
          street,
          city,
          state: stateName,
          postalCode,
          country,
          phone
        },
        couponCode: couponCode || null,
        paymentMethod
      };

      const orderResult = await api.post('/orders', payload);
      setPlacedOrder(orderResult);
      clearCart();
      setShowRazorpayModal(false);
      setStep('confirmation');
    } catch (error) {
      console.error('Checkout creation error:', error);
      alert(error.message || 'Error processing your checkout. Please verify item availability.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handlePayClick = () => {
    if (paymentMethod === 'Razorpay') {
      setShowRazorpayModal(true);
    } else {
      // Direct placement for COD
      handleOrderSubmission('Success');
    }
  };

  return (
    <div className="bg-atelier-marigold/60 min-h-screen font-sans py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: WIZARD FORM */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 border border-luxury-charcoal/5 rounded-sm shadow-xs">

          {/* Breadcrumb Steps indicator */}
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-luxury text-luxury-muted mb-8 border-b border-luxury-charcoal/5 pb-4">
            <span className={step === 'contact' ? 'text-luxury-charcoal font-bold' : ''}>Contact</span>
            <ChevronRight size={10} />
            <span className={step === 'shipping' ? 'text-luxury-charcoal font-bold' : ''}>Shipping</span>
            <ChevronRight size={10} />
            <span className={step === 'payment' ? 'text-luxury-charcoal font-bold' : ''}>Payment</span>
            <ChevronRight size={10} />
            <span className={step === 'confirmation' ? 'text-luxury-charcoal font-bold' : ''}>Receipt</span>
          </div>

          {/* STEP 1: CONTACT */}
          {step === 'contact' && (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <h2 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Customer Contact Information</h2>
              <div>
                <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3.5 transition-colors font-semibold rounded-sm"
              >
                PROCEED TO SHIPPING
              </button>
            </form>
          )}

          {/* STEP 2: SHIPPING */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Shipping Address Details</h2>
                <button
                  type="button"
                  onClick={() => setStep('contact')}
                  className="text-[9px] uppercase tracking-luxury text-luxury-champagne underline"
                >
                  Edit Email
                </button>
              </div>

              {/* Saved addresses selector */}
              {user && user.addresses?.length > 0 && (
                <div className="bg-luxury-beige/30 p-4 border border-luxury-charcoal/5 space-y-2 rounded-sm">
                  <span className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Pre-fill Saved Addresses</span>
                  <div className="flex gap-2 flex-wrap">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="bg-white border border-luxury-charcoal/10 hover:border-luxury-charcoal text-[10px] px-3 py-1.5 rounded-sm transition-all"
                      >
                        {addr.fullName} ({addr.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Recipient Name"
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Apartment, building, suite details"
                  className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Delhi"
                    className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110003"
                    className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-luxury text-luxury-muted block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-luxury-ivory border border-luxury-charcoal/10 px-4 py-3 text-xs focus:outline-none focus:border-luxury-champagne rounded-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3.5 transition-colors font-semibold rounded-sm"
                >
                  PROCEED TO PAYMENT METHOD
                </button>
                <button
                  type="button"
                  onClick={() => setStep('contact')}
                  className="border border-luxury-charcoal/20 text-luxury-charcoal px-6 py-3.5 text-xs uppercase tracking-luxury transition-colors rounded-sm bg-white"
                >
                  BACK
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal">Select Payment Option</h2>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-[9px] uppercase tracking-luxury text-luxury-champagne underline"
                >
                  Edit Shipping
                </button>
              </div>

              <div className="space-y-4">
                {/* Razorpay Option */}
                <label className={`flex items-center justify-between border p-4 cursor-pointer rounded-sm transition-all ${paymentMethod === 'Razorpay' ? 'border-luxury-charcoal bg-luxury-beige/10' : 'border-luxury-charcoal/10 hover:border-luxury-charcoal/40 bg-white'
                  }`}>
                  <div className="flex items-center space-x-3 text-xs uppercase tracking-luxury">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="w-4 h-4 text-luxury-champagne focus:ring-luxury-champagne"
                    />
                    <div>
                      <span className="font-semibold block text-luxury-charcoal">Online UPI & Cards (Razorpay)</span>
                      <span className="text-[10px] text-luxury-muted lowercase tracking-normal mt-0.5 block">Debit/credit, Net Banking, UPI wallets</span>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-luxury-muted" />
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between border p-4 cursor-pointer rounded-sm transition-all ${paymentMethod === 'COD' ? 'border-luxury-charcoal bg-luxury-beige/10' : 'border-luxury-charcoal/10 hover:border-luxury-charcoal/40 bg-white'
                  }`}>
                  <div className="flex items-center space-x-3 text-xs uppercase tracking-luxury">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="w-4 h-4 text-luxury-champagne focus:ring-luxury-champagne"
                    />
                    <div>
                      <span className="font-semibold block text-luxury-charcoal">Cash On Delivery (COD)</span>
                      <span className="text-[10px] text-luxury-muted normal-case tracking-normal mt-0.5 block">Pay cash at time of doorstep delivery</span>
                    </div>
                  </div>
                  <Truck size={18} className="text-luxury-muted" />
                </label>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-luxury-charcoal/5">
                <button
                  onClick={handlePayClick}
                  disabled={submittingOrder}
                  className="flex-1 bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury py-3.5 transition-all font-semibold rounded-sm"
                >
                  {paymentMethod === 'Razorpay' ? 'INITIALIZE ONLINE TRANSACTION' : 'PLACE ORDER (COD)'}
                </button>
                <button
                  onClick={() => setStep('shipping')}
                  className="border border-luxury-charcoal/20 text-luxury-charcoal px-6 py-3.5 text-xs uppercase tracking-luxury transition-all rounded-sm bg-white"
                >
                  BACK
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMATION INVOICE */}
          {step === 'confirmation' && placedOrder && (
            <div className="space-y-6 text-center py-10 flex flex-col items-center">
              <CheckCircle2 size={56} className="text-green-800 animate-pulse mb-4" />

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold">Thank you for your purchase</span>
                <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-luxury-charcoal mt-1">
                  ORDER COMPLETED
                </h1>
                <p className="text-xs text-luxury-muted mt-2 uppercase tracking-luxury">
                  Receipt details have been sent to <span className="font-semibold text-luxury-charcoal">{email}</span>
                </p>
              </div>

              {/* Invoice Panel */}
              <div className="border border-luxury-charcoal/10 rounded-sm p-6 text-left max-w-md w-full space-y-4 bg-luxury-beige/10">
                <div className="flex justify-between text-xs border-b border-luxury-charcoal/5 pb-2.5">
                  <span className="text-luxury-muted uppercase tracking-luxury font-medium">Order Number:</span>
                  <span className="font-semibold text-luxury-charcoal">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-luxury-muted uppercase tracking-luxury font-medium">Estimated Delivery:</span>
                  <span className="font-semibold text-luxury-charcoal">{placedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-luxury-muted uppercase tracking-luxury font-medium">Tracking Number:</span>
                  <span className="font-semibold text-luxury-champagne">{placedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t border-luxury-charcoal/5 pt-2.5">
                  <span className="text-luxury-charcoal uppercase tracking-luxury">Total Charged:</span>
                  <span className="text-luxury-charcoal">₹{placedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="bg-luxury-charcoal hover:bg-luxury-champagne text-white text-xs uppercase tracking-luxury px-8 py-3.5 transition-colors font-semibold rounded-sm mt-4"
              >
                RETURN TO SHOP
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: BAG SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-luxury-beige/35 p-6 border border-luxury-charcoal/5 rounded-sm">
            <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal border-b border-luxury-charcoal/10 pb-3 mb-4">
              Your Selection ({cartItems.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            {/* List */}
            <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 no-scrollbar mb-6">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-11 h-14 object-cover bg-luxury-beige rounded-sm" />
                    <div>
                      <p className="font-serif font-medium text-luxury-charcoal">{item.name}</p>
                      <p className="text-[9px] text-luxury-muted uppercase tracking-wider mt-0.5">Size: {item.size} / Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-luxury-charcoal">₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Price list */}
            <div className="space-y-2 text-xs border-t border-luxury-charcoal/10 pt-4 text-luxury-charcoal">
              <div className="flex justify-between">
                <span className="text-luxury-muted uppercase tracking-luxury">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-800">
                  <span className="uppercase tracking-luxury">Discounts</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-luxury-muted uppercase tracking-luxury">Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
              </div>

              <div className="flex justify-between text-sm font-semibold border-t border-luxury-charcoal/5 pt-3 mt-2 text-luxury-charcoal">
                <span className="uppercase tracking-luxury">Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-8 pt-6 border-t border-luxury-charcoal/10 flex justify-between items-center text-[9px] uppercase tracking-widest text-luxury-muted">
              <span className="flex items-center"><ShieldCheck size={12} className="text-luxury-champagne mr-1.5" /> SECURE DATA</span>
              <span>100% ORIGINAL</span>
              <span>EASY EXCHANGE</span>
            </div>
          </div>
        </div>

      </div>

      {/* RAZORPAY DIALOG SIMULATION OVERLAY */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs"></div>

          <div className="bg-luxury-nearblack text-white w-full max-w-sm rounded-lg p-6 shadow-2xl z-10 border border-white/10 font-sans">

            {/* Logo */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-sm font-bold tracking-widest">HOS</span>
                <span className="text-[7px] text-white/50 border border-white/20 px-1 rounded-sm uppercase">Secure checkout</span>
              </div>
              <button onClick={() => setShowRazorpayModal(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Total */}
            <div className="bg-white/5 p-4 rounded-md mb-6 border border-white/5">
              <span className="text-[10px] text-white/50 uppercase tracking-luxury block">Amount to Charge</span>
              <span className="text-xl font-bold text-white mt-1 block">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed text-center mb-6">
              This screen simulates the **Razorpay Payment Gateway API** for House of Simons. Choose an option to mock callback responses.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleOrderSubmission('Success')}
                className="w-full bg-green-700 hover:bg-green-600 text-white text-xs uppercase tracking-luxury py-3 font-semibold rounded-md transition-colors"
              >
                SIMULATE TRANSACTION SUCCESS
              </button>

              <button
                onClick={() => handleOrderSubmission('Failure')}
                className="w-full bg-red-700 hover:bg-red-600 text-white text-xs uppercase tracking-luxury py-3 font-semibold rounded-md transition-colors"
              >
                SIMULATE DECLINE / CANCEL
              </button>
            </div>

            <div className="text-center mt-6 text-[8px] text-white/40 uppercase tracking-widest">
              Razorpay Secured Checkout Interface Simulation
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
