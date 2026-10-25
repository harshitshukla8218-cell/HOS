import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Ruler, RefreshCw, Sparkles, MapPin, Clock, ShieldAlert } from 'lucide-react';

export default function ProductAccordion({ product, onOpenSizeGuide }) {
  // Toggle state for the 7 sections
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <div className="border-t border-luxury-charcoal/15 mt-8 font-sans">

      {/* 1. ABOUT THE CLOTH */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('aboutCloth')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          ABOUT THE CLOTH
        </button>
        {openSections.aboutCloth && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-3 fade-in-up">
            <p className="text-luxury-charcoal/90">
              {product?.description || "An exquisitely tailored luxury silhouette designed with structural grace and fluid drape."}
            </p>
            {product?.details && (
              <div className="bg-luxury-beige/40 p-4 rounded-sm border-l-2 border-luxury-champagne">
                <p className="text-[10px] uppercase tracking-luxury text-luxury-charcoal font-semibold mb-2">
                  Atelier Craftsmanship & Construction:
                </p>
                <pre className="font-sans whitespace-pre-line text-luxury-muted text-xs leading-relaxed">
                  {product.details}
                </pre>
              </div>
            )}
            <p className="text-[11px] italic text-luxury-muted">
              Woven from ethically sourced, breathable fibers for enduring comfort and commanding presence.
            </p>
          </div>
        )}
      </div>

      {/* 2. SIZING */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('sizing')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          SIZING
        </button>
        {openSections.sizing && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-4 fade-in-up">
            <div className="text-center pb-2 border-b border-luxury-charcoal/10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
                Updated SIZING for HOUSE OF SIMONS
              </span>
              <h4 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mt-0.5">
                SIZING
              </h4>
            </div>

            <p className="text-luxury-charcoal/90 leading-relaxed">
              We use our own formula for sizing. Garments are made in sizes that are suited for that particular style. Discretion to assign sizes to each style is our own. Our sizes cater to body measurements corresponding to UK size 6 to 18. Many of our styles are made in a <strong className="font-semibold text-luxury-charcoal italic">free size, one size fits all, max plus sizes or can be customised!</strong>
            </p>

            <p className="text-luxury-charcoal/90 leading-relaxed">
              Yes, a petite size person, as well as a plus size person can wear our free size garments. For further assistance, do take some time to read our size instruction that accompanies every style displayed on this site. We are happy to clarify your queries, if any, about specific measurements / sizes etc. if you email us, before you decide to make your purchase.
            </p>

            <p className="font-serif text-xs tracking-wider uppercase text-luxury-champagne font-semibold text-center">
              thank you
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-luxury-charcoal/10">
              {onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="w-full sm:w-auto bg-luxury-charcoal text-luxury-ivory hover:bg-luxury-champagne px-4 py-2.5 text-[11px] uppercase tracking-luxury font-medium transition-colors rounded-sm flex items-center justify-center space-x-1.5"
                >
                  <Ruler size={13} />
                  <span>View Measurement Chart</span>
                </button>
              )}
              <a
                href="mailto:online@houseofsimons.com"
                className="text-[11px] text-luxury-charcoal hover:text-luxury-champagne font-medium underline flex items-center space-x-1"
              >
                <Mail size={12} className="text-luxury-champagne" />
                <span>Queries: online@houseofsimons.com</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. STYLING */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('styling')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          STYLING
        </button>
        {openSections.styling && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-3 fade-in-up">
            <p className="font-serif text-sm uppercase tracking-wider text-luxury-charcoal font-semibold">
              Curated Atelier Styling Edit
            </p>
            <ul className="space-y-2 text-luxury-charcoal/90">
              <li className="flex items-start space-x-2">
                <span className="text-luxury-champagne font-bold">•</span>
                <span><strong>Editorial Evenings:</strong> Pair with sculptural gold or silver jewelry and minimal strappy heels to accent the drape.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-luxury-champagne font-bold">•</span>
                <span><strong>Day-to-Night Versatility:</strong> Layer over a structured monochrome tailored blazer with sleek loafers or pointed ankle boots.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-luxury-champagne font-bold">•</span>
                <span><strong>Finishing Touch:</strong> Complement with a structured micro clutch and clean, swept-back hair for timeless elegance.</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 4. WASH & CARE */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('washCare')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          WASH & CARE
        </button>
        {openSections.washCare && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-2.5 fade-in-up">
            <p>• <strong>Dry Clean Only:</strong> Specialist dry cleaning is strongly advised to maintain the structural integrity, fabric luster, and bespoke drape.</p>
            <p>• <strong>Ironing:</strong> Low temperature iron or steam on the reverse side only. Do not apply direct hot iron to delicate satin or pleated details.</p>
            <p>• <strong>Bleach & Tumble Dry:</strong> Do not bleach. Do not tumble dry.</p>
            <p>• <strong>Storage:</strong> Store on a wide, padded garment hanger inside a breathable garment cover away from direct sun exposure.</p>
          </div>
        )}
      </div>

      {/* 5. ABOUT US */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('aboutUs')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          ABOUT US
        </button>
        {openSections.aboutUs && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-3 fade-in-up">
            <span className="text-[10px] uppercase tracking-widest text-luxury-champagne font-semibold block">
              HOUSE OF SIMONS
            </span>
            <p className="text-luxury-charcoal/90">
              House of Simons creates contemporary luxury silhouettes designed for women who define their own style. Effortless elegance, uncompromising quality, and sculptural grace define every piece we create.
            </p>
            <p>
              Each garment begins in our design studios and is brought to life by master craftspeople using heritage textiles.
            </p>
            <div className="pt-1">
              <Link
                to="/about?tab=story"
                className="text-luxury-champagne hover:text-luxury-charcoal underline text-[11px] font-semibold uppercase tracking-luxury inline-block"
              >
                Discover Our Full Heritage Story →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 6. SHIPPING */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('shipping')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          SHIPPING
        </button>
        {openSections.shipping && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-3 fade-in-up">
            <div className="space-y-1.5">
              <p><strong>Domestic Shipping:</strong> Complimentary express courier delivery across India on orders above ₹15,000. Standard orders deliver in <strong>3–5 working days</strong>.</p>
              <p><strong>International Shipping:</strong> Worldwide express delivery available via DHL Express (deliveries within <strong>7–10 working days</strong>).</p>
              <p><strong>Bespoke Packaging:</strong> Every piece is encased in protective acid-free tissue paper, custom garment cover, and rigid HOS gift box.</p>
              <p><strong>Dispatch Updates:</strong> Real-time tracking and dispatch updates sent directly to your SMS and email.</p>
            </div>
          </div>
        )}
      </div>

      {/* 7. EXCHANGE & RETURNS */}
      <div className="border-b border-luxury-charcoal/15">
        <button
          type="button"
          onClick={() => toggleSection('exchangeReturns')}
          className="w-full py-4 text-center text-xs md:text-[13px] tracking-[0.2em] font-normal uppercase text-luxury-charcoal hover:text-luxury-champagne transition-colors block select-none"
        >
          EXCHANGE & RETURNS
        </button>
        {openSections.exchangeReturns && (
          <div className="pb-6 pt-1 px-2 md:px-4 text-xs text-luxury-muted font-light leading-relaxed space-y-3.5 fade-in-up">

            <div className="text-center pb-2 border-b border-luxury-charcoal/10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-champagne font-semibold block">
                EXCHANGE & RETURNS for HOUSE OF SIMONS
              </span>
              <h4 className="font-serif text-lg uppercase tracking-wider text-luxury-charcoal mt-0.5">
                EXCHANGE & RETURNS
              </h4>
            </div>

            <p className="text-luxury-charcoal/90">
              Please take some time to read the detailed style description and size instructions accompanying each product and further details on our <Link to="/questions" className="text-luxury-charcoal underline underline-offset-2">Questions page</Link>. We are happy to clarify your queries, if any, about specific measurements/sizes etc. if you email us, before you decide to make your purchase.
            </p>

            <div className="p-3 bg-red-50 text-red-900 border border-red-200/80 rounded-sm font-medium">
              Only domestic orders are eligible for exchange or return. We are sorry to inform you that overseas orders cannot be exchanged or returned.
            </div>

            <div className="space-y-2 text-luxury-charcoal/90">
              <p>
                In case of domestic orders, you have <strong>2 days</strong> from the date you receive your item(s), to initiate an exchange or a return, beyond which, we will not be able to accept or process your request. You will need to send us a message with your specific Exchange/Return request to our email address:
              </p>
              <a href="mailto:online@houseofsimons.com" className="font-semibold text-luxury-champagne underline block">
                online@houseofsimons.com
              </a>
              <p>
                You may exchange an item for another colour / size in the same style OR any other style. If your request can be fulfilled, we will send you an email stating our acceptance of your request.
              </p>
            </div>

            {/* Atelier Address Card */}
            <div className="bg-luxury-beige/50 p-4 border border-luxury-charcoal/10 rounded-sm space-y-2">
              <p className="font-semibold text-luxury-charcoal">You may then ship the return item(s) to our address:</p>
              <div className="font-mono text-xs text-luxury-charcoal bg-white p-3 border border-luxury-charcoal/10 rounded">
                <p className="font-serif font-bold text-sm">House of Simons</p>
                <p>A-16, 17, Sec-59, Noida, UP, India</p>
                <p>Ph: +91-XXXXXXXXXX</p>
              </div>
              <p className="text-[11px] text-luxury-charcoal font-medium bg-luxury-champagne/15 px-2.5 py-1.5 rounded">
                Our store is closed on Sundays. This is for your information.
              </p>
            </div>

            <div className="space-y-2 text-luxury-charcoal/90">
              <p>
                The item(s) must be in an absolute unused and undamaged condition accompanied by the original tags and protective packaging, failing which, we will not be able to process your exchange or return request. If the returned item does not reach us within <strong>5 days</strong> of initiation of the return/exchange process, we will not be able to accept or refund you for your returned piece.
              </p>
              <p>
                We will ship your exchange item(s) within <strong>7 working days</strong> of our receipt of your returned item. The shipping charges for the exchange item will have to be borne by you. If the value of the exchange item is less than the returned item, we will deduct the exchange shipping fee and the value of the exchange item(s) and refund the balance to you. If the value of the exchange item(s) you have requested exceeds the value of the returned item(s), you will be requested to make a bank transfer for the same.
              </p>
              <p className="font-medium text-luxury-charcoal">
                There will be no further exchange or return on an exchanged item(s).
              </p>
              <p>
                In case of a return, the conditions are same as mentioned above. We will send you a refund within <strong>2 working days</strong> of our receipt of your returned item(s). We will not be able to refund you the shipping fee charged to you at the time of initial purchase.
              </p>
              <p className="text-[11px] italic text-luxury-muted">
                Some items will not be eligible for Returns or Exchange as they are a limited edition. We will specify this clearly in the details that accompany that particular product.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about?tab=returns"
                className="text-luxury-champagne hover:text-luxury-charcoal underline text-[11px] font-semibold uppercase tracking-luxury inline-block"
              >
                View Full Exchange & Return Documentation →
              </Link>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
