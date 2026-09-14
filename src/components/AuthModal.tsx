import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_PRIMARY_EMAIL } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        await register(email, password, name.trim(), phone.trim());
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your account email address');
          setLoading(false);
          return;
        }
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your email. Check your inbox.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed. Please check your details.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No customer account found with this email.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-center animate-fade-in" id="auth-modal">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-[#E7E2D9] overflow-hidden z-10">
        
        {/* Header with Brand styling */}
        <div className="p-6 bg-[#1A362B] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            id="auth-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <span className="font-serif-heading text-2xl font-bold tracking-[0.15em] text-[#EAD098]">
              MATIRA
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D1E0D7] -mt-0.5">
              Pure Indian Grocery & Spices
            </span>
          </div>

          <h3 className="font-serif-heading text-lg font-semibold mt-4 text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Customer Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-[#D1E0D7] mt-0.5">
            {mode === 'login' && 'Sign in to access your orders, saved addresses and cart'}
            {mode === 'register' && 'Join MATIRA for pure, chemical-free kitchen staples'}
            {mode === 'forgot' && "Enter your email and we'll send you a recovery link"}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#B91C1C] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#15803D] flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
              />
            </div>
            {email.trim().toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() && (
              <p className="text-[11px] text-[#1A362B] font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-[#1A362B]" /> Recognized Primary Admin: {ADMIN_PRIMARY_EMAIL}
              </p>
            )}
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#44403C]">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] text-[#2D5A47] hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            id="auth-submit-btn"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              <>
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle between login / register */}
          <div className="pt-2 text-center text-xs text-[#57534E]">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('register');
                  }}
                  className="text-[#1A362B] font-bold hover:underline"
                >
                  Register Now
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('login');
                  }}
                  className="text-[#1A362B] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-[#1A362B] font-bold hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
