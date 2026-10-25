import React, { useState } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('INCHES'); // 'INCHES' or 'CM'

  if (!isOpen) return null;

  const measurements = [
    { size: 'XS', bust: 32, waist: 24, hip: 34, length: 35 },
    { size: 'S',  bust: 34, waist: 26, hip: 36, length: 35.5 },
    { size: 'M',  bust: 36, waist: 28, hip: 38, length: 36 },
    { size: 'L',  bust: 38, waist: 30, hip: 40, length: 36.5 },
    { size: 'XL', bust: 40, waist: 32, hip: 42, length: 37 },
    { size: 'XXL',bust: 42, waist: 34, hip: 44, length: 37.5 }
  ];

  const formatVal = (val) => {
    if (unit === 'CM') {
      return Math.round(val * 2.54);
    }
    return val;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative bg-luxury-ivory w-full max-w-2xl p-6 md:p-8 shadow-2xl border border-luxury-charcoal/5 z-10 rounded-sm max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-luxury-charcoal/70 hover:text-luxury-charcoal"
          aria-label="Close size guide"
        >
          <X strokeWidth={1} size={24} />
        </button>

        {/* Title */}
        <div className="border-b border-luxury-charcoal/10 pb-4 mb-6">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-luxury-champagne font-semibold block mb-1">
            Updated SIZING for HOUSE OF SIMONS
          </span>
          <h3 className="font-serif text-2xl uppercase tracking-luxury text-luxury-charcoal font-semibold">
            SIZING
          </h3>
        </div>

        {/* Official Atelier Sizing Statement */}
        <div className="bg-white p-5 border border-luxury-charcoal/10 rounded-sm mb-6 space-y-3 text-xs text-luxury-charcoal/90 font-light leading-relaxed">
          <p>
            We use our own formula for sizing. Garments are made in sizes that are suited for that particular style. Discretion to assign sizes to each style is our own. Our sizes cater to body measurements corresponding to UK size 6 to 18. Many of our styles are made in a <strong className="font-semibold text-luxury-charcoal italic">free size, one size fits all, max plus sizes or can be customised!</strong>
          </p>
          <p>
            Yes, a petite size person, as well as a plus size person can wear our free size garments. For further assistance, do take some time to read our size instruction that accompanies every style displayed on this site. We are happy to clarify your queries, if any, about specific measurements / sizes etc. if you email us, before you decide to make your purchase.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-luxury-charcoal/5 gap-2">
            <span className="font-serif text-xs tracking-wider uppercase text-luxury-champagne font-semibold">
              thank you
            </span>
            <a 
              href="mailto:online@houseofsimons.com"
              className="text-[11px] text-luxury-charcoal hover:text-luxury-champagne font-medium flex items-center space-x-1"
            >
              <Mail size={12} className="text-luxury-champagne" />
              <span>Email queries: <strong>online@houseofsimons.com</strong></span>
            </a>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between border-b border-luxury-charcoal/10 pb-3 mb-4">
          <span className="text-xs uppercase tracking-luxury font-semibold text-luxury-charcoal">
            Standard Measurements Reference
          </span>
          <div className="flex space-x-3">
            <button
              onClick={() => setUnit('INCHES')}
              className={`text-xs uppercase tracking-luxury font-medium pb-1 border-b-2 transition-all ${
                unit === 'INCHES' ? 'border-luxury-charcoal text-luxury-charcoal font-semibold' : 'border-transparent text-luxury-muted'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('CM')}
              className={`text-xs uppercase tracking-luxury font-medium pb-1 border-b-2 transition-all ${
                unit === 'CM' ? 'border-luxury-charcoal text-luxury-charcoal font-semibold' : 'border-transparent text-luxury-muted'
              }`}
            >
              Centimeters (CM)
            </button>
          </div>
        </div>

        {/* Measurements Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-luxury-charcoal/10 text-luxury-muted uppercase tracking-wider">
                <th className="py-2.5 font-semibold">Size</th>
                <th className="py-2.5 font-semibold">Bust ({unit})</th>
                <th className="py-2.5 font-semibold">Waist ({unit})</th>
                <th className="py-2.5 font-semibold">Hip ({unit})</th>
                <th className="py-2.5 font-semibold">Length ({unit})</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((row) => (
                <tr key={row.size} className="border-b border-luxury-charcoal/5 text-luxury-charcoal hover:bg-luxury-beige/25 transition-colors">
                  <td className="py-2.5 font-semibold">{row.size}</td>
                  <td className="py-2.5">{formatVal(row.bust)}</td>
                  <td className="py-2.5">{formatVal(row.waist)}</td>
                  <td className="py-2.5">{formatVal(row.hip)}</td>
                  <td className="py-2.5">{formatVal(row.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional guidance */}
        <div className="mt-6 bg-luxury-beige/40 p-4 border-l-2 border-luxury-champagne text-[11px] text-luxury-muted space-y-1.5 rounded-r">
          <p className="font-semibold text-luxury-charcoal uppercase tracking-luxury text-[10px]">HOW TO MEASURE:</p>
          <p><strong>Bust:</strong> Measure around the fullest part of your chest with your arms relaxed.</p>
          <p><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</p>
          <p><strong>Hip:</strong> Measure around the widest part of your hips (approx. 8 inches below natural waist).</p>
        </div>

      </div>
    </div>
  );
}
