import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../services/notificationService';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2D5A47]">
          Get in Touch
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#1C1917]">
          Contact MATIRA Natural Foods
        </h1>
        <p className="text-xs sm:text-base text-[#78716C] leading-relaxed">
          Have an inquiry about our pure Rajasthan cumin, wood-pressed oils, or bulk custom orders? Our team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A362B] text-white rounded-3xl p-8 space-y-6 border border-[#2D5A47] shadow-xl">
            <h2 className="font-serif-heading text-2xl font-bold text-[#EAD098]">
              Registered Office & Hub
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#D1E0D7]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EAD098] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">MATIRA Natural Foods</p>
                  <p>{BUSINESS_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#EAD098] shrink-0" />
                <div>
                  <p className="font-bold text-white">Phone & WhatsApp</p>
                  <a href="tel:+919330713861" className="hover:text-white underline">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#EAD098] shrink-0" />
                <div>
                  <p className="font-bold text-white">Email Address</p>
                  <a href={`mailto:${BUSINESS_INFO.adminEmail}`} className="hover:text-white underline">
                    {BUSINESS_INFO.adminEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#EAD098] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Operating Hours</p>
                  <p>Monday – Saturday: 9:00 AM – 7:30 PM IST</p>
                  <p className="text-[#A3B8AC] text-xs">Sunday: Online Orders Monitored</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA button */}
            <div className="pt-4 border-t border-[#2D5A47]">
              <a
                href="https://wa.me/919330713861?text=Hello%20MATIRA%20Natural%20Foods,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7E2D9] p-8 shadow-sm">
          <h2 className="font-serif-heading text-xl font-bold text-[#1C1917] mb-2">
            Send Us a Message
          </h2>
          <p className="text-xs text-[#78716C] mb-6">
            Fill in your details and message below. We will reply via email or WhatsApp promptly.
          </p>

          {submitted ? (
            <div className="p-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#15803D] mx-auto" />
              <h3 className="font-serif-heading text-xl font-bold text-[#15803D]">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#14532D] max-w-md mx-auto">
                Thank you for contacting MATIRA Natural Foods. Our Kolkata team will get back to you shortly at <strong>{email || phone}</strong>.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-5 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sen"
                    className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  >
                    <option value="">General Inquiry</option>
                    <option value="order">Existing Order Status</option>
                    <option value="bulk">Bulk / Corporate Spice Hamper</option>
                    <option value="sourcing">Product Quality / Sourcing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help your kitchen today?"
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
