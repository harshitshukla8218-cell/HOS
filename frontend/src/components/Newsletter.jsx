import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('Subscribing...');
    setTimeout(() => {
      setStatus('THANK YOU FOR JOINING THE INNER CIRCLE.');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-24 bg-atelier-coral border-t border-b border-luxury-charcoal/5 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">

        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/80 font-semibold mb-3">
          HOS MEMBERSHIP
        </span>

        <h2 className="editorial-title-md text-white uppercase tracking-widest leading-tight">
          JOIN THE HOS INNER CIRCLE
        </h2>

        <p className="text-xs md:text-sm text-white/85 mt-4 max-w-lg leading-relaxed font-light uppercase tracking-wider">
          Be the first to discover new collections, private previews and exclusive releases.
        </p>

        {status === 'THANK YOU FOR JOINING THE INNER CIRCLE.' ? (
          <div className="mt-8 text-white text-xs tracking-widest font-semibold fade-in-up uppercase">
            {status}
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-10 w-full max-w-md flex flex-col sm:flex-row items-stretch gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              required
              className="flex-1 bg-white border border-white/70 px-4 py-3.5 text-xs text-luxury-charcoal placeholder:text-luxury-charcoal/50 tracking-luxury focus:outline-none focus:border-luxury-gold rounded-sm"
            />
            <button
              type="submit"
              disabled={status === 'Subscribing...'}
              className="bg-luxury-nearblack hover:bg-luxury-gold text-white px-8 py-3.5 text-xs uppercase tracking-luxury font-medium transition-colors duration-300 rounded-sm"
            >
              {status === 'Subscribing...' ? '...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
