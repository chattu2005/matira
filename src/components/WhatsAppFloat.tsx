import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/919330713861?text=Hello%20MATIRA%20Natural%20Foods,%20I%20have%20an%20inquiry%20about%20your%20products."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      title="Chat with MATIRA on WhatsApp: +91 9330713861"
      id="floating-whatsapp-btn"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        Order on WhatsApp
      </span>
    </a>
  );
};
