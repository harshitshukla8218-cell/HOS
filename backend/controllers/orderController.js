import db from '../config/db.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ message: 'Cart items and shipping address are required' });
    }

    let subtotal = 0;
    const validatedItems = [];

    // Verify stock & calculate subtotal
    for (const cartItem of items) {
      const product = await db.products.findOne({ _id: cartItem.productId });
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${cartItem.name}` });
      }

      if (product.inventory < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Only ${product.inventory} available.` 
        });
      }

      const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
      const itemCost = discountedPrice * cartItem.quantity;
      subtotal += itemCost;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountedPrice,
        image: product.images[0],
        size: cartItem.size,
        color: cartItem.color || product.colors[0],
        quantity: cartItem.quantity
      });
    }

    // Apply Coupon if present
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await db.coupons.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.active) {
        const today = new Date().toISOString().split('T')[0];
        const isExpired = coupon.expiryDate && coupon.expiryDate < today;
        const metMinVal = subtotal >= coupon.minOrderValue;
        const underLimit = coupon.usageCount < coupon.usageLimit;

        if (!isExpired && metMinVal && underLimit) {
          appliedCoupon = coupon.code;
          if (coupon.type === 'percentage') {
            discountAmount = Math.round((subtotal * coupon.value) / 100);
          } else {
            discountAmount = Math.min(coupon.value, subtotal);
          }
          
          // Increment usage count
          await db.coupons.updateOne({ _id: coupon._id }, { usageCount: coupon.usageCount + 1 });
        }
      }
    }

    // Shipping calculations (Configurable thresholds: Free over ₹15,000 for domestic, ₹40,000 international)
    const isInternational = shippingAddress.country && shippingAddress.country.toLowerCase() !== 'india';
    let shippingCost = 0;
    
    if (isInternational) {
      shippingCost = subtotal >= 40000 ? 0 : 3500;
    } else {
      shippingCost = subtotal >= 15000 ? 0 : 500;
    }

    const total = subtotal - discountAmount + shippingCost;
    const orderNumber = 'HOS-' + Math.floor(100000 + Math.random() * 900000);
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (isInternational ? 10 : 4));

    // Deduct stock inventory
    for (const item of validatedItems) {
      const product = await db.products.findOne({ _id: item.productId });
      await db.products.updateOne(
        { _id: item.productId },
        { inventory: product.inventory - item.quantity }
      );
    }

    const orderData = {
      orderNumber,
      userId: req.user ? req.user._id : 'guest',
      items: validatedItems,
      shippingAddress,
      subtotal,
      discountAmount,
      appliedCoupon,
      shippingCost,
      total,
      paymentMethod: paymentMethod || 'Razorpay',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid', // Pre-confirm paid for cards in mockup
      orderStatus: 'Confirmed',
      estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      trackingNumber: 'TRK' + Math.floor(10000000 + Math.random() * 90000000)
    };

    const newOrder = await db.orders.insertOne(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Get user orders (History)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await db.orders.find({ userId: req.user._id });
    // Sort orders by date descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Fetch my orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// Get order details
export const getOrderById = async (req, res) => {
  try {
    const order = await db.orders.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify authorized user
    if (order.userId !== 'guest' && order.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Fetch order detail error:', error);
    res.status(500).json({ message: 'Server error fetching order detail' });
  }
};

// --- ADMIN CONTROLLERS ---

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.orders.find({});
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const { id } = req.params;

    const order = await db.orders.findOne({ _id: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updated = await db.orders.updateOne({ _id: id }, updates);
    res.json(updated);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
