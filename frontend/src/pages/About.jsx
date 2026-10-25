import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, MapPin, Clock, ShieldAlert, CheckCircle2, Ruler, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext.jsx';
import SizeGuideModal from '../components/SizeGuideModal.jsx';

export default function About() {
  const location = useLocation();
  const { cmsData } = useCMS();
  const [activeTab, setActiveTab] = useState('story'); // 'story', 'sizing', 'returns'
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['story', 'sizing', 'returns'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (location.hash === '#sizing') {
      setActiveTab('sizing');
    } else if (location.hash === '#returns') {
      setActiveTab('returns');
    }
  }, [location]);

  return (
    <div className="bg-atelier-rose/50 font-sans min-h-screen">
      {/* Top Editorial Banner */}
      <section className="bg-luxury-nearblack text-luxury-ivory py-20 px-4 md:px-8 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-champagne font-semibold">
            HOUSE OF SIMONS CLIENT SERVICES
          </span>
          <h1 className="editorial-title-md text-white uppercase tracking-widest font-normal">
            About & Atelier Guide
          </h1>
          <p className="text-xs text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Discover our brand heritage, our proprietary sizing formula, and our dedicated domestic exchange and return policies.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-[60px] md:top-[69px] z-30 bg-luxury-ivory/95 backdrop-blur-md border-b border-luxury-charcoal/10">
        <div className="max-w-4xl mx-auto flex justify-center space-x-2 md:space-x-8 px-4 py-3">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-4 py-2 text-xs uppercase tracking-luxury font-medium transition-all border-b-2 ${activeTab === 'story'
              ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
              : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
              }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`px-4 py-2 text-xs uppercase tracking-luxury font-medium transition-all border-b-2 ${activeTab === 'sizing'
              ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
              : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
              }`}
          >
            Sizing Guide
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 text-xs uppercase tracking-luxury font-medium transition-all border-b-2 ${activeTab === 'returns'
              ? 'border-luxury-charcoal text-luxury-charcoal font-semibold'
              : 'border-transparent text-luxury-muted hover:text-luxury-charcoal'
              }`}
          >
            Exchange & Returns
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">

        {/* TAB 1: OUR STORY */}
        {activeTab === 'story' && (
          <div className="space-y-12 fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="aspect-[4/5] overflow-hidden bg-luxury-beige rounded-sm shadow-sm">
                <img
                  src={cmsData.brandStory?.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"}
                  alt="HOS Atelier Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-5">
                <span className="text-[10px] uppercase tracking-widest text-luxury-champagne font-semibold">
                  THE HOS PHILOSOPHY
                </span>
                <h2 className="font-serif text-3xl uppercase tracking-wider text-luxury-charcoal">
                  {cmsData.brandStory?.heading || "House of Simons"}
                </h2>
                <p className="text-xs md:text-sm text-luxury-muted font-light leading-relaxed">
                  {cmsData.brandStory?.text || "House of Simons creates contemporary fashion for women who value individuality, craftsmanship and effortless elegance."}
                </p>
                <p className="text-xs md:text-sm text-luxury-muted font-light leading-relaxed">
                  Every garment begins with a vision of structural grace, hand-sketched in our studios and tailored to perfection using the finest breathable silks, rich linen, and structural crepes. We believe that fashion is a form of self-expression, designed to command confidence in any room.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('sizing')}
                    className="bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-champagne px-6 py-3 text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm"
                  >
                    Explore Sizing Formula
                  </button>
                  <button
                    onClick={() => setActiveTab('returns')}
                    className="border border-luxury-charcoal text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white px-6 py-3 text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm"
                  >
                    View Return Policies
                  </button>
                </div>
              </div>
            </div>

            {/* Atelier Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-luxury-charcoal/10">
              <div className="bg-white p-6 border border-luxury-charcoal/5 rounded-sm space-y-2">
                <Sparkles size={20} className="text-luxury-champagne" />
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">Couture Precision</h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Refined garment architecture tailored by seasoned artisans with an eye for drape and drape longevity.
                </p>
              </div>
              <div className="bg-white p-6 border border-luxury-charcoal/5 rounded-sm space-y-2">
                <Ruler size={20} className="text-luxury-champagne" />
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">Adaptive Sizing</h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Garments designed with custom formulas catering to UK 6 through 18, free sizes, and bespoke adjustments.
                </p>
              </div>
              <div className="bg-white p-6 border border-luxury-charcoal/5 rounded-sm space-y-2">
                <RefreshCw size={20} className="text-luxury-champagne" />
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">Client Support</h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Personalized size consultation and direct customer assistance prior to finalizing your order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPDATED SIZING FOR HOUSE OF SIMONS */}
        {activeTab === 'sizing' && (
          <div className="space-y-10 fade-in-up">

            {/* Header Box */}
            <div className="border-b border-luxury-charcoal/10 pb-6">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block mb-1">
                Updated SIZING for HOUSE OF SIMONS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wider text-luxury-charcoal font-normal">
                SIZING
              </h2>
            </div>

            {/* Official Narrative Callout Box */}
            <div className="bg-white p-6 md:p-10 border border-luxury-charcoal/10 rounded-sm shadow-xs space-y-6">
              <div className="space-y-4 text-xs md:text-sm text-luxury-charcoal/90 font-light leading-relaxed">
                <p>
                  We use our own formula for sizing. Garments are made in sizes that are suited for that particular style. Discretion to assign sizes to each style is our own. Our sizes cater to body measurements corresponding to UK size 6 to 18. Many of our styles are made in a <strong className="font-semibold text-luxury-charcoal italic">free size, one size fits all, max plus sizes or can be customised!</strong>
                </p>
                <p>
                  Yes, a petite size person, as well as a plus size person can wear our free size garments. For further assistance, do take some time to read our size instruction that accompanies every style displayed on this site. We are happy to clarify your queries, if any, about specific measurements / sizes etc. if you email us, before you decide to make your purchase.
                </p>
                <p className="font-serif text-sm tracking-wider uppercase text-luxury-champagne font-semibold pt-2">
                  thank you
                </p>
              </div>

              {/* Inquiry Action */}
              <div className="pt-4 border-t border-luxury-charcoal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 text-xs text-luxury-muted">
                  <Mail size={16} className="text-luxury-champagne flex-none" />
                  <span>Queries: <a href="mailto:online@houseofsimons.com" className="text-luxury-charcoal font-semibold underline">online@houseofsimons.com</a></span>
                </div>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-champagne px-5 py-2.5 text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm flex items-center space-x-2"
                >
                  <Ruler size={14} />
                  <span>View Measurement Table</span>
                </button>
              </div>
            </div>

            {/* Key Sizing Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-luxury-beige/40 p-6 border-l-2 border-luxury-champagne rounded-r space-y-2">
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">
                  Proprietary Formula
                </h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Every silhouette is engineered with style-specific ease and structure. Discretion to assign specific proportions belongs to our atelier to honor the drape of each distinct fabric.
                </p>
              </div>
              <div className="bg-luxury-beige/40 p-6 border-l-2 border-luxury-champagne rounded-r space-y-2">
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">
                  UK 6 to 18 & Free Size
                </h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Our designs comfortably flatter body dimensions across UK 6 to 18. Free size garments accommodate both petite and plus size physiques with fluid elegance.
                </p>
              </div>
              <div className="bg-luxury-beige/40 p-6 border-l-2 border-luxury-champagne rounded-r space-y-2">
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">
                  Customisation Services
                </h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Need custom adjustments for length, bust, or waist? Contact our atelier before purchasing to discuss bespoke tailor-fit options.
                </p>
              </div>
              <div className="bg-luxury-beige/40 p-6 border-l-2 border-luxury-champagne rounded-r space-y-2">
                <h3 className="font-serif text-base uppercase tracking-wider text-luxury-charcoal font-semibold">
                  Pre-Purchase Assistance
                </h3>
                <p className="text-xs text-luxury-muted font-light leading-relaxed">
                  Avoid exchange delays by emailing our stylists beforehand. We provide exact garment measurement details to guarantee the perfect fit.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: EXCHANGE & RETURNS FOR HOUSE OF SIMONS */}
        {activeTab === 'returns' && (
          <div className="space-y-10 fade-in-up">

            {/* Header Box */}
            <div className="border-b border-luxury-charcoal/10 pb-6">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block mb-1">
                EXCHANGE & RETURNS for HOUSE OF SIMONS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wider text-luxury-charcoal font-normal">
                EXCHANGE & RETURNS
              </h2>
            </div>

            {/* Intro & Pre-Purchase Queries */}
            <div className="bg-white p-6 md:p-8 border border-luxury-charcoal/10 rounded-sm space-y-4 text-xs md:text-sm text-luxury-charcoal/90 font-light leading-relaxed">
              <p>
                Please take some time to read the detailed style description and size instructions accompanying each product and further details on our <Link to="/questions" className="text-luxury-charcoal underline underline-offset-2">Questions page</Link>. We are happy to clarify your queries, if any, about specific measurements/sizes etc. if you email us, before you decide to make your purchase.
              </p>
              <div className="p-4 bg-red-50/70 border border-red-200/60 rounded-sm text-red-900 text-xs font-normal">
                <strong>Domestic Orders Only:</strong> Only domestic orders are eligible for exchange or return. We are sorry to inform you that overseas orders cannot be exchanged or returned.
              </div>
            </div>

            {/* Timelines and Initiation Steps */}
            <div className="space-y-6">
              <h3 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal font-semibold">
                Exchange & Return Guidelines
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 2-Day Initiation Notice */}
                <div className="bg-white p-6 border border-luxury-charcoal/10 rounded-sm space-y-3">
                  <div className="flex items-center space-x-2 text-luxury-champagne">
                    <Clock size={18} />
                    <span className="text-xs uppercase tracking-luxury font-semibold text-luxury-charcoal">2-Day Initiation Window</span>
                  </div>
                  <p className="text-xs text-luxury-muted font-light leading-relaxed">
                    In case of domestic orders, you have <strong>2 days</strong> from the date you receive your item(s), to initiate an exchange or a return, beyond which, we will not be able to accept or process your request.
                  </p>
                  <p className="text-xs text-luxury-charcoal font-medium">
                    Send your specific Exchange/Return request to:
                    <a href="mailto:online@houseofsimons.com" className="block text-luxury-champagne underline mt-1">
                      online@houseofsimons.com
                    </a>
                  </p>
                </div>

                {/* 5-Day Delivery Window */}
                <div className="bg-white p-6 border border-luxury-charcoal/10 rounded-sm space-y-3">
                  <div className="flex items-center space-x-2 text-luxury-champagne">
                    <ShieldAlert size={18} />
                    <span className="text-xs uppercase tracking-luxury font-semibold text-luxury-charcoal">5-Day Return Transit Rule</span>
                  </div>
                  <p className="text-xs text-luxury-muted font-light leading-relaxed">
                    The item(s) must be in an <strong>absolute unused and undamaged condition</strong> accompanied by the original tags and protective packaging, failing which, we will not be able to process your exchange or return request.
                  </p>
                  <p className="text-xs text-red-800 font-normal">
                    If the returned item does not reach us within <strong>5 days</strong> of initiation of the return/exchange process, we will not be able to accept or refund you for your returned piece.
                  </p>
                </div>

              </div>
            </div>

            {/* Return Shipping Address Card */}
            <div className="bg-luxury-beige/60 p-6 md:p-8 border border-luxury-charcoal/10 rounded-sm space-y-4">
              <div className="flex items-center space-x-2 text-luxury-charcoal">
                <MapPin size={20} className="text-luxury-champagne flex-none" />
                <h4 className="font-serif text-base uppercase tracking-wider font-semibold">Atelier Return Shipping Address</h4>
              </div>
              <p className="text-xs text-luxury-muted leading-relaxed font-light">
                You may exchange an item for another colour / size in the same style OR any other style. If your request can be fulfilled, we will send you an email stating our acceptance of your request. You may then ship the return item(s) to our address:
              </p>
              <div className="bg-white p-5 border border-luxury-charcoal/10 rounded font-mono text-xs text-luxury-charcoal space-y-1">
                <p className="font-bold font-serif text-sm text-luxury-charcoal tracking-wide">House of Simons</p>
                <p>A-16, 17, Sec-59, Noida, UP, India</p>
                <p>Ph: +91-XXXXXXXXXX</p>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-luxury-charcoal/80 bg-luxury-champagne/15 px-3 py-2 rounded">
                <Clock size={14} className="text-luxury-champagne" />
                <span><strong>Store Notice:</strong> Our store is closed on Sundays. This is for your information.</span>
              </div>
            </div>

            {/* Financial Settlement & Timeline Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-luxury-muted leading-relaxed font-light">
              <div className="bg-white p-6 border border-luxury-charcoal/10 rounded-sm space-y-3">
                <h4 className="font-serif text-sm uppercase tracking-wider text-luxury-charcoal font-semibold">Exchange Shipment & Fare</h4>
                <p>
                  We will ship your exchange item(s) within <strong>7 working days</strong> of our receipt of your returned item. The shipping charges for the exchange item will have to be borne by you.
                </p>
                <p>
                  • If the value of the exchange item is less than the returned item, we will deduct the exchange shipping fee and the value of the exchange item(s) and refund the balance to you.
                </p>
                <p>
                  • If the value of the exchange item(s) exceeds the returned item(s), you will be requested to make a bank transfer for the same.
                </p>
                <p className="font-medium text-luxury-charcoal pt-1">
                  There will be no further exchange or return on an exchanged item(s).
                </p>
              </div>

              <div className="bg-white p-6 border border-luxury-charcoal/10 rounded-sm space-y-3">
                <h4 className="font-serif text-sm uppercase tracking-wider text-luxury-charcoal font-semibold">Refunds & Exclusions</h4>
                <p>
                  In case of a return, the conditions are the same as mentioned above. We will send you a refund within <strong>2 working days</strong> of our receipt of your returned item(s).
                </p>
                <p>
                  • We will not be able to refund you the shipping fee charged to you at the time of initial purchase.
                </p>
                <div className="p-3 bg-luxury-beige/70 border-l-2 border-luxury-charcoal rounded text-[11px] text-luxury-charcoal">
                  <strong>Limited Editions:</strong> Some items will not be eligible for Returns or Exchange as they are a limited edition. We will specify this clearly in the details that accompany that particular product.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Embedded Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeModalOpen} onClose={() => setIsSizeModalOpen(false)} />
    </div>
  );
}
