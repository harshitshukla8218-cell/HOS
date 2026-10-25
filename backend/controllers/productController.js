import db from '../config/db.js';

// Get all products with filters & sorting
export const getProducts = async (req, res) => {
  try {
    const { category, collection, occasion, size, color, minPrice, maxPrice, discount, search, sort } = req.query;

    let products = await db.products.find();

    // 1. Filter by category
    if (category) {
      const catLower = category.toLowerCase();
      products = products.filter(p => p.category.toLowerCase() === catLower);
    }

    // 2. Filter by collection
    if (collection) {
      const colLower = collection.toLowerCase().replace('-', ' ');
      products = products.filter(p =>
        p.collections && p.collections.some(c => c.toLowerCase().replace('-', ' ') === colLower)
      );
    }

    // 3. Filter by occasion
    if (occasion) {
      const occLower = occasion.toLowerCase().replace('-', ' ');
      products = products.filter(p =>
        p.occasions && p.occasions.some(o => o.toLowerCase().replace('-', ' ') === occLower)
      );
    }

    // 4. Filter by size
    if (size) {
      const sizeUpper = size.toUpperCase();
      products = products.filter(p => p.sizes && p.sizes.includes(sizeUpper));
    }

    // 5. Filter by color
    if (color) {
      const colLower = color.toLowerCase();
      products = products.filter(p =>
        p.colors && p.colors.some(c => c.toLowerCase() === colLower)
      );
    }

    // 6. Filter by price ranges
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // 7. Filter by discount presence
    if (discount === 'true') {
      products = products.filter(p => p.discount > 0);
    }

    // 8. Filter by text search
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // 9. Sorting
    if (sort) {
      if (sort === 'price-asc') {
        products.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceA - priceB;
        });
      } else if (sort === 'price-desc') {
        products.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceB - priceA;
        });
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'bestselling') {
        products = products.filter(p => p.bestseller);
      } else if (sort === 'featured') {
        products = products.filter(p => p.featured);
      }
    }

    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Get product details by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await db.products.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch associated reviews
    const reviews = await db.reviews.find({ productId: product._id });

    res.json({
      ...product,
      reviews: reviews || []
    });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    res.status(500).json({ message: 'Server error fetching product details' });
  }
};

// Add product review
export const addProductReview = async (req, res) => {
  try {
    const { rating, title, text, customerName } = req.body;
    const { slug } = req.params;

    if (!rating || !text || !customerName) {
      return res.status(400).json({ message: 'Rating, text and name are required' });
    }

    const product = await db.products.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = await db.reviews.insertOne({
      productId: product._id,
      rating: Number(rating),
      title: title || 'Review',
      text,
      customerName,
      verified: true, // We auto-verify or let admin moderate
      approved: true // Set to true by default, admin can revoke
    });

    // Update product rating average
    const allReviews = await db.reviews.find({ productId: product._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await db.products.updateOne({ _id: product._id }, { rating: parseFloat(avgRating.toFixed(1)) });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

// --- ADMIN CONTROLLERS ---

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, discount, images, description, details, sizes, sizeDescription, colors, category, collections, occasions, inventory, sku, bestseller, newArrival, featured } = req.body;

    if (!name || !price || !description || !images || images.length === 0 || !category) {
      return res.status(400).json({ message: 'Name, price, description, images and category are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await db.products.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A product with a similar name already exists' });
    }

    const newProduct = await db.products.insertOne({
      name,
      slug,
      price: Number(price),
      discount: Number(discount || 0),
      images,
      description,
      details: details || '',
      sizes: sizes || ['S', 'M', 'L'],
      sizeDescription: sizeDescription || '',
      colors: colors || ['Default'],
      category,
      collections: collections || [],
      occasions: occasions || [],
      inventory: Number(inventory || 10),
      sku: sku || `HOS-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      bestseller: bestseller === true || bestseller === 'true',
      newArrival: newArrival === true || newArrival === 'true',
      featured: featured === true || featured === 'true',
      rating: 5.0
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await db.products.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If name is updated, update slug
    if (updates.name && updates.name !== product.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Normalize types
    if (updates.price) updates.price = Number(updates.price);
    if (updates.discount !== undefined) updates.discount = Number(updates.discount);
    if (updates.inventory !== undefined) updates.inventory = Number(updates.inventory);

    if (updates.bestseller !== undefined) updates.bestseller = updates.bestseller === true || updates.bestseller === 'true';
    if (updates.newArrival !== undefined) updates.newArrival = updates.newArrival === true || updates.newArrival === 'true';
    if (updates.featured !== undefined) updates.featured = updates.featured === true || updates.featured === 'true';

    const updated = await db.products.updateOne({ _id: id }, updates);
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.products.deleteOne({ _id: id });
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Also delete product reviews
    const reviews = await db.reviews.find({ productId: id });
    for (const r of reviews) {
      await db.reviews.deleteOne({ _id: r._id });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// Moderate Reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await db.reviews.find({});
    // Map with product name
    const populated = await Promise.all(reviews.map(async (r) => {
      const p = await db.products.findOne({ _id: r.productId });
      return { ...r, productName: p ? p.name : 'Unknown Product' };
    }));
    res.json(populated);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await db.reviews.deleteOne({ _id: id });
    if (!success) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};
