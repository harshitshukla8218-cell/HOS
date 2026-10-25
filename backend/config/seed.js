import bcrypt from 'bcryptjs';
import db from './db.js';

async function seed() {
  console.log("Seeding HOS Database...");

  // Reset database first
  await db.reset();

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('adminpass', salt);
  const customerPassword = await bcrypt.hash('userpass', salt);

  const adminUser = await db.users.insertOne({
    name: "HOS Administrator",
    email: 'admin@hos.com',
    password: adminPassword,
    role: 'admin',
    addresses: [],
    savedSizes: {}
  });

  const customerUser = await db.users.insertOne({
    name: 'Anushka Chauhan',
    email: 'customer@hos.com',
    password: customerPassword,
    role: 'customer',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Anushka Chauhan',
        street: '45, Lodhi Colony',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110003',
        country: 'India',
        phone: '+91 98765 43210',
        isDefault: true
      }
    ],
    savedSizes: {
      dresses: 'S',
      tops: 'S',
      bottoms: 'M'
    }
  });

  console.log('Users seeded successfully');

  // Seed Products
  const products = [
    {
      name: 'Aurelia Draped Dress',
      slug: 'aurelia-draped-dress',
      price: 18900,
      discount: 0,
      images: [
        '/images/dresses_aurelia_1.jpg',
        '/images/dresses_aurelia_2.jpg'
      ],
      description: 'An exquisite draped dress highlighting a fluid satin weave, high cowl neckline, and elegant side slit. Crafted for editorial luxury, it defines contemporary femininity with a minimal, flowing silhouette.',
      details: '• Cowl neck drape\n• Invisible back zipper\n• High leg slit\n• Premium silk satin blend\n• Dry clean only',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Warm Ivory', 'Charcoal', 'Soft Champagne'],
      category: 'Dresses',
      collections: ['New Season', 'Evening', 'Resort'],
      occasions: ['Evening', 'Wedding Guest', 'Brunch'],
      inventory: 15,
      rating: 4.8,
      sku: 'HOS-DRS-001',
      bestseller: true,
      newArrival: true,
      featured: true
    },
    {
      name: 'Simone Tailored Co-Ord',
      slug: 'simone-tailored-co-ord',
      price: 22500,
      discount: 10, // 10% off
      images: [
        '/images/coords_simone_1.jpg',
        '/images/coords_simone_2.jpg'
      ],
      description: 'A sharp, tailored two-piece set in mid-weight premium crepe. Features double-breasted closure and wide-leg trousers for a confident, clean, and commanding structure.',
      details: '• Structured blazer with peak lapels\n• Pleated wide-leg trousers\n• Fully lined interior\n• Crepe-wool blend\n• Made in India',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Sage Beige', 'Charcoal Black'],
      category: 'Co-ords',
      collections: ['New Season', 'Workwear', 'Limited Edition'],
      occasions: ['Workwear', 'Evening', 'Brunch'],
      inventory: 20,
      rating: 4.9,
      sku: 'HOS-CRD-002',
      bestseller: true,
      newArrival: true,
      featured: true
    },
    {
      name: 'Elara Sculpted Jacket',
      slug: 'elara-sculpted-jacket',
      price: 24900,
      discount: 0,
      images: [
        '/images/catalog/item-08/E94E0485-9D3E-4405-AC61-633B6B495B09.png',
        '/images/jackets_elara_2.jpg'
      ],
      description: 'A structured, sculptural jacket featuring strong shoulder pads, hourglass waist contouring, and luxury fabric with detailed premium cupro lining. Perfect for elegant layering.',
      details: '• Single button front closure\n• Contoured corset waist design\n• Signature gold-trimmed buttons\n• 100% fine wool exterior\n• Specialist dry clean only',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Off White', 'Camel Beige'],
      category: 'Jackets',
      collections: ['New Season', 'Workwear', 'Evening'],
      occasions: ['Workwear', 'Party', 'Evening'],
      inventory: 10,
      rating: 4.7,
      sku: 'HOS-JKT-003',
      bestseller: false,
      newArrival: true,
      featured: true
    },
    {
      name: 'Monroe Evening Dress',
      slug: 'monroe-evening-dress',
      price: 29900,
      discount: 0,
      images: [
        '/images/dresses_monroe_1.jpg',
        '/images/dresses_monroe_2.jpg'
      ],
      description: 'Floor-length evening dress crafted in heavy silk-satin. With an off-shoulder structure, sweetheart neckline, and elegant back drape detailing, this piece is designed for timeless elegance.',
      details: '• Sweetheart neck with internal grip gel\n• Drape details on lower back\n• Built-in internal corset structure\n• 100% silk satin\n• Dry clean only',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Emerald', 'Onyx Black'],
      category: 'Dresses',
      collections: ['Evening', 'Limited Edition'],
      occasions: ['Evening', 'Wedding Guest', 'Party'],
      inventory: 8,
      rating: 5.0,
      sku: 'HOS-DRS-004',
      bestseller: true,
      newArrival: false,
      featured: true
    },
    {
      name: 'Sienna Resort Set',
      slug: 'sienna-resort-set',
      price: 21900,
      discount: 15, // 15% off
      images: [
        '/images/coords_sienna_1.jpg',
        '/images/coords_sienna_2.jpg'
      ],
      description: 'Flowing linen-silk blend button-up shirt and relaxed-leg pleated shorts set. Ideal for holiday ease and resort-style luxury, featuring breathable natural fibers.',
      details: '• Oversized drop-shoulder shirt\n• Elasticated paperbag waist shorts\n• French seam detailing\n• Linen-silk blend\n• Machine wash cold, line dry',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Terracotta', 'Warm Ivory'],
      category: 'Co-ords',
      collections: ['Resort', 'Vacation', 'Weekend'],
      occasions: ['Vacation', 'Brunch'],
      inventory: 25,
      rating: 4.6,
      sku: 'HOS-CRD-005',
      bestseller: false,
      newArrival: true,
      featured: false
    },
    {
      name: 'Celeste Pleated Gown',
      slug: 'celeste-pleated-gown',
      price: 34900,
      discount: 0,
      images: [
        '/images/dresses_aurelia_1.jpg',
        '/images/dresses_monroe_1.jpg'
      ],
      description: 'An ethereal gown featuring micro-pleated chiffon, a high halter neck, and cascading tiers that flow beautifully with every movement.',
      details: '• High halter neck with satin tie ribbon\n• Tiered micro-pleat skirt\n• Open back styling\n• Premium georgette-chiffon\n• Dry clean only',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Sky Blue', 'Champagne Gold'],
      category: 'Gowns',
      collections: ['Evening', 'Limited Edition', 'New Season'],
      occasions: ['Evening', 'Wedding Guest', 'Party'],
      inventory: 5,
      rating: 4.9,
      sku: 'HOS-GWN-006',
      bestseller: true,
      newArrival: true,
      featured: true
    },
    {
      name: 'Classic Silk Camisole',
      slug: 'classic-silk-camisole',
      price: 8900,
      discount: 0,
      images: [
        '/images/tops_camisole_1.jpg',
        '/images/tops_camisole_2.jpg'
      ],
      description: 'An essential layering luxury. Pure mulberry silk camisole featuring adjustable shoulder straps and a delicate, bias-cut silhouette that skims the figure.',
      details: '• V-neckline front and back\n• Adjustable thin straps\n• 19mm pure mulberry silk\n• Side-slit details\n• Hand wash cold',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Off White', 'Charcoal', 'Soft Beige'],
      category: 'Tops',
      collections: ['New Season', 'Weekend', 'Vacation'],
      occasions: ['Brunch', 'Vacation', 'Workwear'],
      inventory: 30,
      rating: 4.5,
      sku: 'HOS-TOP-007',
      bestseller: true,
      newArrival: false,
      featured: false
    },
    {
      name: 'Celine Tailored Trousers',
      slug: 'celine-tailored-trousers',
      price: 14500,
      discount: 0,
      images: [
        '/images/trousers_celine_1.jpg',
        '/images/coords_simone_1.jpg'
      ],
      description: 'High-waisted, wide-leg trousers cut from premium structural wool-blend crepe. Featuring sharp front pleats and side slip pockets for a relaxed yet commanding profile.',
      details: '• Wide leg drape\n• Double hook-and-bar zip fly\n• Functional side pockets\n• Mid-weight wool-crepe blend\n• Dry clean recommended',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Charcoal', 'Beige'],
      category: 'Trousers',
      collections: ['Workwear', 'Evening', 'New Season'],
      occasions: ['Workwear', 'Brunch', 'Evening'],
      inventory: 18,
      rating: 4.7,
      sku: 'HOS-TRS-008',
      bestseller: false,
      newArrival: false,
      featured: false
    }
  ];

  const seededProducts = [];
  for (const product of products) {
    const item = await db.products.insertOne(product);
    seededProducts.push(item);
  }
  console.log('Products seeded successfully:', seededProducts.length);

  // Seed Coupons
  await db.coupons.insertOne({
    code: 'HOS10',
    type: 'percentage',
    value: 10,
    minOrderValue: 15000,
    expiryDate: '2027-12-31',
    usageLimit: 100,
    usageCount: 0,
    active: true
  });

  await db.coupons.insertOne({
    code: 'WELCOME5000',
    type: 'fixed',
    value: 5000,
    minOrderValue: 30000,
    expiryDate: '2027-12-31',
    usageLimit: 50,
    usageCount: 0,
    active: true
  });
  console.log('Coupons seeded successfully');

  // Seed Reviews
  const reviews = [
    {
      productId: seededProducts[0]._id, // Aurelia Draped Dress
      rating: 5,
      title: 'Absolutely Stunning',
      text: 'The drape and quality of silk satin is unmatched. It fits like a dream and is perfect for formal evenings. Looking forward to buying more colors.',
      customerName: 'Meera Sen',
      verified: true
    },
    {
      productId: seededProducts[0]._id,
      rating: 4,
      title: 'Beautiful but long',
      text: 'Elegant gown, very classy. I had to get it hemmed slightly for my height (5\'4\"), but otherwise it is beautiful and feels premium.',
      customerName: 'Rohini R.',
      verified: true
    },
    {
      productId: seededProducts[1]._id, // Simone Tailored Co-Ord
      rating: 5,
      title: 'Power Suit Perfection',
      text: 'The structure of the blazer is incredible. Wide trousers drape beautifully. Highly recommend this for important work presentations or luxury evening brunch.',
      customerName: 'Aditi Sharma',
      verified: true
    }
  ];

  for (const review of reviews) {
    await db.reviews.insertOne(review);
  }
  console.log('Reviews seeded successfully');

  console.log('Seed completed successfully!');
}

// Run if file is run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('seed.js')) {
  seed().catch(err => {
    console.error('Error during seed:', err);
  });
}

export { seed };
