import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Load cart from localstorage on start
  useEffect(() => {
    const savedCart = localStorage.getItem('hos_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Save cart to localstorage on changes
  useEffect(() => {
    localStorage.setItem('hos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product._id && item.size === size && item.color === color
      );

      const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountedPrice,
            image: product.images[0],
            size,
            color: color || product.colors[0],
            quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  // Shipping rules
  const threshold = 15000;
  const shippingCost = subtotal === 0 ? 0 : subtotal >= threshold ? 0 : 500;
  const total = subtotal - discountAmount + shippingCost;

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const data = await api.post('/coupons/validate', { code, orderValue: subtotal });
      setAppliedCoupon(data);
      setCouponCode(code.toUpperCase());
      return data;
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error.message || 'Coupon could not be applied');
      throw error;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        shippingCost,
        total,
        couponCode,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
