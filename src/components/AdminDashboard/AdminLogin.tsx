import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#060A16] text-right">
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#060A16] to-[#060A16] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/30 bg-slate-900/90 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Top Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-3">
            <div className="h-full w-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <Crown className="h-7 w-7 text-amber-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gold-gradient">
            لوحة الإدارة والتحكم الملكية
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            ABDULLAH IN TURKEY • ADMIN PORTAL
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              البريد الإلكتروني للأدمن
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                placeholder="3lishops@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-amber-400/25 bg-slate-950/70 px-4 py-3 pl-10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-amber-400/25 bg-slate-950/70 px-4 py-3 pl-10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-bold text-slate-950 text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105"
          >
            <span>{loading ? 'جاري التحقق...' : 'تسجيل دخول كمدير'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Strict Security Notice & Return to Site */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400/80">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>تسجيل الدخول محمي ومقتصر حصرياً على حساب المدير المعتمد</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              العودة لصفحة الموقع العامة
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
