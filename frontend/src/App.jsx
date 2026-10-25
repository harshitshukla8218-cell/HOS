import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CMSProvider } from './context/CMSContext.jsx';

// Common Components
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CoutureAssistant from './components/CoutureAssistant.jsx';

// Pages
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Account from './pages/Account.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import About from './pages/About.jsx';
import Questions from './pages/Questions.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CMSProvider>
            <CartProvider>

              {/* Entire visual shell layout */}
              <div className="flex flex-col min-h-screen bg-luxury-ivory text-luxury-charcoal selection:bg-luxury-beige">

                {/* 1. Header & Announcements */}
                <AnnouncementBar />
                <Header />

                {/* 2. Side Trays */}
                <CartDrawer />
                <CoutureAssistant />

                {/* 3. Main Views Router Grid */}
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/questions" element={<Questions />} />
                    <Route path="/admin-panel-direct" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* 4. Footer */}
                <Footer />

              </div>

            </CartProvider>
          </CMSProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}
