import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext.jsx';
import { Ruler, RefreshCw, Sparkles, Mail } from 'lucide-react';

export default function BrandStory() {
  const { cmsData } = useCMS();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('heritage'); // 'heritage', 'sizing', 'returns'

  return (
    <section className="py-24 bg-atelier-rose px-4 md:px-8 font-sans border-t border-luxury-charcoal/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left Side: Editorial Image */}
        <div className="aspect-[4/5] overflow-hidden bg-luxury-beige rounded-sm shadow-xs relative">
          <img
            src={cmsData.brandStory?.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"}
            alt="HOS Atelier Craftsmanship"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-103"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-luxury-nearblack/80 backdrop-blur-sm p-4 text-white rounded-sm border border-white/10 hidden sm:block">
            <p className="text-[10px] uppercase tracking-luxury text-luxury-champagne font-semibold">House of Simons Atelier</p>
            <p className="text-xs font-serif text-white/90 mt-1 italic">
              "Every silhouette is tailored with our own proprietary formula for grace, comfort, and uncompromising fit."
            </p>
          </div>
        </div>

        {/* Right Side: Tabbed About Section */}
        <div className="flex flex-col justify-center space-y-6 md:pr-6">

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-luxury-charcoal/10 pb-2 space-x-6">
            <button
              onClick={() => setActiveTab('heritage')}
              className={`text-xs uppercase tracking-luxury pb-2 border-b-2 transition-all font-medium flex items-center space-x-1.5 ${activeTab === 'heritage'
                  ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
                  : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
                }`}
            >
              <Sparkles size={13} />
              <span>Our Heritage</span>
            </button>
            <button
              onClick={() => setActiveTab('sizing')}
              className={`text-xs uppercase tracking-luxury pb-2 border-b-2 transition-all font-medium flex items-center space-x-1.5 ${activeTab === 'sizing'
                  ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
                  : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
                }`}
            >
              <Ruler size={13} />
              <span>Sizing</span>
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`text-xs uppercase tracking-luxury pb-2 border-b-2 transition-all font-medium flex items-center space-x-1.5 ${activeTab === 'returns'
                  ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
                  : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
                }`}
            >
              <RefreshCw size={13} />
              <span>Exchange & Returns</span>
            </button>
          </div>

          {/* TAB 1: HERITAGE */}
          {activeTab === 'heritage' && (
            <div className="space-y-4 fade-in-up">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
                THE HOS HERITAGE
              </span>

              <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-wide">
                {cmsData.brandStory?.heading || "THE HOS"}
              </h2>

              <p className="text-sm text-luxury-muted font-light leading-relaxed">
                {cmsData.brandStory?.text || "House of Simons creates contemporary fashion for women who value individuality, craftsmanship and effortless elegance."}
              </p>

              <p className="text-xs text-luxury-muted font-light leading-relaxed">
                Every garment begins with a vision of structural grace, hand-sketched in our studios and tailored to perfection using the finest breathable silks, rich linen, and structural crepes. We believe that fashion is a form of self-expression, designed to command confidence in any room.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => navigate('/about?tab=story')}
                  className="bg-transparent hover:bg-luxury-charcoal text-luxury-charcoal hover:text-luxury-ivory border border-luxury-charcoal px-8 py-3.5 text-xs uppercase tracking-luxury font-medium transition-all duration-500 rounded-sm"
                >
                  DISCOVER OUR STORY
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIZING */}
          {activeTab === 'sizing' && (
            <div className="space-y-4 fade-in-up">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
                Updated SIZING for HOUSE OF SIMONS
              </span>

              <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-wide">
                SIZING
              </h2>

              <div className="bg-white p-5 border border-luxury-charcoal/10 rounded-sm space-y-3 text-xs text-luxury-charcoal/90 font-light leading-relaxed">
                <p>
                  We use our own formula for sizing. Garments are made in sizes that are suited for that particular style. Discretion to assign sizes to each style is our own. Our sizes cater to body measurements corresponding to UK size 6 to 18. Many of our styles are made in a <strong className="font-semibold text-luxury-charcoal italic">free size, one size fits all, max plus sizes or can be customised!</strong>
                </p>
                <p>
                  Yes, a petite size person, as well as a plus size person can wear our free size garments. For further assistance, do take some time to read our size instruction that accompanies every style displayed on this site. We are happy to clarify your queries, if any, about specific measurements / sizes etc. if you email us, before you decide to make your purchase.
                </p>
                <p className="font-serif text-sm tracking-wider uppercase text-luxury-champagne font-semibold pt-1">
                  thank you
                </p>
              </div>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => navigate('/about?tab=sizing')}
                  className="bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-champagne px-7 py-3 text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm"
                >
                  VIEW FULL SIZE GUIDE
                </button>
                <a
                  href="mailto:online@houseofsimons.com"
                  className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-charcoal font-semibold underline flex items-center space-x-1"
                >
                  <Mail size={13} />
                  <span>Email Size Query</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: EXCHANGE & RETURNS */}
          {activeTab === 'returns' && (
            <div className="space-y-4 fade-in-up">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
                EXCHANGE & RETURNS for HOUSE OF SIMONS
              </span>

              <h2 className="editorial-title-md text-luxury-charcoal uppercase tracking-wide">
                EXCHANGE & RETURNS
              </h2>

              <div className="bg-white p-5 border border-luxury-charcoal/10 rounded-sm space-y-2.5 text-xs text-luxury-charcoal/90 font-light leading-relaxed">
                <p>
                  Please take some time to read the detailed style description and size instructions accompanying each product and further details on our Questions page. We are happy to clarify your queries, if any, about specific measurements/sizes etc. if you email us, before you decide to make your purchase.
                </p>
                <p className="font-medium text-red-900 bg-red-50 p-2 rounded">
                  Only domestic orders are eligible for exchange or return. Overseas orders cannot be exchanged or returned.
                </p>
                <p className="text-[11px] text-luxury-muted">
                  <strong>Domestic window:</strong> 2 days from delivery to initiate exchange/return via <strong className="text-luxury-charcoal">online@houseofsimons.com</strong>. Return piece must reach our Noida atelier within 5 days.
                </p>
                <p className="text-[11px] text-luxury-muted">
                  <strong>Notice:</strong> Our store is closed on Sundays.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/about?tab=returns')}
                  className="bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-champagne px-7 py-3 text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm"
                >
                  READ RETURN POLICY
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
