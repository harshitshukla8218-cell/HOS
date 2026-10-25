import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, X, MessageSquare, Sparkles } from 'lucide-react';
import api from '../utils/api.js';

export default function CoutureAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to House of Simons. I am your HOS Couture Assistant. How may I assist you with styling or sizing recommendations today?",
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate smart AI delay
    setTimeout(async () => {
      let replyText = "I would be delighted to assist you further. You can browse our collections or ask about custom fits, sizes, and specific garment edits!";
      let recommendedProducts = [];

      try {
        const query = textToSend.toLowerCase();
        const catalog = await api.get('/products');

        if (query.includes('dress') || query.includes('draped')) {
          replyText = "For editorial draping, I highly recommend our **Aurelia Draped Dress** (₹18,900) or the **Monroe Evening Dress** (₹29,900) for grand events.";
          recommendedProducts = catalog.filter(p => p.category === 'Dresses');
        } else if (query.includes('gown') || query.includes('pleated') || query.includes('celeste')) {
          replyText = "The **Celeste Pleated Gown** (₹34,900) is crafted in ethereal micro-pleated chiffon, perfect for formal evening guests.";
          recommendedProducts = catalog.filter(p => p.category === 'Gowns');
        } else if (query.includes('co-ord') || query.includes('suit') || query.includes('tailored')) {
          replyText = "Our **Simone Tailored Co-Ord** (₹22,500) features structured crepe blazer tailoring, which projects confidence and elegance.";
          recommendedProducts = catalog.filter(p => p.category === 'Co-ords');
        } else if (query.includes('jacket') || query.includes('blazer') || query.includes('elara')) {
          replyText = "The **Elara Sculpted Jacket** (₹24,900) features strong shoulders and corset waist structure, making it ideal for transitional wear.";
          recommendedProducts = catalog.filter(p => p.category === 'Jackets');
        } else if (query.includes('resort') || query.includes('vacation') || query.includes('linen')) {
          replyText = "The **Sienna Resort Set** (₹21,900) in linen-silk blend is perfect for holiday ease and sun-drenched brunches.";
          recommendedProducts = catalog.filter(p => p.slug.includes('resort') || p.category === 'Co-ords');
        } else if (query.includes('size') || query.includes('fit') || query.includes('measure')) {
          replyText = "We carry sizes from XS to XL. You can check specific measurements (Bust, Waist, Hip, Length) by clicking the Size Guide link on any product page.";
        } else if (query.includes('shipping') || query.includes('delivery')) {
          replyText = "We offer FREE express shipping across India on orders above ₹15,000, typically delivering in 3-5 days. International orders deliver in 7-10 days.";
        } else if (query.includes('new') || query.includes('arrivals') || query.includes('latest')) {
          replyText = "Here are the latest contemporary silhouettes fresh from the HOS design house:";
          recommendedProducts = catalog.filter(p => p.newArrival).slice(0, 2);
        }
      } catch (err) {
        console.error(err);
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        products: recommendedProducts
      }]);
      setTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. COLLAPSED FLOATING PILL WIDGET (Matches user uploaded image) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-[#9C726E] text-white py-3 px-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border border-white/10 group text-left"
          style={{ boxShadow: '0 10px 30px -5px rgba(156, 114, 110, 0.4)' }}
        >
          {/* Avatar container */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-luxury-ivory flex-none">
            <img 
              src="/anushkas-atelier.png" 
              alt="Anushka Avatar" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Fail-safe if image isn't loaded yet
                e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100"
              }}
            />
            {/* Green active dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
          </div>

          {/* Text Labels */}
          <div className="ml-3.5 pr-2">
            <span className="block text-[11px] font-bold tracking-widest leading-none uppercase">
              HOS
            </span>
            <span className="block text-[8px] tracking-wider text-white/70 uppercase mt-1">
              COUTURE ASSISTANT
            </span>
          </div>
        </button>
      )}

      {/* 2. EXPANDED CHAT PANEL */}
      {isOpen && (
        <div 
          className="bg-luxury-ivory border border-luxury-charcoal/10 w-[330px] md:w-[360px] h-[480px] rounded-xl shadow-2xl flex flex-col overflow-hidden fade-in-up"
          style={{ boxShadow: '0 15px 40px -10px rgba(0,0,0,0.15)' }}
        >
          
          {/* Header */}
          <div className="bg-[#9C726E] text-white p-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white">
                <img src="/anushkas-atelier.png" alt="Anushka Avatar" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="ml-3">
                <span className="block text-xs font-bold tracking-widest uppercase">HOS</span>
                <span className="block text-[8px] tracking-wider text-white/80 uppercase">COUTURE ASSISTANT</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Minimize assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages pane */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-luxury-beige/10">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] text-xs p-3 rounded-lg leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-luxury-charcoal text-luxury-ivory rounded-br-none' 
                      : 'bg-white text-luxury-charcoal border border-luxury-charcoal/5 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Render Recommended products card inline */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 grid grid-cols-2 gap-2.5 w-full">
                    {msg.products.map(p => (
                      <Link 
                        key={p._id} 
                        to={`/products/${p.slug}`} 
                        onClick={() => setIsOpen(false)}
                        className="bg-white border border-luxury-charcoal/5 p-2 rounded-md hover:border-luxury-champagne transition-colors block text-left"
                      >
                        <img src={p.images[0]} alt="" className="w-full aspect-[4/5] object-cover rounded-sm bg-luxury-beige" />
                        <h4 className="font-serif text-[10px] font-semibold text-luxury-charcoal mt-1 truncate">{p.name}</h4>
                        <p className="text-[9px] text-luxury-muted mt-0.5">₹{p.price.toLocaleString('en-IN')}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator bubble */}
            {typing && (
              <div className="flex flex-col items-start">
                <div className="bg-white text-luxury-muted text-[10px] p-2.5 rounded-lg border border-luxury-charcoal/5 rounded-bl-none flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-luxury-muted/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-luxury-muted/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-luxury-muted/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations chips */}
          <div className="px-4 py-2 bg-luxury-beige/30 flex space-x-2 overflow-x-auto no-scrollbar border-t border-luxury-charcoal/5 flex-none">
            <button 
              onClick={() => handleSend('Recommend an Evening Gown')}
              className="text-[9px] uppercase tracking-luxury text-luxury-charcoal bg-white border border-luxury-charcoal/10 hover:border-luxury-charcoal px-2.5 py-1 rounded-full flex-none transition-colors"
            >
              Evening Gown
            </button>
            <button 
              onClick={() => handleSend('Find summer Resort sets')}
              className="text-[9px] uppercase tracking-luxury text-luxury-charcoal bg-white border border-luxury-charcoal/10 hover:border-luxury-charcoal px-2.5 py-1 rounded-full flex-none transition-colors"
            >
              Resort Sets
            </button>
            <button 
              onClick={() => handleSend('What is the shipping policy?')}
              className="text-[9px] uppercase tracking-luxury text-luxury-charcoal bg-white border border-luxury-charcoal/10 hover:border-luxury-charcoal px-2.5 py-1 rounded-full flex-none transition-colors"
            >
              Shipping Policy
            </button>
          </div>

          {/* Input form */}
          <div className="p-3 border-t border-luxury-charcoal/5 flex items-center space-x-2 bg-white flex-none">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-luxury-ivory text-xs px-3.5 py-2.5 focus:outline-none focus:border-luxury-champagne rounded-full border border-transparent"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="bg-luxury-charcoal text-white hover:bg-luxury-champagne p-2.5 rounded-full transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
