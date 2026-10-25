import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      await applyCoupon(couponInput);
      setCouponInput('');
    } catch (err) {
      // Handled in CartContext
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Progress for free shipping (₹15,000 threshold)
  const freeShippingThreshold = 15000;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-luxury-ivory h-full shadow-2xl z-10 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-luxury-charcoal/5 flex justify-between items-center">
          <h2 className="font-serif text-lg uppercase tracking-luxury text-luxury-charcoal font-semibold">
            Shopping Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="text-luxury-charcoal hover:scale-105 transition-transform"
            aria-label="Close cart drawer"
          >
            <X strokeWidth={1} size={28} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {cartItems.length > 0 && (
          <div className="px-6 py-3 bg-luxury-beige/50 border-b border-luxury-charcoal/5">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[11px] text-luxury-charcoal tracking-wide">
                You are <span className="font-semibold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> away from <span className="font-semibold">FREE SHIPPING</span>
              </p>
            ) : (
              <p className="text-[11px] text-green-800 tracking-wide font-semibold flex items-center">
                <Truck size={12} className="mr-1.5" />
                CONGRATULATIONS! YOUR ORDER SHIPS FREE.
              </p>
            )}
            <div className="w-full bg-luxury-charcoal/10 h-1.5 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-luxury-champagne h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-lg text-luxury-charcoal/50">Your bag is empty.</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="mt-6 inline-block text-xs uppercase tracking-luxury border border-luxury-charcoal px-6 py-3 hover:bg-luxury-charcoal hover:text-luxury-ivory transition-all duration-300"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex space-x-4 pb-6 border-b border-luxury-charcoal/5">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-24 object-cover bg-luxury-beige rounded-sm" 
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-serif text-sm font-medium text-luxury-charcoal">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-luxury-charcoal/40 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] text-luxury-muted mt-1 uppercase tracking-wider">
                      Size: {item.size} / Color: {item.color}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-luxury-charcoal/10 px-2 py-1 space-x-3 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="text-luxury-charcoal/60 hover:text-luxury-charcoal"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs text-luxury-charcoal font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="text-luxury-charcoal/60 hover:text-luxury-charcoal"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {item.discountedPrice < item.price ? (
                        <>
                          <p className="text-xs font-semibold text-luxury-charcoal">₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-luxury-muted line-through">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </>
                      ) : (
                        <p className="text-xs font-semibold text-luxury-charcoal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculations / checkout footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-luxury-beige/30 border-t border-luxury-charcoal/5 space-y-4">
            
            {/* Coupon Input Form */}
            <form onSubmit={handleApplyCoupon} className="flex space-x-2">
              <input
                type="text"
                placeholder={couponCode ? `Active: ${couponCode}` : "Enter Promo Code"}
                disabled={!!couponCode}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-white border border-luxury-charcoal/10 px-3 py-2 text-xs uppercase tracking-luxury focus:outline-none focus:border-luxury-champagne disabled:opacity-60"
              />
              {couponCode ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="bg-red-700 text-white text-[10px] uppercase tracking-luxury px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={applying || !couponInput}
                  className="bg-luxury-charcoal text-luxury-ivory text-[10px] uppercase tracking-luxury px-4 py-2 hover:bg-luxury-champagne transition-colors disabled:opacity-50"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              )}
            </form>
            {couponError && <p className="text-[10px] text-red-700 font-semibold">{couponError}</p>}
            {couponCode && <p className="text-[10px] text-green-800 font-semibold">Promo code {couponCode} is active!</p>}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-luxury-charcoal">
              <div className="flex justify-between">
                <span className="text-luxury-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-800">
                  <span>Coupon Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-luxury-muted">Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
              </div>

              <div className="flex justify-between text-sm font-semibold border-t border-luxury-charcoal/5 pt-2.5 mt-2">
                <span>Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button 
              onClick={handleCheckout}
              className="w-full bg-luxury-charcoal text-luxury-ivory text-xs uppercase tracking-luxury py-3.5 hover:bg-luxury-champagne transition-all duration-300 font-medium mt-2"
            >
              PROCEED TO SECURE CHECKOUT
            </button>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-2 text-[8px] uppercase tracking-luxury text-luxury-muted text-center pt-2 mt-2 border-t border-luxury-charcoal/5">
              <div className="flex flex-col items-center">
                <ShieldCheck size={14} className="text-luxury-champagne mb-1" />
                <span>SECURE CHECKOUT</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw size={14} className="text-luxury-champagne mb-1" />
                <span>EASY RETURNS</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck size={14} className="text-luxury-champagne mb-1" />
                <span>FAST SHIPPING</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
